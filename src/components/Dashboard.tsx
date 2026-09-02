
import { useState, useEffect } from 'react';
import NeuralGraph3D from './NeuralGraph3D';

interface DashboardProps {
  // Just dummy props since we only need the visual
  [key: string]: any;
}

export default function Dashboard(_props?: DashboardProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/system-metrics');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const ramText = metrics 
    ? `${metrics.ram.usedGb}/${metrics.ram.totalGb} GB` 
    : "13/32 GB";
    
  const cpuText = metrics
    ? `${metrics.cpu.usagePercent}%`
    : "93%";

  const isCpuHigh = metrics ? metrics.cpu.usagePercent > 80 : true;

  return (
    <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8] px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-[fadeIn_0.3s_ease-out]">
          {toastMessage}
        </div>
      )}

      {/* Status Bar */}
      <div className="h-8 border-b border-white/[0.05] flex items-center justify-between px-4 font-mono text-[9px] uppercase tracking-wider font-bold shrink-0 bg-[#030406]/60 backdrop-blur-md">
        {/* Left red warning */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-rose-500 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/30">
            <span className="animate-pulse">⚠ C: DRIVE</span>
            <span className="text-rose-400 font-normal">4.2 GB free of 237.7 GB — CRITICAL: Clean before leaving!</span>
            <button className="ml-2 px-1.5 py-0.5 border border-rose-500/50 hover:bg-rose-500/20 rounded transition-colors text-[8px] cursor-pointer active:scale-95" onClick={() => { navigator.clipboard.writeText("cleanmgr.exe"); showToast("Copied disk cleanup command"); }}>COPY FIX CMD</button>
            <button className="ml-1 px-1.5 py-0.5 bg-amber-500 text-black border border-amber-400 hover:bg-amber-400 rounded transition-colors text-[8px] cursor-pointer active:scale-95" onClick={() => showToast("Initiating smart fix...")}>SMART FIX</button>
          </div>
        </div>

        {/* Center yellow warning */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded border ${isCpuHigh ? 'text-amber-400 bg-amber-950/20 border-amber-900/30' : 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30'}`}>
            <span>◆ CPU {cpuText} RAM {ramText}</span>
            <span className={`${isCpuHigh ? 'text-amber-300' : 'text-emerald-300'} font-normal`}>
              {metrics ? `Cores: ${metrics.cpu.cores} · ${metrics.cpu.model}` : "305 processes · 129 services · Check LM Studio + OpenClaw load"}
            </span>
            <button className={`ml-2 px-1.5 py-0.5 border rounded transition-colors text-[8px] cursor-pointer active:scale-95 ${isCpuHigh ? 'border-amber-500/50 hover:bg-amber-500/20' : 'border-emerald-500/50 hover:bg-emerald-500/20'}`} onClick={() => { navigator.clipboard.writeText("taskkill /F /IM lmstudio.exe"); showToast("Copied kill command"); }}>COPY FIX CMD</button>
          </div>
        </div>

        {/* Right green status */}
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
            <span>✓ CRD</span>
            <span className="text-emerald-300 font-normal">Chrome Remote Desktop: RUNNING · Ready for abroad access</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
         {/* Render the 3D graph as the background */}
         <div className="absolute inset-0 flex items-center justify-center opacity-60 mix-blend-screen pointer-events-none">
            <NeuralGraph3D intelligenceIndex={100} knowledgeNodes={500} synthesizedPathways={1200} modelColors={["#38bdf8", "#818cf8"]} />
            
            <div className="absolute w-[400px] h-[400px] bg-[#38bdf8]/10 rounded-full blur-[100px]" />
         </div>

         <div className="relative z-10 flex flex-col items-center select-none pt-12">
            <h2 className="text-[#0ea5e9] text-[10px] font-mono tracking-[0.3em] font-bold uppercase mb-4 opacity-80 shadow-sky-500/20 drop-shadow-md">
              ◈ MODY'S AGENTIC SUPER AI COMMAND CENTER • MAY 25-26, 2026 ◈
            </h2>
            
            <h1 className="text-[120px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-[#38bdf8] drop-shadow-[0_0_40px_rgba(56,189,248,0.4)] relative">
              JARVIS
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent mix-blend-overlay pointer-events-none" />
            </h1>
            
            <p className="text-[#38bdf8] text-[11px] font-mono tracking-[0.4em] font-bold uppercase mt-6 opacity-60">
              48-HOUR SPRINT • REMOTE OPERATIONS • HIGGSFIELD ACTIVE
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-4xl font-mono text-[9px] font-bold uppercase tracking-wider">
               <button 
                 onClick={() => { navigator.clipboard.writeText("net start ChromeRemoteDesktop"); showToast("Copied CRD restart command"); }}
                 className="px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-900/40 transition-all cursor-pointer active:scale-95" title="Copy restart command">
                 <span>✓</span> CRD RUNNING
               </button>
               <button 
                 onClick={() => { navigator.clipboard.writeText("shell:startup"); showToast("Copied startup command"); }}
                 className="px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-900/40 transition-all cursor-pointer active:scale-95" title="Copy startup command">
                 <span>✓</span> JARVIS_AUTOBOOT IN STARTUP
               </button>
               <button 
                 onClick={() => { navigator.clipboard.writeText("node gateway.js"); showToast("Copied gateway command"); }}
                 className="px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-900/40 transition-all cursor-pointer active:scale-95" title="Copy gateway command">
                 <span>✓</span> OPENCLAW GATEWAY ACTIVE
               </button>
               <button 
                 onClick={() => { navigator.clipboard.writeText("cleanmgr.exe /sagerun:1"); showToast("Copied cleanup command"); }}
                 className="px-3 py-1.5 rounded bg-rose-950/30 border border-rose-500/30 text-rose-400 flex items-center gap-2 shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:bg-rose-900/40 transition-all cursor-pointer active:scale-95" title="Copy cleanup command">
                 <span className="animate-pulse">⚠</span> C: DRIVE 6% FREE
               </button>
               <button 
                 onClick={() => { navigator.clipboard.writeText("npm run start:mcp"); showToast("Copied MCP command"); }}
                 className="px-3 py-1.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-400 flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:bg-amber-900/40 transition-all cursor-pointer active:scale-95" title="Copy MCP command">
                 <span>◆</span> HIGGSFIELD MCP PENDING
               </button>
               <button 
                 onClick={() => { navigator.clipboard.writeText("python train_soul.py"); showToast("Copied training command"); }}
                 className="px-3 py-1.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-400 flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:bg-amber-900/40 transition-all cursor-pointer active:scale-95" title="Copy training command">
                 <span>◆</span> SOUL CHARACTER TRAINING PENDING
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
