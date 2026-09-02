const fs = require('fs');
let code = fs.readFileSync('src/components/SystemTerminal.tsx', 'utf-8');

code = code.replace(
  "out = 'Available commands: ls, cd, pwd, cat, echo, mkdir, touch, rm, clear, date, whoami, help';",
  "out = 'Available commands: ls, cd, pwd, cat, echo, mkdir, touch, rm, clear, date, uname, top, ping, neofetch, whoami, reboot, help';"
);

fs.writeFileSync('src/components/SystemTerminal.tsx', code);
console.log("Help string updated");
