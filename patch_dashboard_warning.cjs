const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Add isWarning derived state
const stateTarget = `  const [isEditingWebhook, setIsEditingWebhook] = useState(false);`;
const stateReplace = `  const [isEditingWebhook, setIsEditingWebhook] = useState(false);

  const lastMetric = chartData[chartData.length - 1];
  const isWarning = lastMetric && (lastMetric.throughput > 850 || lastMetric.contextLoad > 85);`;

if (!code.includes('const isWarning =')) {
  code = code.replace(stateTarget, stateReplace);
}

// Update the main container background based on isWarning
const bgTarget = `    <div className="h-full flex flex-col relative overflow-hidden bg-transparent">
      {/* Decorative Background Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />`;

const bgReplace = `    <div className={\`h-full flex flex-col relative overflow-hidden transition-colors duration-1000 \${isWarning ? 'bg-red-950/20' : 'bg-transparent'}\`}>
      {/* Visual Warning Overlay */}
      {isWarning && (
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none z-0 animate-pulse" />
      )}
      {/* Decorative Background Effects */}
      <div className={\`absolute top-0 right-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 \${isWarning ? 'bg-red-500/10' : 'bg-sky-500/5'}\`} />
      <div className={\`absolute bottom-10 left-10 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 \${isWarning ? 'bg-orange-500/10' : 'bg-purple-500/5'}\`} />`;

if (!code.includes('isWarning ? \'bg-red-950/20\'')) {
  code = code.replace(bgTarget, bgReplace);
}

// Add a warning alert banner in the header
const headerTarget = `          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Super intelligent neural growth monitor, automated operational diagnostics, and interactive 3D concept grapher.
          </p>
        </div>`;

const headerReplace = `          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Super intelligent neural growth monitor, automated operational diagnostics, and interactive 3D concept grapher.
          </p>
          {isWarning && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-[10px] font-mono animate-pulse">
              <Activity className="w-3 h-3" />
              <span>WARNING: System resources exceeding safe limits (85%). Recovery mode engaged.</span>
            </div>
          )}
        </div>`;

if (!code.includes('WARNING: System resources exceeding')) {
  code = code.replace(headerTarget, headerReplace);
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Patched dashboard with warnings");
