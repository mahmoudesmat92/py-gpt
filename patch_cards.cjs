const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const target1 = `bg-black/20 border border-white/[0.03]`;
const repl1 = `cyber-glass border-white/[0.05]`;

code = code.split(target1).join(repl1);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Patched Cards");
