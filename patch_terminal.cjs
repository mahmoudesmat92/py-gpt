const fs = require('fs');
let code = fs.readFileSync('src/components/SystemTerminal.tsx', 'utf-8');

const target1 = `bg-black/40 backdrop-blur-md`;
const repl1 = `cyber-glass`;

const target2 = `bg-black/20 backdrop-blur-sm relative font-mono text-sm shadow-[-20px_0_40px_rgba(0,0,0,0.4)]`;
const repl2 = `cyber-glass-glow relative font-mono text-sm shadow-[-20px_0_40px_rgba(0,0,0,0.4)]`;

code = code.replace(target1, repl1).replace(target2, repl2);

fs.writeFileSync('src/components/SystemTerminal.tsx', code);
console.log("Patched SystemTerminal");
