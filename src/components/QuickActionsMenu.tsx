import { useState } from 'react';
import { Zap, List, PaintBucket, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickActionsMenuProps {
  onSummarize: () => void;
  onClearCodeBlocks: () => void;
  onToggleTheme: () => void;
}

export default function QuickActionsMenu({ onSummarize, onClearCodeBlocks, onToggleTheme }: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-32 right-8 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 mb-2 bg-[#030406]/80 backdrop-blur-xl border border-white/[0.05] p-2 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-48"
          >
            <button
              onClick={() => { onSummarize(); setIsOpen(false); }}
              className="flex items-center gap-3 px-3 py-2 text-[10px] font-mono text-slate-300 hover:text-[#38bdf8] hover:bg-white/[0.02] rounded-lg transition-colors text-left"
            >
              <List className="w-3.5 h-3.5" />
              SUMMARIZE CONTEXT
            </button>
            <button
              onClick={() => { onClearCodeBlocks(); setIsOpen(false); }}
              className="flex items-center gap-3 px-3 py-2 text-[10px] font-mono text-slate-300 hover:text-rose-400 hover:bg-white/[0.02] rounded-lg transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5" />
              CLEAR CODE BLOCKS
            </button>
            <button
              onClick={() => { onToggleTheme(); setIsOpen(false); }}
              className="flex items-center gap-3 px-3 py-2 text-[10px] font-mono text-slate-300 hover:text-amber-400 hover:bg-white/[0.02] rounded-lg transition-colors text-left"
            >
              <PaintBucket className="w-3.5 h-3.5" />
              TOGGLE ACCENT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg ${
          isOpen 
            ? 'bg-[#38bdf8] text-black border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.4)]' 
            : 'bg-[#12141c] text-[#38bdf8] border-[#38bdf8]/30 hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/60'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Zap className="w-5 h-5 fill-current" />
        </motion.div>
      </button>
    </div>
  );
}
