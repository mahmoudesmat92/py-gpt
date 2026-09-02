import { useState } from 'react';
import { 
  Zap, Sliders, Cpu, Shield, 
  Terminal as TermIcon, Lock, Unlock, Activity,
  AlertCircle, Globe
} from 'lucide-react';

export default function EnergyGrid() {
  // Power allocations
  const [allocation, setAllocation] = useState({
    logic: 35,
    shields: 25,
    propulsion: 15,
    vision: 15,
    sandbox: 10,
  });

  const [cyberLogs, setCyberLogs] = useState<string[]>([
    '[SECURE] Test console initialized safely.',
    '[SYSTEM] Firewall status: ON.',
    '[COMMAND] Ready. Type or click commands below.',
  ]);

  const [sandboxInput, setSandboxInput] = useState<string>('');
  const [encryptionBreak, setEncryptionBreak] = useState<number>(42);
  const [isCracking, setIsCracking] = useState<boolean>(false);
  const [integrityLevel, setIntegrityLevel] = useState<number>(100);

  const totalAllocated = allocation.logic + allocation.shields + allocation.propulsion + allocation.vision + allocation.sandbox;

  const handleSliderChange = (key: keyof typeof allocation, val: number) => {
    setAllocation(prev => {
      const updated = { ...prev, [key]: val };
      return updated;
    });
  };

  const addCyberLog = (msg: string) => {
    setCyberLogs(prev => [...prev.slice(-25), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Run mock Sandbox/Hack scripts
  const runSandboxScript = (scriptName: string) => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) {
        fetch('/api/webhook-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: webhookUrl, payload: { action: 'energy_sandbox_script', script: scriptName } })
        }).catch(()=>null);
      }
    } catch(e) {}
    if (scriptName === 'overclock') {
      addCyberLog('TEST: Initializing power adjustment.');
      addCyberLog('TEST: Boosting processor speed to maximum. Warning: extra heat generated!');
      setAllocation(prev => ({ ...prev, logic: Math.min(100, prev.logic + 20) }));
    } else if (scriptName === 'scan-ports') {
      addCyberLog('TEST: Scanning internal network ports...');
      setTimeout(() => {
        addCyberLog('TEST: Active local ports [3000, 5000, 8080] are secure.');
      }, 800);
    } else if (scriptName === 'breach') {
      if (isCracking) return;
      setIsCracking(true);
      addCyberLog('DECRYPTOR: Searching secure key segments...');
      
      let progress = encryptionBreak;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setIsCracking(false);
          addCyberLog('DECRYPTOR: Decryption complete! Security token secured.');
          setEncryptionBreak(100);
        } else {
          setEncryptionBreak(progress);
        }
      }, 150);
    } else if (scriptName === 'reboot') {
      setAllocation({ logic: 35, shields: 25, propulsion: 15, vision: 15, sandbox: 10 });
      setEncryptionBreak(42);
      setIntegrityLevel(100);
      addCyberLog('TEST: Reloading default power settings.');
    }
  };

  const handleCustomCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;
    const cmd = sandboxInput.toLowerCase().trim();
    addCyberLog(`CMD_INPUT: > ${sandboxInput}`);
    setSandboxInput('');

    if (cmd === 'help') {
      addCyberLog('HELP: Commands: "overclock", "scan", "decrypt", "reset", "firewall", "leak"');
    } else if (cmd === 'overclock') {
      runSandboxScript('overclock');
    } else if (cmd === 'scan') {
      runSandboxScript('scan-ports');
    } else if (cmd === 'decrypt') {
      runSandboxScript('breach');
    } else if (cmd === 'reset') {
      runSandboxScript('reboot');
    } else if (cmd === 'firewall') {
      addCyberLog('FIREWALL: Secure state: STABLE. Blocking external threads.');
    } else if (cmd === 'leak') {
      addCyberLog('LEAK: Warning! Coolant lines disconnected. Safety rating decreased.');
      setIntegrityLevel(prev => Math.max(30, prev - 18));
    } else {
      addCyberLog(`ERROR: Unknown command "${cmd}". Type "help" for a list of commands.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#030406] text-slate-100 p-6 overflow-y-auto font-sans relative">
      {/* Visual neon lines */}
      <div className="absolute top-0 right-1/4 w-[200px] h-[300px] bg-amber-500/[0.015] blur-[100px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.05] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
              POWER ALLOCATION & SYSTEM SECURITY
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            TOTAL POWER ALLOCATED: {totalAllocated}% / 100% MAXIMUM
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3 mt-3 md:mt-0 text-[10px] font-mono">
          <div className="bg-black/40 border border-white/[0.05] p-2.5 rounded-xl flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-slate-500 block text-[8px] uppercase">Firewall Strength</span>
              <span className="text-slate-200 font-bold">{integrityLevel}% STATUS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Resource Allocation Sliders (lg:col-span-5) */}
        <div className="lg:col-span-5 cyber-glass border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
              <Sliders className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-display">
                Power Adjustment Sliders
              </h3>
            </div>

            {/* Total Indicator Alert */}
            <div className={`p-3 rounded-xl mb-5 flex items-start gap-2.5 border text-[10px] font-mono ${
              totalAllocated > 100 
                ? 'bg-red-950/15 border-red-500/25 text-red-400' 
                : totalAllocated === 100 
                ? 'bg-emerald-950/15 border-emerald-500/25 text-emerald-400'
                : 'bg-sky-950/15 border-sky-500/15 text-sky-400'
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <div>
                <span className="font-bold uppercase block">
                  {totalAllocated > 100 ? 'OVERLOAD DETECTED' : totalAllocated === 100 ? 'POWER STABLE' : 'SURPLUS POWER AVAILABLE'}
                </span>
                <p className="text-[9px] text-slate-400 mt-1 leading-snug">
                  {totalAllocated > 100 
                    ? 'Total power exceeds 100%. Please lower slider values to prevent overheating.'
                    : totalAllocated === 100 
                    ? 'Power is distributed at exactly 100%. System running optimally.'
                    : 'System has spare power. You can increase power to any component.'}
                </p>
              </div>
            </div>

            {/* Sliders Area */}
            <div className="space-y-4">
              {/* Sliders */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400 uppercase flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" /> Brain Processing Power
                  </span>
                  <span className="text-slate-200 font-bold">{allocation.logic}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={allocation.logic} 
                  onChange={(e) => handleSliderChange('logic', parseInt(e.target.value))}
                  className="w-full accent-sky-400 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400 uppercase flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Defense Shields
                  </span>
                  <span className="text-slate-200 font-bold">{allocation.shields}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={allocation.shields} 
                  onChange={(e) => handleSliderChange('shields', parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400 uppercase flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Thrust & Speed
                  </span>
                  <span className="text-slate-200 font-bold">{allocation.propulsion}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={allocation.propulsion} 
                  onChange={(e) => handleSliderChange('propulsion', parseInt(e.target.value))}
                  className="w-full accent-amber-400 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400 uppercase flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-purple-400" /> Image Scanning
                  </span>
                  <span className="text-slate-200 font-bold">{allocation.vision}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={allocation.vision} 
                  onChange={(e) => handleSliderChange('vision', parseInt(e.target.value))}
                  className="w-full accent-purple-400 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400 uppercase flex items-center gap-1">
                    <TermIcon className="w-3.5 h-3.5 text-pink-400" /> Test Environment
                  </span>
                  <span className="text-slate-200 font-bold">{allocation.sandbox}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={allocation.sandbox} 
                  onChange={(e) => handleSliderChange('sandbox', parseInt(e.target.value))}
                  className="w-full accent-pink-400 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Override command links */}
          <div className="mt-6 pt-4 border-t border-white/[0.04]">
            <button
              onClick={() => runSandboxScript('reboot')}
              className="w-full py-2 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-xs font-mono rounded-xl transition-all"
            >
              RESET ALL POWER VALUES
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Sandbox Shell (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Decryptor/Access Breach Panel */}
          <div className="cyber-glass border-white/[0.05] p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/[0.02] blur-xl rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-400" /> Security Key Decryptor
              </h3>
              <span className="text-[9px] font-mono text-slate-500 uppercase">
                Progress: {encryptionBreak}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 bg-black/40 border border-white/[0.03] rounded-xl mb-4">
              <div className="flex-1">
                <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${encryptionBreak}%` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-500 mt-1 block uppercase">
                  {isCracking ? 'RUNNING DECRYPTION SEARCH...' : 'DECRYPTION READY'}
                </span>
              </div>

              <button
                onClick={() => runSandboxScript('breach')}
                disabled={isCracking || encryptionBreak >= 100}
                className={`px-4 py-2 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                  encryptionBreak >= 100
                    ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                    : 'bg-pink-950/10 border-pink-500/20 hover:bg-pink-500/10 text-pink-400'
                }`}
              >
                {encryptionBreak >= 100 ? (
                  <span className="flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5" /> SECURED</span>
                ) : (
                  <span>START DECRYPT</span>
                )}
              </button>
            </div>
          </div>

          {/* Cyber Sandbox Interactive CLI Terminal */}
          <div className="cyber-glass border-white/[0.05] p-5 rounded-2xl flex-1 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
                  <TermIcon className="w-4 h-4 text-[#38bdf8]" /> Test Console Terminal
                </h3>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  ACTIVE COMMANDS
                </span>
              </div>

              {/* Commands quicklinks */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={() => runSandboxScript('overclock')}
                  className="px-2 py-1 bg-white/[0.01] hover:bg-sky-500/5 border border-white/[0.03] hover:border-sky-500/20 rounded-md text-[9px] font-mono text-slate-400"
                >
                  overclock
                </button>
                <button 
                  onClick={() => runSandboxScript('scan-ports')}
                  className="px-2 py-1 bg-white/[0.01] hover:bg-purple-500/5 border border-white/[0.03] hover:border-purple-500/20 rounded-md text-[9px] font-mono text-slate-400"
                >
                  scan-ports
                </button>
                <button 
                  onClick={() => runSandboxScript('reboot')}
                  className="px-2 py-1 bg-white/[0.01] hover:bg-amber-500/5 border border-white/[0.03] hover:border-amber-500/20 rounded-md text-[9px] font-mono text-slate-400"
                >
                  reset-grids
                </button>
              </div>

              {/* Cli logs block */}
              <div className="bg-black/40 border border-white/[0.03] p-4 rounded-xl font-mono text-[9px] leading-relaxed text-slate-500 min-h-[140px] max-h-[180px] overflow-y-auto mb-4">
                {cyberLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span className={log.includes('WARN') || log.includes('Warning') ? 'text-amber-400' : log.includes('SECURE') ? 'text-emerald-400' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual input form */}
            <form onSubmit={handleCustomCommandSubmit} className="flex gap-2 border-t border-white/[0.04] pt-4">
              <input 
                type="text"
                placeholder="Type 'help' or commands (overclock, scan, decrypt, leak)..."
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                className="flex-1 bg-black/40 border border-white/[0.06] rounded-xl px-4 py-2 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#38bdf8]/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.06] hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/30 hover:text-white rounded-xl text-xs font-mono text-slate-300 transition-all"
              >
                EXECUTE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
