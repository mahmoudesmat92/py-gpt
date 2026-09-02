import { FileText, Copy, Trash2, Send, Save } from 'lucide-react';

interface NotepadProps {
  content: string;
  onChangeContent: (val: string) => void;
  onSendToChatInput: (val: string) => void;
}

export default function Notepad({ content, onChangeContent, onSendToChatInput }: NotepadProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your notepad?")) {
      onChangeContent('');
    }
  };

  const handleSendPrompt = () => {
    if (content.trim()) {
      onSendToChatInput(content.trim());
    }
  };

  return (
    <div id="notepad-tab-container" className="h-full flex flex-col bg-[#030406]">
      {/* Control Bar */}
      <div className="p-4 border-b border-white/[0.05] bg-[#050608]/90 backdrop-blur flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <FileText className="w-4 h-4 text-[#38bdf8] drop-shadow-[0_0_6px_rgba(56,189,248,0.3)]" />
          <span>Notepad buffer</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            id="notepad-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/[0.03] hover:bg-white/[0.04] text-slate-300 text-xs transition-all duration-300 font-mono"
            title="Copy notes to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
          <button
            id="notepad-clear-btn"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/[0.03] hover:bg-rose-950/20 hover:border-rose-900/40 hover:text-rose-400 text-slate-400 text-xs transition-all duration-300 font-mono"
            title="Clear notepad"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            id="notepad-send-prompt-btn"
            onClick={handleSendPrompt}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] hover:bg-[#38bdf8]/20 text-xs transition-all duration-300 font-mono disabled:opacity-40 disabled:hover:bg-[#38bdf8]/10 disabled:hover:text-[#38bdf8] disabled:hover:border-[#38bdf8]/20"
            title="Send notes to active chat input"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Insert to Prompt</span>
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-6 relative">
        <textarea
          id="notepad-textarea"
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          placeholder="Write down prompt ideas, response templates, custom system instructions, or coding snippets here. Your notes are saved to local storage in real-time."
          className="w-full h-full bg-transparent text-slate-200 placeholder-slate-600 text-sm font-mono border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed"
        />
        <div className="absolute bottom-6 right-6 text-[9px] text-slate-600 font-mono flex items-center gap-1.5 bg-[#050608]/80 backdrop-blur px-2.5 py-1 rounded-full border border-white/[0.02]">
          <Save className="w-3 h-3 text-emerald-500" />
          <span className="tracking-widest">AUTOSAVED</span>
        </div>
      </div>
    </div>
  );
}
