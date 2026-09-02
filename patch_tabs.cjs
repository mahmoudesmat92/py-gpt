const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsAssetsSuite.tsx', 'utf-8');

const targetButtons = `          <button
            onClick={() => setActiveTab('pc')}
            className={\`flex-1 py-2 text-center rounded-xl text-[11px] font-mono font-bold border transition-all duration-300 flex items-center justify-center gap-2 \${
              activeTab === 'pc'
                ? 'bg-gradient-to-r from-sky-950/20 to-indigo-950/20 border-sky-500/20 text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                : 'bg-black/20 border-white/[0.02] text-slate-500 hover:text-slate-300'
            }\`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>LOCAL PC DIRECTORY</span>
          </button>
        </div>`;

const replButtons = `          <button
            onClick={() => setActiveTab('pc')}
            className={\`flex-1 py-2 text-center rounded-xl text-[11px] font-mono font-bold border transition-all duration-300 flex items-center justify-center gap-2 \${
              activeTab === 'pc'
                ? 'bg-gradient-to-r from-sky-950/20 to-indigo-950/20 border-sky-500/20 text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                : 'bg-black/20 border-white/[0.02] text-slate-500 hover:text-slate-300'
            }\`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>LOCAL PC DIRECTORY</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hardware')}
            className={\`flex-1 py-2 text-center rounded-xl text-[11px] font-mono font-bold border transition-all duration-300 flex items-center justify-center gap-2 \${
              activeTab === 'hardware'
                ? 'bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-black/20 border-white/[0.02] text-slate-500 hover:text-slate-300'
            }\`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SYNC HARDWARE</span>
          </button>
        </div>`;

if (code.includes(targetButtons)) {
  code = code.replace(targetButtons, replButtons);
  fs.writeFileSync('src/components/SkillsAssetsSuite.tsx', code);
  console.log("Patched tab buttons");
} else {
  console.log("Could not find tab buttons");
}
