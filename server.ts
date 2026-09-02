import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import { createServer as createViteServer } from "vite";
import si from 'systeminformation';

import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

interface WorkspaceFile {
  name: string;
  path: string;
  size: number;
  type: string;
  mtime: string;
}

function scanDir(dirPath: string, rootDir: string, filesList: WorkspaceFile[] = []): WorkspaceFile[] {
  if (!fs.existsSync(dirPath)) return filesList;
  
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file === "node_modules" || file === ".git" || file === "dist" || file === "package-lock.json" || file === ".next" || file === "build") {
      continue;
    }
    const fullPath = path.join(dirPath, file);
    const relativePath = path.relative(rootDir, fullPath);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        scanDir(fullPath, rootDir, filesList);
      } else {
        const ext = path.extname(file).toLowerCase().substring(1);
        filesList.push({
          name: file,
          path: relativePath,
          size: stats.size,
          type: ext || "file",
          mtime: stats.mtime.toISOString()
        });
      }
    } catch (err: any) {
      // ignore unreadable files
    }
  }
  return filesList;
}

// Lazy initializer for Gemini client to prevent startup crash if API key is not yet set
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiInstance;
}

// ==================== API ROUTES ====================

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Hardware Sync API
app.get("/api/hardware-sync", async (_req, res) => {
  try {
    const cpu = await si.cpu();
    const cpuTemp = await si.cpuTemperature();
    const mem = await si.mem();
    const osInfo = await si.osInfo();
    const graphics = await si.graphics();
    const load = await si.currentLoad();

    res.json({
      cpu,
      cpuTemp,
      mem,
      osInfo,
      graphics,
      load
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// OS Metrics
app.get("/api/os-metrics", (_req, res) => {
  try {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }     
      totalIdle += cpu.times.idle;
    });
    
    // Approximation, usually we'd sample twice to get actual CPU usage over a delta,
    // but this gives a quick metric
    
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    
    res.json({
      cpuLoad: Math.round(((totalTick - totalIdle) / totalTick) * 100) || 5, // fallback if error
      memoryUsedStr: (usedMem / 1024 / 1024 / 1024).toFixed(2) + " GB",
      memoryTotalStr: (totalMem / 1024 / 1024 / 1024).toFixed(2) + " GB",
      memoryPct: Math.round((usedMem / totalMem) * 100),
      uptime: os.uptime(),
      platform: os.platform(),
      time: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Scan Workspace File System
app.get("/api/scan-workspace", (_req, res) => {
  try {
    const rootDir = process.cwd();
    const filesList: WorkspaceFile[] = [];
    
    // Scan specific targets: skills, src, data
    const scanPaths = [
      path.join(rootDir, "skills"),
      path.join(rootDir, "src"),
      path.join(rootDir, "data")
    ];
    
    for (const p of scanPaths) {
      if (fs.existsSync(p)) {
        scanDir(p, rootDir, filesList);
      }
    }
    
    // Include important root configuration files
    const rootFiles = ["package.json", "tsconfig.json", "vite.config.ts", "index.html", "metadata.json", ".env.example"];
    for (const file of rootFiles) {
      const fullPath = path.join(rootDir, file);
      if (fs.existsSync(fullPath)) {
        try {
          const stats = fs.statSync(fullPath);
          const ext = path.extname(file).toLowerCase().substring(1);
          filesList.push({
            name: file,
            path: file,
            size: stats.size,
            type: ext || "file",
            mtime: stats.mtime.toISOString()
          });
        } catch (e) {}
      }
    }
    
    res.json({ files: filesList });
  } catch (err: any) {
    console.error("Workspace scan error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Read Workspace File Content
app.get("/api/workspace-file-content", (req, res) => {
  try {
    const filePath = req.query.path as string;
    if (!filePath) {
      return res.status(400).json({ error: "Path is required" });
    }
    
    const rootDir = process.cwd();
    const resolvedPath = path.resolve(rootDir, filePath);
    if (!resolvedPath.startsWith(rootDir)) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    if (resolvedPath.includes("node_modules") || resolvedPath.includes(".git")) {
      return res.status(403).json({ error: "Access denied to system directory" });
    }
    
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const content = fs.readFileSync(resolvedPath, "utf-8");
    res.json({ content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SSE Streaming Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { modelId, contents, systemPrompt, temperature, thinkingLevel, useSearch } = req.body;
    const ai = getGeminiClient();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let stream;
    let chosenModel = modelId || "gemini-3.5-flash";
    let isFallback = false;

    try {
      // Attempt generation with primary model
      stream = await ai.models.generateContentStream({
        model: chosenModel,
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: temperature ?? 0.7,
          ...(useSearch ? { tools: [{ googleSearch: {} }] } : {}),
          // thinkingConfig only supported on Gemini 3 series
          ...(thinkingLevel && chosenModel.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel } } : {})
        }
      });
    } catch (firstErr: any) {
      const errStr = firstErr.message || "";
      const isQuotaOrAvailabilityError = /429|quota|RESOURCE_EXHAUSTED|not found|not support/i.test(errStr);
      
      if (isQuotaOrAvailabilityError && chosenModel !== "gemini-3.5-flash") {
        console.warn(`[Gemini Server] Primary model ${chosenModel} encountered error: ${errStr}. Falling back to gemini-3.5-flash...`);
        chosenModel = "gemini-3.5-flash";
        isFallback = true;
        stream = await ai.models.generateContentStream({
          model: chosenModel,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: temperature ?? 0.7,
            ...(useSearch ? { tools: [{ googleSearch: {} }] } : {})
          }
        });
      } else if (isQuotaOrAvailabilityError) {
        console.warn(`[Gemini Server] Model ${chosenModel} encountered error: ${errStr}. Falling back to gemini-3.1-flash-lite...`);
        chosenModel = "gemini-3.1-flash-lite";
        isFallback = true;
        stream = await ai.models.generateContentStream({
          model: chosenModel,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: temperature ?? 0.7,
            ...(useSearch ? { tools: [{ googleSearch: {} }] } : {})
          }
        });
      } else {
        throw firstErr;
      }
    }

    for await (const chunk of stream) {
      const text = chunk.text || "";
      let groundingUrls: Array<{ title: string; url: string }> = [];

      // Extract search grounding metadata if available
      const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        groundingUrls = chunks
          .filter((c: any) => c.web?.uri)
          .map((c: any) => ({
            title: c.web?.title || c.web?.uri,
            url: c.web?.uri
          }));
      }

      res.write(`data: ${JSON.stringify({ 
        text, 
        groundingUrls, 
        fallbackModel: isFallback ? chosenModel : undefined 
      })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    console.error("Gemini Streaming Error:", err);
    let errorMessage = err.message || "Unknown error";
    if (/429|quota|RESOURCE_EXHAUSTED/i.test(errorMessage)) {
      errorMessage = "QUOTA_EXCEEDED: You have exceeded your Gemini API quota or do not have billing enabled.";
    }
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
});

// Proxy to n8n Webhook
app.post("/api/webhook-proxy", async (req, res) => {
  try {
    const { url, payload } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    
    // We use dynamic import for node-fetch or just native fetch in Node 18+
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    res.json({ status: response.status, ok: response.ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Image Generation Proxy
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    let base64Image = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data || "";
          break;
        }
      }
    }

    if (base64Image) {
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } else {
      res.status(500).json({ error: "The model did not return any image data." });
    }
  } catch (err: any) {
    console.error("Gemini Image Gen Error:", err);
    let errorMessage = err.message || "Unknown error";
    if (/429|quota|RESOURCE_EXHAUSTED/i.test(errorMessage)) {
      errorMessage = "QUOTA_EXCEEDED: You have exceeded your Gemini API quota or do not have billing enabled.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// Audio Transcription Route using gemini-3.5-flash
app.post("/api/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: "Audio data is required" });
    }

    const ai = getGeminiClient();

    let rawBase64 = audioBase64;
    let detectedMimeType = mimeType || "audio/webm";

    const match = audioBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      detectedMimeType = match[1];
      rawBase64 = match[2];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: detectedMimeType,
            data: rawBase64
          }
        },
        "Please transcribe this audio exactly. Do not add any extra text, introductory remarks, or comments."
      ]
    });

    const transcription = response.text || "";
    res.json({ text: transcription.trim() });
  } catch (err: any) {
    console.error("Gemini Transcription Error:", err);
    let errorMessage = err.message || "Unknown error";
    if (/429|quota|RESOURCE_EXHAUSTED/i.test(errorMessage)) {
      errorMessage = "QUOTA_EXCEEDED: You have exceeded your Gemini API quota or do not have billing enabled.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// ==================== SYSTEM METRICS API ====================
app.get("/api/system-metrics", (_req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpus = os.cpus();
    
    // Calculate CPU usage (basic average)
    let idle = 0;
    let total = 0;
    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        total += cpu.times[type as keyof typeof cpu.times];
      }
      idle += cpu.times.idle;
    });
    
    const cpuUsage = total > 0 ? 100 - Math.round((100 * idle) / total) : 0;
    
    // We mock the C drive info for consistency with the design, but provide real RAM/CPU
    res.json({
      ram: {
        totalGb: (totalMem / (1024 * 1024 * 1024)).toFixed(1),
        usedGb: (usedMem / (1024 * 1024 * 1024)).toFixed(1)
      },
      cpu: {
        usagePercent: cpuUsage,
        cores: cpus.length,
        model: cpus[0]?.model
      },
      os: {
        platform: os.platform(),
        release: os.release()
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VITE MIDDLEWARE SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Mody OS] Running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
  });
}

startServer();
