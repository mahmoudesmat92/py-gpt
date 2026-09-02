const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const target1 = `<div id="sidebar-container" className="w-80 h-full bg-[#050608] border-r border-white/[0.06] flex flex-col select-none relative">`;
const repl1 = `<div id="sidebar-container" className="w-80 h-full bg-[#030406]/60 backdrop-blur-xl border-r border-white/[0.06] flex flex-col select-none relative z-20 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">`;

if (!code.includes('backdrop-blur-xl')) {
  code = code.replace(target1, repl1);
  fs.writeFileSync('src/components/Sidebar.tsx', code);
  console.log("Patched Sidebar");
}
