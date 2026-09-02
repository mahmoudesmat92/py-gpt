const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove Sidebar import and usage
code = code.replace(/import Sidebar from '\.\/components\/Sidebar';\n/, '');
const sidebarRegex = /\{\/\* Sidebar Panel \*\/\}\s*<Sidebar[\s\S]*?\/>/;
code = code.replace(sidebarRegex, '');

// Replace the tab bar
const tabStart = code.indexOf('{/* Tab Selection Bar */}');
const tabEnd = code.indexOf('{/* Tab Body View */}');
if (tabStart !== -1 && tabEnd !== -1) {
  const newTabBar = `
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
                className={\`transition-all duration-300 relative py-3 \${
                  activeTab === tab.id ? 'text-[#38bdf8]' : 'text-[#0ea5e9]/40 hover:text-[#0ea5e9]/80'
                }\`}
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
             <button className="px-5 py-1.5 border border-white/5 rounded bg-white/[0.02] hover:bg-white/10 transition-colors text-white/50 hover:text-white">
               SIGN OUT
             </button>
          </div>
        </div>

        `;
  code = code.substring(0, tabStart) + newTabBar + code.substring(tabEnd);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched header in App.tsx");
