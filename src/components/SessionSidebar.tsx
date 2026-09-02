import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, Edit2, Trash2, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { ChatSession } from '../types';

interface SessionSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function SessionSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession
}: SessionSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartEdit = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = (id: string, e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="relative h-full flex flex-shrink-0">
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full border-r border-white/[0.05] bg-[#030406]/95 backdrop-blur-md overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
                Sessions
              </span>
              <button
                onClick={onCreateSession}
                className="p-1.5 hover:bg-[#38bdf8]/20 text-[#38bdf8] rounded transition-colors"
                title="New Session"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    activeSessionId === session.id
                      ? 'bg-white/[0.08] text-[#38bdf8]'
                      : 'hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeSessionId === session.id ? 'text-[#38bdf8]' : 'text-slate-600'}`} />
                  
                  {editingId === session.id ? (
                    <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, session.id)}
                        autoFocus
                        className="flex-1 bg-black/50 border border-[#38bdf8]/50 text-slate-200 text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
                      />
                      <button onClick={(e) => handleSaveEdit(session.id, e)} className="text-emerald-400 hover:text-emerald-300">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="text-rose-400 hover:text-rose-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 truncate text-xs font-mono pr-12">
                      {session.title}
                    </div>
                  )}

                  {!editingId && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#08090c]/80 backdrop-blur pl-2 py-1 rounded">
                      <button
                        onClick={(e) => handleStartEdit(session, e)}
                        className="p-1 text-slate-500 hover:text-[#38bdf8] transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this session?')) {
                            onDeleteSession(session.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-6 h-12 bg-[#0a0c10] border border-white/[0.08] rounded-r-md flex items-center justify-center text-slate-500 hover:text-[#38bdf8] hover:border-[#38bdf8]/50 transition-colors"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
