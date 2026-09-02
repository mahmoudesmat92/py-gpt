const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const tabTarget = `              <button
                id="tab-terminal-btn"`;

const tabReplace = `              <button
                id="tab-vfs-terminal-btn"
                onClick={() => setActiveTab('vfs_terminal')}
                className={\`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold font-sans transition-all duration-300 relative \${
                  activeTab === 'vfs_terminal' ? 'text-[#38bdf8]' : 'text-slate-500 hover:text-slate-300'
                }\`}
              >
                {activeTab === 'vfs_terminal' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white/[0.04] border border-white/[0.06] rounded-md shadow-[0_0_12px_rgba(56,189,248,0.06)] z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {activeTab === 'vfs_terminal' && (
                  <motion.span
                    layoutId="activeTabBottomLine"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-[#38bdf8] rounded z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <SquareTerminal className="w-3.5 h-3.5" />
                  <span>OS Terminal</span>
                </span>
              </button>

              <button
                id="tab-terminal-btn"`;

if (!code.includes('id="tab-vfs-terminal-btn"')) {
  code = code.replace(tabTarget, tabReplace);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Added tab!");
}
