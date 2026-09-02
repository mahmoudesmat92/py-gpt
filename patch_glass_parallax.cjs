const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const targetStr = `.cyber-glass, .cyber-glass-glow {
  position: relative;
}

.cyber-glass {
  background: rgba(10, 11, 14, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.cyber-glass-glow {
  background: rgba(15, 17, 21, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(14, 165, 233, 0.15);
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.05);
}`;

const replStr = `.cyber-glass, .cyber-glass-glow {
  position: relative;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease;
  transform-style: preserve-3d;
}

.cyber-glass {
  background: rgba(10, 11, 14, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.cyber-glass:hover, .cyber-glass.active {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(12, 14, 18, 0.85);
}

.cyber-glass-glow {
  background: rgba(15, 17, 21, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(14, 165, 233, 0.15);
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.05);
}

.cyber-glass-glow:hover, .cyber-glass-glow.active {
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(14, 165, 233, 0.25);
  border-color: rgba(14, 165, 233, 0.35);
  background: rgba(18, 20, 26, 0.95);
}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replStr);
  fs.writeFileSync('src/index.css', code);
  console.log("Patched cyber-glass with parallax effect");
} else {
  console.log("Target string not found in index.css");
}
