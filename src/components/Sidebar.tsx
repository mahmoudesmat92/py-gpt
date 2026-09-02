import { useState } from 'react';
import { 
  MessageSquare, Plus, Trash2, Edit2, Check, X,
  Terminal, Image as ImageIcon, Eye, Bot, Sparkles,
  Code, Laugh, ShieldAlert, GraduationCap, History,
  Download, Upload, Database
} from 'lucide-react';
import { Mode, ChatSession, PRESETS } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: (mode: Mode) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  activeMode: Mode;
  onChangeMode: (mode: Mode) => void;
  activePresetId: string;
  onChangePreset: (presetId: string) => void;
  onExportCurrent: () => void;
  onExportAll: () => void;
  onImportSessions: (imported: ChatSession[]) => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
  activeMode,
  onChangeMode,
  activePresetId,
  onChangePreset,
  onExportCurrent,
  onExportAll,
  onImportSessions
}: SidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleTriggerImport = () => {
    const el = document.getElementById('import-session-input');
    if (el) {
      (el as HTMLInputElement).value = ''; // Reset file input
      el.click();
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let importedSessions: ChatSession[] = [];
        if (Array.isArray(parsed)) {
          importedSessions = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.id && parsed.title) {
            importedSessions = [parsed];
          } else if (parsed.sessions && Array.isArray(parsed.sessions)) {
            importedSessions = parsed.sessions;
          }
        }

        if (importedSessions.length === 0) {
          alert("Invalid file format. No valid Mody OS sessions detected.");
          return;
        }

        const validSessions = importedSessions.filter(s => {
          return s && typeof s === 'object' && typeof s.title === 'string';
        });

        if (validSessions.length === 0) {
          alert("Could not find any valid chat sessions inside the JSON file.");
          return;
        }

        onImportSessions(validSessions);
      } catch (err) {
        console.error("Failed to parse sessions JSON:", err);
        alert("Failed to parse JSON file. Ensure it is a valid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
  };

  // Map preset icon name to Lucide components
  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-4 h-4 text-sky-400" />;
      case 'Laugh': return <Laugh className="w-4 h-4 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div id="sidebar-container" className="w-80 h-full bg-[#030406]/60 backdrop-blur-xl border-r border-white/[0.06] flex flex-col select-none relative z-20 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
      {/* Visual background spotlight indicator */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />

      {/* Title Header */}
      <div className="p-5 border-b border-white/[0.05] flex items-center justify-between relative z-10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#181a20] to-[#0a0b0d] flex items-center justify-center border border-white/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-xs font-bold text-[#38bdf8] drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]">OS</span>
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-display">Mody OS</h1>
            <p className="text-[9px] text-[#38bdf8] font-mono tracking-tight opacity-80">v1.0.0 • PLATFORM</p>
          </div>
        </div>
        <span className="text-[8px] bg-white/[0.03] text-slate-400 px-2 py-0.5 rounded border border-white/[0.06] font-mono tracking-widest uppercase">
          STABLE
        </span>
      </div>

      {/* Modes Panel */}
      <div className="p-4 border-b border-white/[0.05] relative z-10 bg-black/10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active Matrix Engine</h2>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse" />
        </div>
        <div className="grid grid-cols-5 gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.04]">
          {(['chat', 'completion', 'image', 'vision', 'agent'] as Mode[]).map((m) => {
            const isActive = activeMode === m;
            return (
              <button
                key={m}
                id={`mode-btn-${m}`}
                onClick={() => onChangeMode(m)}
                title={`Switch to ${m} mode`}
                className={`py-2 rounded flex flex-col items-center justify-center transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-white/[0.04] text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.1)] border border-white/[0.1] font-medium' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.015]'
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-[2px] bg-[#38bdf8] rounded" />
                )}
                {m === 'chat' && <MessageSquare className="w-3.5 h-3.5" />}
                {m === 'completion' && <Terminal className="w-3.5 h-3.5" />}
                {m === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                {m === 'vision' && <Eye className="w-3.5 h-3.5" />}
                {m === 'agent' && <Bot className="w-3.5 h-3.5" />}
                <span className="text-[8px] mt-1 capitalize font-mono tracking-tighter scale-90">{m}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Presets Panel */}
      <div className="p-4 border-b border-white/[0.05] flex-shrink-0 relative z-10">
        <h2 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">AI Behavior Presets</h2>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                onClick={() => onChangePreset(preset.id)}
                className={`w-full p-2.5 rounded-lg text-left flex items-start gap-3 transition-all duration-300 border ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-950/20 to-sky-950/20 border-sky-500/20 text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.05)]' 
                    : 'bg-black/20 border-white/[0.03] text-slate-400 hover:border-white/[0.08] hover:bg-black/30 hover:text-slate-200'
                }`}
              >
                <div className="mt-0.5 p-1 rounded bg-white/[0.02] border border-white/[0.04]">{getPresetIcon(preset.icon)}</div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold font-display tracking-wide truncate">{preset.name}</div>
                  <div className="text-[9px] text-slate-500 font-sans truncate tracking-tight mt-0.5">{preset.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context List / Chat Sessions */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="p-4 flex items-center justify-between border-b border-white/[0.05] flex-shrink-0 bg-black/10">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest">
            <History className="w-3 h-3 text-[#38bdf8]" />
            <span>Memory Threads</span>
          </div>
          <button
            id="new-context-btn"
            onClick={() => onCreateSession(activeMode)}
            className="p-1.5 rounded-md bg-white/[0.03] hover:bg-[#38bdf8] hover:text-black hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] text-[#38bdf8] border border-white/[0.06] transition-all duration-300 flex items-center justify-center"
            title="Create new context thread"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-black/[0.15]">
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-slate-600 text-xs font-mono">
              [ NO_THREADS_OPENED ]
            </div>
          ) : (
            (['chat', 'completion', 'image', 'vision', 'agent'] as Mode[]).map((currentMode) => {
              const modeSessions = sessions.filter(s => s.mode === currentMode);
              if (modeSessions.length === 0) return null;

              return (
                <div key={currentMode} className="mb-3 last:mb-0">
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                    {currentMode === 'chat' && <MessageSquare className="w-2.5 h-2.5" />}
                    {currentMode === 'completion' && <Terminal className="w-2.5 h-2.5" />}
                    {currentMode === 'image' && <ImageIcon className="w-2.5 h-2.5" />}
                    {currentMode === 'vision' && <Eye className="w-2.5 h-2.5" />}
                    {currentMode === 'agent' && <Bot className="w-2.5 h-2.5" />}
                    <span>{currentMode}</span>
                  </div>
                  <div className="space-y-1">
                    {modeSessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      const isEditing = session.id === editingSessionId;

                      return (
                        <div
                          key={session.id}
                          id={`session-item-${session.id}`}
                          onClick={() => onSelectSession(session.id)}
                          className={`group relative p-3 rounded-lg border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#111319] to-[#0c0d12] border-white/[0.09] text-[#38bdf8] shadow-[0_4px_16px_rgba(0,0,0,0.3)]' 
                              : 'bg-transparent border-transparent text-slate-400 hover:border-white/[0.04] hover:bg-white/[0.015]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#38bdf8] drop-shadow-[0_0_3px_rgba(56,189,248,0.5)]' : 'text-slate-500'}`} />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(session.id, e as any);
                                  if (e.key === 'Escape') handleCancelRename(e as any);
                                }}
                                className="bg-black text-xs text-slate-100 px-2 py-1 rounded border border-white/[0.08] focus:outline-none focus:border-[#38bdf8] w-full font-sans"
                                autoFocus
                              />
                            ) : (
                              <div className="min-w-0 flex flex-col">
                                <div className="text-xs font-semibold font-display text-slate-200 truncate group-hover:text-white transition-colors duration-200">
                                  {session.title}
                                </div>
                                {(() => {
                                  const assistantMsgs = session.messages.filter(m => m.sender === 'assistant' || m.sender === 'system' || m.sender === 'user');
                                  if (assistantMsgs.length > 0) {
                                    const last = assistantMsgs[assistantMsgs.length - 1];
                                    const textPart = last.parts.find(p => p.type === 'text');
                                    if (textPart && textPart.text) {
                                       return (
                                         <div className="text-[10px] text-slate-400 font-sans truncate opacity-80 mt-0.5" title={textPart.text}>
                                           {last.sender === 'assistant' ? 'AI: ' : last.sender === 'user' ? 'You: ' : 'Sys: '}
                                           {textPart.text.replace(/\n/g, ' ')}
                                         </div>
                                       );
                                    }
                                  }
                                  return null;
                                })()}
                                <div className="text-[8px] text-slate-500 font-mono mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                                  <span>{session.mode}</span>
                                  <span>•</span>
                                  <span className="text-slate-400">{session.messages.length} frame{session.messages.length !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={(e) => handleSaveRename(session.id, e)}
                                  className="p-1 hover:text-[#10b981] text-slate-500 rounded transition-colors"
                                  title="Save title"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={handleCancelRename}
                                  className="p-1 hover:text-[#ef4444] text-slate-500 rounded transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => handleStartRename(session, e)}
                                  className="p-1 hover:text-[#38bdf8] text-slate-500 rounded transition-colors"
                                  title="Rename thread"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSession(session.id);
                                  }}
                                  className="p-1 hover:text-[#ef4444] text-slate-500 rounded transition-colors"
                                  title="Delete thread"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Portability Controls */}
      <div className="p-4 border-t border-white/[0.05] bg-black/30 relative z-10 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#38bdf8]" />
            <span>Data Portability</span>
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onExportCurrent}
            className="py-2 px-2 rounded-lg text-center bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] text-[10px] font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
            title="Export the currently selected conversation thread as a JSON file"
          >
            <Download className="w-3 h-3 text-[#38bdf8]" />
            <span>Export Active</span>
          </button>
          
          <button
            onClick={onExportAll}
            className="py-2 px-2 rounded-lg text-center bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] text-[10px] font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
            title="Export all conversation threads as a backup JSON file"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Export All</span>
          </button>
        </div>

        <button
          onClick={handleTriggerImport}
          className="w-full py-2 px-2 rounded-lg text-center bg-gradient-to-r from-sky-950/20 to-indigo-950/20 border border-sky-500/10 hover:border-sky-500/30 text-[10px] font-mono text-[#38bdf8] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.02)]"
          title="Import JSON conversation thread(s) or full backups"
        >
          <Upload className="w-3 h-3" />
          <span>Import Sessions JSON</span>
        </button>
        <input
          type="file"
          id="import-session-input"
          accept=".json"
          onChange={handleImportFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
