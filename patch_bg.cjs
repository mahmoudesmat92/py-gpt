const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const bgTarget = `    <div id="master-dashboard-root" className="flex-1 h-full overflow-y-auto bg-[#030406] p-6 space-y-6 relative select-none">
      {/* High-end decorative futuristic HUD scanlines / subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />`;

const bgReplace = `    <div id="master-dashboard-root" className={\`flex-1 h-full overflow-y-auto p-6 space-y-6 relative select-none transition-colors duration-1000 \${isWarning ? 'bg-red-950/20' : 'bg-[#030406]'}\`}>
      {/* Visual Warning Overlay */}
      {isWarning && (
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none z-0 animate-pulse" />
      )}
      {/* High-end decorative futuristic HUD scanlines / subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Glow Effects */}
      <div className={\`absolute top-0 right-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 \${isWarning ? 'bg-red-500/10' : 'bg-sky-500/5'}\`} />
      <div className={\`absolute bottom-10 left-10 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 \${isWarning ? 'bg-orange-500/10' : 'bg-purple-500/5'}\`} />`;

if (code.includes('bg-[#030406]')) {
  code = code.replace(bgTarget, bgReplace);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Patched background colors!");
}
