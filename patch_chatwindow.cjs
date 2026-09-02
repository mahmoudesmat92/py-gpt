const fs = require('fs');
let code = fs.readFileSync('src/components/ChatWindow.tsx', 'utf-8');

code = code.replace(/bg-black\/40 backdrop-blur-md/g, "cyber-glass");

fs.writeFileSync('src/components/ChatWindow.tsx', code);
console.log("Patched ChatWindow");
