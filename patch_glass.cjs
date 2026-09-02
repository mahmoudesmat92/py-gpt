const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const target1 = `/* Cyber Glass Panel */
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

const repl1 = `/* Cyber Glass Panel */
.cyber-glass, .cyber-glass-glow {
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
}

@keyframes cyberBorderSweep {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.cyber-glass::after, .cyber-glass-glow::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(90deg, transparent 0%, transparent 40%, rgba(56,189,248,0.8) 50%, transparent 60%, transparent 100%);
  background-size: 200% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease-out;
  z-index: 10;
}

.cyber-glass:hover::after, .cyber-glass-glow:hover::after {
  opacity: 1;
  animation: cyberBorderSweep 2s linear infinite;
}`;

code = code.replace(target1, repl1);

fs.writeFileSync('src/index.css', code);
console.log("Patched index.css");
