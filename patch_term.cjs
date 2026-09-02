const fs = require('fs');
let code = fs.readFileSync('src/components/SystemTerminal.tsx', 'utf-8');

// remove unused imports
code = code.replace(
  "import { Terminal, Folder, File, FileText, ChevronRight, ChevronDown, Command } from 'lucide-react';",
  "import { Terminal, Folder, FileText, ChevronRight, ChevronDown, ShieldAlert, Cpu } from 'lucide-react';"
);

// fix refreshTrigger usage by adding it as a dependency in useEffect or simply reading it
code = code.replace(
  "function FileTree({ refreshTrigger }: { refreshTrigger: number }) {",
  "function FileTree({ refreshTrigger }: { refreshTrigger: number }) {\n  // Trigger re-render when VFS updates\n  useEffect(() => {}, [refreshTrigger]);"
);

// enhance layout aesthetics
const layoutTarget = `    <div className="flex h-full bg-[#030406] overflow-hidden select-none">`;
const layoutReplace = `    <div className="flex h-full bg-[#030406] overflow-hidden select-none relative">
      {/* Background glow & grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
`;

code = code.replace(layoutTarget, layoutReplace);

const filePanelTarget = `      {/* File Explorer Panel */}
      <div className="w-64 border-r border-white/[0.05] bg-black/20 flex flex-col">`;
const filePanelReplace = `      {/* File Explorer Panel */}
      <div className="w-64 border-r border-white/[0.05] bg-black/40 backdrop-blur-md flex flex-col relative z-10">`;

code = code.replace(filePanelTarget, filePanelReplace);

const termPanelTarget = `      {/* Terminal Panel */}
      <div className="flex-1 flex flex-col bg-black/40 relative font-mono text-sm" onClick={focusInput}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        <div className="p-4 border-b border-white/[0.05] flex items-center gap-2 text-indigo-400 relative z-10 bg-black/60">
          <Terminal className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Core Interactive Terminal</span>
        </div>`;
const termPanelReplace = `      {/* Terminal Panel */}
      <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-sm relative font-mono text-sm shadow-[-20px_0_40px_rgba(0,0,0,0.4)]" onClick={focusInput}>
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between relative z-10 bg-black/60">
          <div className="flex items-center gap-2 text-[#38bdf8]">
            <Terminal className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest font-display">Core Interactive OS Shell</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[9px] text-emerald-400 uppercase tracking-widest bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-indigo-400 uppercase tracking-widest bg-indigo-950/20 px-2 py-1 rounded border border-indigo-900/30">
              <Cpu className="w-3 h-3" />
              Root Access
            </span>
          </div>
        </div>`;

code = code.replace(termPanelTarget, termPanelReplace);

fs.writeFileSync('src/components/SystemTerminal.tsx', code);
console.log("Patched SystemTerminal.tsx layout");
