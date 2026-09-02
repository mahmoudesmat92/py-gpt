const fs = require('fs');

const targets = [
  'src/components/EnergyGrid.tsx',
  'src/components/TacticalSuite.tsx',
  'src/components/DiagnosticsSuite.tsx',
  'src/components/ScoreSheets.tsx',
];

for (const file of targets) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/bg-\[#050608\] border border-white\/\[0\.04\]/g, "cyber-glass border-white/[0.05]");
  code = code.replace(/bg-gradient-to-b from-\[#07090c\] to-\[#040507\]/g, "cyber-glass");
  code = code.replace(/bg-\[#040507\] border border-white\/\[0\.04\]/g, "cyber-glass border-white/[0.05]");
  code = code.replace(/bg-black\/30 p-1 rounded-xl border border-white\/\[0\.04\]/g, "cyber-glass p-1 rounded-xl border-white/[0.05]");
  code = code.replace(/bg-\[#0a0c10\] border border-white\/\[0\.05\]/g, "cyber-glass border-white/[0.05]");
  fs.writeFileSync(file, code);
}
console.log("Patched others");
