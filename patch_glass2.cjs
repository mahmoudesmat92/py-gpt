const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const target1 = `@keyframes cyberBorderSweep {
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

const repl1 = `@keyframes cyberBorderSweep {
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 200%; }
}

.cyber-glass::after, .cyber-glass-glow::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: repeating-linear-gradient(
    135deg,
    transparent 0%,
    transparent 35%,
    rgba(56,189,248,0.8) 50%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 200%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease-out;
  z-index: 10;
}

.cyber-glass:hover::after, .cyber-glass-glow:hover::after,
.cyber-glass.active::after, .cyber-glass-glow.active::after {
  opacity: 1;
  animation: cyberBorderSweep 3s linear infinite;
}`;

if (code.includes('0% 50%')) {
  code = code.replace(target1, repl1);
  fs.writeFileSync('src/index.css', code);
  console.log("Patched index.css with animated light leak");
} else {
  console.log("Target not found");
}
