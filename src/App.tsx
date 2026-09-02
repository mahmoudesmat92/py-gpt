import { motion } from 'motion/react';
import SystemToast from './components/SystemToast';
import { useState, useEffect, useRef } from 'react';

import ChatWindow from './components/ChatWindow';
import ConfigPanel from './components/ConfigPanel';
import Notepad from './components/Notepad';
import Dashboard from './components/Dashboard';
import DiagnosticsSuite from './components/DiagnosticsSuite';
import SkillsAssetsSuite from './components/SkillsAssetsSuite';
import { SystemTerminal } from './components/SystemTerminal';
import QuickActionsMenu from './components/QuickActionsMenu';
import SessionSidebar from './components/SessionSidebar';
import { Day01, Day02, Storage, Mcp, Comms } from './components/Placeholders';
import { Mode, ChatSession, Message, PRESETS } from './types';
import { 
  saveSessionToCloud, 
  deleteSessionFromCloud, 
  subscribeToSessions 
} from './firebase';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'day01' | 'day02' | 'notepad' | 'diagnostics' | 'storage' | 'mcp' | 'skills' | 'vfs_terminal' | 'comms' | 'terminal'>('dashboard');
  const [showConfig] = useState(true);
  const [accentMode, setAccentMode] = useState<'dark' | 'light'>('dark');
            const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
  const [attachmentMimeType, setAttachmentMimeType] = useState<string>('image/jpeg');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
    
  const isStreamingRef = useRef(false);
  const activeSessionIdRef = useRef('');

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  // Load and sync chat sessions from Firestore in real-time
  useEffect(() => {
    const unsubscribe = subscribeToSessions((cloudSessions) => {
      if (cloudSessions && cloudSessions.length > 0) {
        setSessions(prev => {
          if (isStreamingRef.current) {
            return cloudSessions.map(cs => {
              if (cs.id === activeSessionIdRef.current) {
                const localActive = prev.find(s => s.id === cs.id);
                return localActive ? localActive : cs;
              }
              return cs;
            });
          }
          return cloudSessions;
        });
        setActiveSessionId(prev => {
          if (!prev || !cloudSessions.some(s => s.id === prev)) {
            return cloudSessions[0].id;
          }
          return prev;
        });
      } else {
        // If empty, seed a default session in the cloud
        seedDefaultSession();
      }
    });

    return () => unsubscribe();
  }, []);

  const seedDefaultSession = async () => {
    const defaultPreset = PRESETS[0];
    const defaultSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Chat Session',
      messages: [],
      mode: 'chat',
      modelId: 'gemini-3.5-flash',
      presetId: defaultPreset.id,
      systemPrompt: defaultPreset.systemPrompt,
      notepadContent: '',
      temperature: 0.7,
      thinkingLevel: 'LOW',
      useSearch: false,
      createdAt: new Date().toISOString()
    };
    await saveSessionToCloud(defaultSession);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  
  const handleClearCodeBlocks = () => {
    updateActiveSession(session => {
      const updatedMessages = session.messages.map(msg => {
        if (msg.sender === 'user') return msg;
        
        const updatedParts = msg.parts.map(part => {
          if (part.type === 'text' && part.text) {
            return {
              ...part,
              text: part.text.replace(/```[\s\S]*?```/g, '\n_[Code block removed to save context]_\n')
            };
          }
          return part;
        });
        return { ...msg, parts: updatedParts };
      });
      return { ...session, messages: updatedMessages };
    });
  };

  const handleToggleAccent = () => {
    setAccentMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateActiveSession = async (updater: (s: ChatSession) => ChatSession) => {
    if (!activeSession) return;
    const updated = updater(activeSession);
    await saveSessionToCloud(updated);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  const handleCreateSession = async (mode: Mode) => {
    const defaultPreset = PRESETS[0];
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: `New Context [${mode.toUpperCase()}]`,
      messages: [],
      mode: mode,
      modelId: mode === 'image' ? 'gemini-3.1-flash-lite-image' : 'gemini-3.5-flash',
      presetId: defaultPreset.id,
      systemPrompt: defaultPreset.systemPrompt,
      notepadContent: '',
      temperature: 0.7,
      thinkingLevel: 'LOW',
      useSearch: false,
      createdAt: new Date().toISOString()
    };
    await saveSessionToCloud(newSession);
    setActiveSessionId(newSession.id);
      };

  const handleDeleteSession = async (id: string) => {
    await deleteSessionFromCloud(id);
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      seedDefaultSession();
    } else {
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      await saveSessionToCloud({ ...session, title: newTitle });
    }
  };

  const handleExportCurrentSession = () => {
    if (!activeSession) {
      alert("No active session to export.");
      return;
    }
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeSession, null, 2));
      const downloadAnchor = document.createElement('a');
      const safeTitle = activeSession.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mody-os-session-${safeTitle || 'export'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export current session failed:", err);
      alert("Failed to export current session.");
    }
  };

  const handleChangeMode = (mode: Mode) => {
    updateActiveSession(s => ({
      ...s,
      mode: mode,
      // Default to standard image gen model if image mode, gemini-3.1-pro-preview for vision, or flash if text
      modelId: mode === 'image' 
        ? 'gemini-3.1-flash-lite-image' 
        : mode === 'vision' 
        ? 'gemini-3.1-pro-preview' 
        : 'gemini-3.5-flash'
    }));
  };

  const handleClearHistory = () => {
    updateActiveSession(s => ({
      ...s,
      messages: []
    }));
  };

    // Inserts notepad text into active chat input
  const handleSendToChatInput = (val: string) => {
    // To do this simply, we'll append to the current input context
    const inputElement = document.getElementById('chat-input-textarea') as HTMLTextAreaElement;
    if (inputElement) {
      inputElement.value = val;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      setActiveTab('terminal');
    }
  };

  const handleSendMessage = async (text: string, imageBase64?: string) => {
    if (!activeSession) return;
    isStreamingRef.current = true;

    // Create a user message object
    const userMsgParts = [];
    if (imageBase64) {
      if (attachmentMimeType.startsWith('video/')) {
        userMsgParts.push({ type: 'video' as const, videoUrl: imageBase64 });
      } else {
        userMsgParts.push({ type: 'image' as const, imageUrl: imageBase64 });
      }
    }
    if (text.trim()) {
      userMsgParts.push({ type: 'text' as const, text: text.trim() });
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      parts: userMsgParts,
      timestamp: new Date().toLocaleTimeString()
    };

    const currentMessages = [...activeSession.messages, userMessage];

    // Update session title on the very first message if default
    let newTitle = activeSession.title;
    if (activeSession.title === 'New Chat Session' || activeSession.title.startsWith('New Context')) {
      newTitle = text.length > 25 ? text.substring(0, 25) + '...' : text;
    }

    // If we have an image/video, force use model gemini-3.1-pro-preview
    const finalModelId = imageBase64 ? 'gemini-3.1-pro-preview' : activeSession.modelId;

    // Set immediate UI state
    updateActiveSession(s => ({
      ...s,
      title: newTitle,
      messages: currentMessages,
      ...(imageBase64 ? { modelId: 'gemini-3.1-pro-preview' } : {})
    }));
    setAttachmentBase64(null); // Reset preview
    setIsLoading(true);

    try {
      if (activeSession.mode === 'image') {
        // Image generation API call
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text })
        });
        
        const rawText = await response.text();
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          throw new Error("Invalid JSON response: " + rawText.slice(0, 50));
        }
  

        if (response.ok && data.imageUrl) {
          const assistantMsg: Message = {
            id: `msg_${Date.now()}_assistant`,
            sender: 'assistant',
            parts: [
              { type: 'image', imageUrl: data.imageUrl },
              { type: 'text', text: `Here is your generated image for prompt: *"${text}"*` }
            ],
            timestamp: new Date().toLocaleTimeString()
          };
          updateActiveSession(s => ({
            ...s,
            messages: [...currentMessages, assistantMsg]
          }));
        } else {
          throw new Error(data.error || 'Failed to generate image');
        }
      } else {
        // Regular Text or Vision API Chat Streaming via SSE
        const formattedContents = currentMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: msg.parts.map(part => {
            if (part.type === 'image' && part.imageUrl) {
              const match = part.imageUrl.match(/^data:([^;]+);base64,(.+)$/);
              if (match) {
                return {
                  inlineData: {
                    mimeType: match[1],
                    data: match[2]
                  }
                };
              }
            }
            if (part.type === 'video' && part.videoUrl) {
              const match = part.videoUrl.match(/^data:([^;]+);base64,(.+)$/);
              if (match) {
                return {
                  inlineData: {
                    mimeType: match[1],
                    data: match[2]
                  }
                };
              }
            }
            return { text: part.text || '' };
          })
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelId: finalModelId,
            contents: formattedContents,
            systemPrompt: activeSession.systemPrompt + (false ? "\n\nIMPORTANT: You must translate ALL of your responses to Egyptian Arabic (العامية المصرية) regardless of the language the user uses to communicate. Do not respond in English or standard Arabic, respond strictly in natural Egyptian Arabic dialect." : ""),
            temperature: activeSession.temperature,
            thinkingLevel: activeSession.thinkingLevel,
            useSearch: activeSession.useSearch
          })
        });

        if (!response.body) throw new Error("No response body stream available.");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';
        let groundingUrls: Array<{ title: string; url: string }> = [];
        let fallbackModelUsed: string | undefined = undefined;

        // Pre-append blank message for real-time stream mapping
        const streamMsgId = `msg_${Date.now()}_assistant_stream`;
        const initialAssistantMsg: Message = {
          id: streamMsgId,
          sender: 'assistant',
          parts: [{ type: 'text', text: '' }],
          timestamp: new Date().toLocaleTimeString(),
          isStreaming: true
        };

        updateActiveSession(s => ({
          ...s,
          messages: [...currentMessages, initialAssistantMsg]
        }));

        let streamDone = false;
        while (!streamDone) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          const lines = chunkText.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              streamDone = true;
              break;
            }

            let parsed;
            try {
              parsed = JSON.parse(dataStr);
            } catch (err) {
              // Partial buffer parsing failure (re-buffered on next event loop)
              continue;
            }

            if (parsed.error) {
              throw new Error(parsed.error);
            }

            if (parsed.fallbackModel) {
              fallbackModelUsed = parsed.fallbackModel;
            }

            if (parsed.text) {
              assistantText += parsed.text;
            }
            if (parsed.groundingUrls && parsed.groundingUrls.length > 0) {
              groundingUrls = [...groundingUrls, ...parsed.groundingUrls];
            }

            // Update active stream bubble content incrementally
            setSessions(prev => prev.map(s => {
              if (s.id !== activeSession.id) return s;
              return {
                ...s,
                messages: s.messages.map(m => {
                  if (m.id === streamMsgId) {
                    return {
                      ...m,
                      parts: [{ type: 'text', text: assistantText }],
                      groundingUrls: groundingUrls.length > 0 ? groundingUrls : undefined
                    };
                  }
                  return m;
                })
              };
            }));
          }
        }

        // Finalize streaming state with optional fallback banner
        const notice = fallbackModelUsed ? `\n\n--- \n*⚡ **Model Fallback Active**: Automatically switched to **${fallbackModelUsed}** because the primary model exceeded its usage limits or has no billing configured.*` : '';
        const finalAssistantText = assistantText + notice;

        updateActiveSession(s => ({
          ...s,
          messages: s.messages.map(m => m.id === streamMsgId ? { 
            ...m, 
            parts: [{ type: 'text', text: finalAssistantText }],
            isStreaming: false 
          } : m)
        }));
      }
    } catch (err: any) {
      console.error("Submission Error:", err);
      
      let errorMessageText = `ERROR REGISTERED: ${err.message || 'Unknown network context mismatch.'}`;
      const isQuotaError = /429|quota|RESOURCE_EXHAUSTED/i.test(err.message || '');
      
      if (isQuotaError) {
        errorMessageText = `### ⚠️ Quota Exceeded (RESOURCE_EXHAUSTED)
Your active Gemini API key has exceeded its usage limits or has no billing setup.

**To resolve this:**
1. **Configure Billing / Add Card**: The requested model requires a paid key or your free quota is exhausted. Go to **Settings > Secrets** in AI Studio and make sure your key has billing attached.
2. **Switch Models**: Try changing to **Gemini 3.5 Flash** (a lightweight free-tier model) in the **Engine Settings** panel.
3. **Wait & Retry**: Free tier keys have strict rate limits per minute. Wait 60 seconds and try your request again.

*For more information on rate limits, consult the [Gemini API rate limits documentation](https://ai.google.dev/gemini-api/docs/rate-limits).*`;
      }

      const errorMsg: Message = {
        id: `msg_${Date.now()}_error`,
        sender: 'system',
        parts: [{ type: 'text', text: errorMessageText }],
        timestamp: new Date().toLocaleTimeString()
      };

      // Clean up any streaming placeholder messages and append the error card
      setSessions(prev => prev.map(s => {
        if (s.id !== activeSession.id) return s;
        const cleanedMessages = s.messages.filter(m => !m.isStreaming);
        return {
          ...s,
          messages: [...cleanedMessages, errorMsg]
        };
      }));
    } finally {
      setIsLoading(false);
      isStreamingRef.current = false;
      // Push final complete message state to Cloud Firestore
      setSessions(prev => {
        const latestActive = prev.find(s => s.id === activeSessionIdRef.current);
        if (latestActive) {
          saveSessionToCloud(latestActive);
        }
        return prev;
      });
    }
  };

  if (!activeSession) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center font-mono text-slate-500 relative overflow-hidden select-none">
        {/* Decorative 3D grid backdrops */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute w-[300px] h-[300px] bg-[#38bdf8]/10 blur-[80px] rounded-full animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/[0.08] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <span className="font-mono text-xs font-bold text-[#38bdf8] tracking-widest animate-pulse">OS</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] tracking-widest text-[#38bdf8] uppercase animate-pulse">CONNECTING NEURAL PIPELINE</p>
            <p className="text-[9px] text-slate-600 uppercase">BOOTING MODY OS v1.0.0</p>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div id="mody-os-workspace-root" className="h-screen w-screen bg-[#030406] text-[#f1f5f9] flex overflow-hidden relative">
      <SystemToast />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#38bdf8] rounded-full blur-[150px] opacity-[0.03] animate-pulse-glow-1 pointer-events-none" />
      <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-[#818cf8] rounded-full blur-[120px] opacity-[0.03] animate-pulse-glow-2 pointer-events-none" />

      
      <div className="flex-1 h-full flex flex-col min-w-0 bg-[#030406] relative z-10">
        
        {/* Tab Selection Bar */}
        <div id="tab-nav-bar" className="h-[50px] bg-[#030406]/90 backdrop-blur-xl border-b border-white/[0.05] px-4 flex items-center justify-between select-none flex-shrink-0 relative z-20">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-sky-500/[0.02] pointer-events-none" />
          
          <div className="flex items-center gap-3 w-[200px]">
            <div className="w-2.5 h-2.5 bg-[#38bdf8] rotate-45 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
            <span className="font-mono text-[11px] font-bold text-[#38bdf8] tracking-widest">JARVIS v2.0</span>
          </div>
          
          {/* Flat Tab Selection */}
          <div className="flex-1 flex items-center justify-center gap-6 relative z-10 font-mono text-[10px] uppercase tracking-wider font-bold">
            {[
              { id: 'dashboard', label: 'MISSION' },
              { id: 'day01', label: 'DAY 01' },
              { id: 'day02', label: 'DAY 02' },
              { id: 'notepad', label: 'OBSIDIAN' },
              { id: 'diagnostics', label: 'SYSTEM' },
              { id: 'storage', label: 'STORAGE' },
              { id: 'mcp', label: 'MCP' },
              { id: 'skills', label: 'SKILLS' },
              { id: 'vfs_terminal', label: 'REMOTE' },
              { id: 'comms', label: 'COMMS' },
              { id: 'terminal', label: 'AI CHAT' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`transition-all duration-300 relative py-3 ${
                  activeTab === tab.id ? 'text-[#38bdf8]' : 'text-[#0ea5e9]/40 hover:text-[#0ea5e9]/80'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabBottomLineFlat"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.8)] z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-end gap-6 w-[350px] font-mono text-[9px] tracking-widest text-[#38bdf8]/60 uppercase">
             <div className="flex items-center gap-4">
               <div className="flex flex-col text-right leading-tight">
                 <span className="text-[#38bdf8]">CPU 93%</span>
                 <span>RAM 13/32<br/>GB &nbsp; WIN11</span>
               </div>
               <div className="flex flex-col text-left leading-tight">
                 <span>•</span>
                 <span>05:43:55</span>
               </div>
               <div className="text-[#38bdf8] lowercase tracking-wide text-xs">
                 pagymody@gmail.com
               </div>
             </div>
             <div className="flex items-center gap-2">
               <button 
                 onClick={handleExportCurrentSession}
                 className="px-4 py-1.5 border border-[#38bdf8]/30 rounded bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 transition-colors text-[#38bdf8] hover:text-white cursor-pointer active:scale-95"
                 title="Export Session">
                 EXPORT
               </button>
               <button 
                 onClick={() => { window.location.reload(); }}
                 className="px-4 py-1.5 border border-white/5 rounded bg-white/[0.02] hover:bg-white/10 transition-colors text-white/50 hover:text-white cursor-pointer active:scale-95">
                 SIGN OUT
               </button>
             </div>
          </div>
        </div>

        {/* Tab Body View */}
        <div className="flex-1 flex min-h-0 relative">
          {activeTab === 'dashboard' && (
            <Dashboard setActiveTab={setActiveTab} />
          )}

          {activeTab === 'terminal' && (
            <div id="terminal-container" className="flex-1 h-full flex min-w-0 relative">
              {accentMode === 'light' && (
                <style>{`
                  #terminal-container .text-\\[\\#38bdf8\\] { color: #f43f5e !important; }
                  #terminal-container .border-\\[\\#38bdf8\\] { border-color: #f43f5e !important; }
                  #terminal-container .bg-\\[\\#38bdf8\\] { background-color: #f43f5e !important; }
                  #terminal-container .shadow-\\[0_0_15px_rgba\\(56\\,189\\,248\\,0\\.4\\)\\] { box-shadow: 0 0 15px rgba(244,63,94,0.4) !important; }
                `}</style>
              )}
              
              <SessionSidebar
                sessions={sessions}
                activeSessionId={activeSessionId || ''}
                onSelectSession={handleSelectSession}
                onCreateSession={() => handleCreateSession('chat')}
                onRenameSession={handleRenameSession}
                onDeleteSession={handleDeleteSession}
              />
              
              <QuickActionsMenu 
                onSummarize={() => handleSendMessage('Please summarize the conversation context briefly.')}
                onClearCodeBlocks={handleClearCodeBlocks}
                onToggleTheme={handleToggleAccent}
              />
              
              {/* Chat Window */}
              <ChatWindow
                messages={activeSession.messages}
                mode={activeSession.mode}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onClearHistory={handleClearHistory}
                attachmentBase64={attachmentBase64}
                attachmentMimeType={attachmentMimeType}
                attachmentName={attachmentName}
                onRemoveAttachment={() => {
                  setAttachmentBase64(null);
                  setAttachmentMimeType('image/jpeg');
                  setAttachmentName('');
                }}
                onAddAttachment={(b64, mimeType, name) => {
                  setAttachmentBase64(b64);
                  setAttachmentMimeType(mimeType || 'image/jpeg');
                  setAttachmentName(name || '');
                  handleChangeMode('vision');
                }}
              />

              {/* Dynamic Side Config Slider */}
              {showConfig && (
                <ConfigPanel
                  selectedModelId={activeSession.modelId}
                  onSelectModel={(id) => updateActiveSession(s => ({ 
                    ...s, 
                    modelId: id,
                    ...(id === 'gemini-3.1-pro-preview' ? { thinkingLevel: 'HIGH' } : {})
                  }))}
                  temperature={activeSession.temperature}
                  onChangeTemperature={(val) => updateActiveSession(s => ({ ...s, temperature: val }))}
                  thinkingLevel={activeSession.thinkingLevel}
                  onChangeThinkingLevel={(lvl) => updateActiveSession(s => ({ 
                    ...s, 
                    thinkingLevel: lvl,
                    ...(lvl === 'HIGH' ? { modelId: 'gemini-3.1-pro-preview' } : {})
                  }))}
                  useSearch={activeSession.useSearch}
                  onToggleSearch={(val) => updateActiveSession(s => ({ ...s, useSearch: val }))}
                  systemPrompt={activeSession.systemPrompt}
                  onChangeSystemPrompt={(prompt) => updateActiveSession(s => ({ ...s, systemPrompt: prompt }))}
                />
              )}
            </div>
          )}

          

          

          {activeTab === 'diagnostics' && (
            <DiagnosticsSuite />
          )}

          {activeTab === 'notepad' && (
            <Notepad
              content={activeSession.notepadContent}
              onChangeContent={(val) => updateActiveSession(s => ({ ...s, notepadContent: val }))}
              onSendToChatInput={handleSendToChatInput}
            />
          )}

          

          {activeTab === 'skills' && (
            <SkillsAssetsSuite />
          )}

          

          {activeTab === 'vfs_terminal' && (
            <SystemTerminal />
          )}

          {activeTab === 'day01' && <Day01 />}
          {activeTab === 'day02' && <Day02 />}
          {activeTab === 'storage' && <Storage />}
          {activeTab === 'mcp' && <Mcp />}
          {activeTab === 'comms' && <Comms />}
        </div>
      </div>
    </div>
  );
}
