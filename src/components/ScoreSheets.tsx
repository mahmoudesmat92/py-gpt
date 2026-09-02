import { useState, useEffect } from 'react';
import { 
  Laptop, Smartphone, Network, Terminal, 
  Activity, Sparkles, RefreshCw, 
  Wifi, HardDrive, Shield
} from 'lucide-react';
import { subscribeToScores, saveScoresToCloud } from '../firebase';

interface ScoreMetric {
  name: string;
  progress: number; // 0 to 100
  health: number; // 0 to 100
  status: string;
  speed?: string;
  latency?: string;
}

interface ScoreSheetState {
  pc: ScoreMetric;
  mobile: ScoreMetric;
  tailscale: ScoreMetric;
  connections: ScoreMetric;
}

export default function ScoreSheets() {
  // --- STATE FOR SCORE DATA ---
  const [scores, setScores] = useState<ScoreSheetState>({
    pc: { name: 'PC Connection', progress: 68, health: 75, status: 'Connected • Standby', speed: '450 Mbps', latency: '12ms' },
    mobile: { name: 'Mobile Companion', progress: 45, health: 62, status: 'Authorized • Idle', speed: '120 Mbps', latency: '45ms' },
    tailscale: { name: 'Tailscale VPN Mesh', progress: 30, health: 48, status: 'Tunnel Inactive', speed: '0 Mbps', latency: 'N/A' },
    connections: { name: 'Network Sockets Gateway', progress: 80, health: 82, status: 'Multiplexing', speed: '1.2 Gbps', latency: '5ms' }
  });

  // Subscribe to cloud scores changes in real time
  useEffect(() => {
    const unsubscribe = subscribeToScores((cloudScores) => {
      if (cloudScores) {
        setScores(cloudScores);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- INTERACTIVE BUTTON EXECUTING STATES ---
  const [executing, setExecuting] = useState<Record<string, boolean>>({
    pc: false,
    mobile: false,
    tailscale: false,
    connections: false,
    audit: false,
    optimizeAll: false
  });

  // --- ACTIONS SYSTEM LOGS ---
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] SCORE_SHEETS: Neural communications diagnostics compiled.`,
    `[${new Date().toLocaleTimeString()}] MONITOR: Waiting for network overlay socket dispatch.`
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // --- SCORE DERIVATIONS ---
  const overallScore = Math.round(
    (scores.pc.progress + scores.mobile.progress + scores.tailscale.progress + scores.connections.progress) / 4
  );

  const overallHealth = Math.round(
    (scores.pc.health + scores.mobile.health + scores.tailscale.health + scores.connections.health) / 4
  );

  const communicationsScore = Math.round(
    (scores.pc.health * 0.3 + scores.mobile.health * 0.2 + scores.tailscale.health * 0.3 + scores.connections.health * 0.2)
  );

  // --- RECOMMENDATION ACTIONS ---

  // 1. PC Optimization Action
  const runPcOptimization = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_pc_opt' } })}).catch(()=>null);
    } catch(e) {}
    if (executing.pc) return;
    setExecuting(prev => ({ ...prev, pc: true }));
    addLog(`ACTION: Dispatching memory-mapped PC Sync protocol payload...`);

    setTimeout(() => {
      const nextScores = {
        ...scores,
        pc: {
          ...scores.pc,
          progress: 100,
          health: 98,
          status: 'Connected • Optimized High-Speed',
          speed: '950 Mbps',
          latency: '4ms'
        }
      };
      setScores(nextScores);
      saveScoresToCloud(nextScores);
      setExecuting(prev => ({ ...prev, pc: false }));
      addLog(`SUCCESS: PC Connection optimized! Progress set to 100%, Health set to 98%.`);
    }, 1500);
  };

  // 2. Mobile Companion Authentication Action
  const runMobileAuth = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_mobile_auth' } })}).catch(()=>null);
    } catch(e) {}
    if (executing.mobile) return;
    setExecuting(prev => ({ ...prev, mobile: true }));
    addLog(`ACTION: Deploying cryptographic handshake token signature to Mobile Companion...`);

    setTimeout(() => {
      const nextScores = {
        ...scores,
        mobile: {
          ...scores.mobile,
          progress: 100,
          health: 95,
          status: 'Authorized • Secure Mesh Active',
          speed: '280 Mbps',
          latency: '18ms'
        }
      };
      setScores(nextScores);
      saveScoresToCloud(nextScores);
      setExecuting(prev => ({ ...prev, mobile: false }));
      addLog(`SUCCESS: Mobile companion device secured! Progress 100%, Health 95%.`);
    }, 1500);
  };

  // 3. Tailscale Provision Router Action
  const runTailscaleRouter = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_tailscale' } })}).catch(()=>null);
    } catch(e) {}
    if (executing.tailscale) return;
    setExecuting(prev => ({ ...prev, tailscale: true }));
    addLog(`ACTION: Executing 'tailscaled' overlay network subnet configuration...`);

    setTimeout(() => {
      const nextScores = {
        ...scores,
        tailscale: {
          ...scores.tailscale,
          progress: 100,
          health: 94,
          status: 'Tunnel Active • Subnet Enabled',
          speed: '340 Mbps',
          latency: '22ms'
        }
      };
      setScores(nextScores);
      saveScoresToCloud(nextScores);
      setExecuting(prev => ({ ...prev, tailscale: false }));
      addLog(`SUCCESS: Tailscale overlay network active! Progress 100%, Health 94%.`);
    }, 2000);
  };

  // 4. Multiplex Connections Action
  const runConnectionsOptimize = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_connections' } })}).catch(()=>null);
    } catch(e) {}
    if (executing.connections) return;
    setExecuting(prev => ({ ...prev, connections: true }));
    addLog(`ACTION: Re-routing system sockets. Purging inactive TCP/UDP sockets...`);

    setTimeout(() => {
      const nextScores = {
        ...scores,
        connections: {
          ...scores.connections,
          progress: 100,
          health: 100,
          status: 'Gateway Optimized • Coherent Flow',
          speed: '2.5 Gbps',
          latency: '2ms'
        }
      };
      setScores(nextScores);
      saveScoresToCloud(nextScores);
      setExecuting(prev => ({ ...prev, connections: false }));
      addLog(`SUCCESS: Network socket gateway recalibrated! Sockets optimized to 100% capacity.`);
    }, 1200);
  };

  // 5. Execute Overall Optimization Audit
  const runFullAudit = () => {
    if (executing.audit) return;
    setExecuting(prev => ({ ...prev, audit: true }));
    addLog(`SYSTEM: Launching comprehensive communications routing audit...`);

    setTimeout(() => {
      const nextScores = {
        pc: { name: 'PC Connection', progress: 100, health: 99, status: 'Connected • Optimized High-Speed', speed: '980 Mbps', latency: '3ms' },
        mobile: { name: 'Mobile Companion', progress: 100, health: 97, status: 'Authorized • Secure Mesh Active', speed: '290 Mbps', latency: '15ms' },
        tailscale: { name: 'Tailscale VPN Mesh', progress: 100, health: 96, status: 'Tunnel Active • Subnet Enabled', speed: '360 Mbps', latency: '19ms' },
        connections: { name: 'Network Sockets Gateway', progress: 100, health: 100, status: 'Gateway Optimized • Coherent Flow', speed: '2.8 Gbps', latency: '1ms' }
      };
      setScores(nextScores);
      saveScoresToCloud(nextScores);
      setExecuting(prev => ({ ...prev, audit: false }));
      addLog(`SYSTEM: Comprehensive communications audit complete. All channels are operating at maximum capacity.`);
    }, 2500);
  };

  // 6. Reset Scores for Demonstration
  const resetScores = () => {
    const nextScores = {
      pc: { name: 'PC Connection', progress: 68, health: 75, status: 'Connected • Standby', speed: '450 Mbps', latency: '12ms' },
      mobile: { name: 'Mobile Companion', progress: 45, health: 62, status: 'Authorized • Idle', speed: '120 Mbps', latency: '45ms' },
      tailscale: { name: 'Tailscale VPN Mesh', progress: 30, health: 48, status: 'Tunnel Inactive', speed: '0 Mbps', latency: 'N/A' },
      connections: { name: 'Network Sockets Gateway', progress: 80, health: 82, status: 'Multiplexing', speed: '1.2 Gbps', latency: '5ms' }
    };
    setScores(nextScores);
    saveScoresToCloud(nextScores);
    addLog(`MONITOR: Connection scores restored to base diagnostic metrics.`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#030406] text-slate-100 p-6 overflow-y-auto font-sans relative">
      {/* Visual background flares */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/[0.015] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-sky-500/[0.015] blur-[120px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.05] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <h1 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
              Interactive Score Sheets & Optimizer
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            Real-time score evaluation across core PC, Mobile, Tailscale networks, and active sockets.
          </p>
        </div>

        {/* Global Reset Button */}
        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <button
            onClick={resetScores}
            className="px-3 py-1.5 bg-black/40 border border-white/[0.05] hover:border-white/[0.12] hover:bg-black/60 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Base Scores</span>
          </button>
        </div>
      </div>

      {/* Hero Overall Dials Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        
        {/* Card 1: Overall Score Sheet */}
        <div className="bg-gradient-to-br from-[#070b12] to-[#040609] border border-white/[0.03] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/[0.02] blur-xl rounded-full" />
          
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider font-display text-slate-300">Overall Score Sheet</span>
            </div>
            <span className="text-[8px] font-mono text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded bg-sky-950/20">
              COHERENCE
            </span>
          </div>

          <div className="flex items-center gap-5 my-2">
            {/* Visual Ring Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="34" stroke="#38bdf8" strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 34} 
                        strokeDashoffset={2 * Math.PI * 34 * (1 - overallScore / 100)} 
                        strokeLinecap="round"
                        className="transition-all duration-1000" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black font-mono text-white">{overallScore}</span>
                <span className="text-[8px] font-mono text-slate-500 block -mt-1">%</span>
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-slate-200">System Link Rating</div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Average connection state across all peripheral client endpoints and socket networks.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-between items-center text-[9px] font-mono text-slate-500">
            <span>STATUS:</span>
            <span className={overallScore > 85 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {overallScore > 85 ? "OPTIMIZED MATRIX" : "CALIBRATION REQUIRED"} ({overallHealth}% HEALTH)
            </span>
          </div>
        </div>

        {/* Card 2: Communications Score Sheet */}
        <div className="bg-gradient-to-br from-[#070b12] to-[#040609] border border-white/[0.03] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] blur-xl rounded-full" />
          
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider font-display text-slate-300">Communications Score</span>
            </div>
            <span className="text-[8px] font-mono text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded bg-indigo-950/20">
              SOCKETS
            </span>
          </div>

          <div className="flex items-center gap-5 my-2">
            {/* Visual Ring Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="34" stroke="#818cf8" strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 34} 
                        strokeDashoffset={2 * Math.PI * 34 * (1 - communicationsScore / 100)} 
                        strokeLinecap="round"
                        className="transition-all duration-1000" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black font-mono text-white">{communicationsScore}</span>
                <span className="text-[8px] font-mono text-slate-500 block -mt-1">%</span>
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-slate-200">Throughput Index</div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Integrity coefficient of encryption buffers, socket flow, and tunneling performance.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-between items-center text-[9px] font-mono text-slate-500">
            <span>PING INDEX:</span>
            <span className="text-indigo-400 font-bold">{overallScore > 85 ? "EXCELLENT (3ms)" : "STABLE (21ms)"}</span>
          </div>
        </div>

        {/* Card 3: Deep Audit trigger */}
        <div className="bg-gradient-to-br from-[#0c0f17] to-[#04060a] border border-[#38bdf8]/15 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/[0.05] blur-2xl rounded-full" />
          
          <div className="flex items-center gap-2 mb-3 border-b border-white/[0.04] pb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider font-display text-slate-200">Communications Optimizer</span>
          </div>

          <p className="text-[10.5px] text-slate-400 leading-relaxed">
            Run a full overlay audit to instantly calibrate and optimize PC connection speed, MobileCompanion tokens, Tailscale subnet nodes, and multiplex sockets.
          </p>

          <button
            onClick={runFullAudit}
            disabled={executing.audit}
            className="w-full mt-4 py-2 bg-[#38bdf8]/10 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/30 hover:border-[#38bdf8]/50 text-[#38bdf8] text-xs font-mono font-bold tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {executing.audit ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SCANNING COMMUNICATIONS...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRIGGER COMPREHENSIVE AUDIT</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Progress & Health Score Sheets Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* COLUMN 1: PROGRESS SCORE SHEET */}
        <div className="cyber-glass border border-white/[0.04] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                Connection Progress Score Sheet
              </h3>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Evaluation Metric: Sync Completion %</span>
          </div>

          <div className="space-y-4">
            {/* PC Connection progress */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-slate-200">{scores.pc.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-sky-400">{scores.pc.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-400 transition-all duration-1000"
                  style={{ width: `${scores.pc.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>CHANNEL STATUS: {scores.pc.status}</span>
                <span>SPEED: {scores.pc.speed}</span>
              </div>
            </div>

            {/* Mobile companion progress */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">{scores.mobile.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">{scores.mobile.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000"
                  style={{ width: `${scores.mobile.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>CHANNEL STATUS: {scores.mobile.status}</span>
                <span>SPEED: {scores.mobile.speed}</span>
              </div>
            </div>

            {/* Tailscale progress */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">{scores.tailscale.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400">{scores.tailscale.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-400 transition-all duration-1000"
                  style={{ width: `${scores.tailscale.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>CHANNEL STATUS: {scores.tailscale.status}</span>
                <span>SPEED: {scores.tailscale.speed}</span>
              </div>
            </div>

            {/* Sockets Connections progress */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">{scores.connections.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400">{scores.connections.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-400 transition-all duration-1000"
                  style={{ width: `${scores.connections.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>CHANNEL STATUS: {scores.connections.status}</span>
                <span>SPEED: {scores.connections.speed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: HEALTH SCORE SHEET */}
        <div className="cyber-glass border border-white/[0.04] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                Connection Health Score Sheet
              </h3>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Evaluation Metric: Packet Loss & Stability</span>
          </div>

          <div className="space-y-4">
            {/* PC Connection health */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  <span>PC Packet Health</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  scores.pc.health > 85 ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/20' : 'text-amber-400 bg-amber-950/20 border border-amber-500/20'
                }`}>
                  {scores.pc.health}% - {scores.pc.health > 85 ? 'OPTIMAL' : 'MODERATE'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${scores.pc.health > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${scores.pc.health}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>ESTIMATED LATENCY: {scores.pc.latency}</span>
                <span>PACKET LOSS: {scores.pc.health > 85 ? '0.00%' : '1.24%'}</span>
              </div>
            </div>

            {/* Mobile Companion health */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Mobile Companion Link Health</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  scores.mobile.health > 85 ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/20' : 'text-amber-400 bg-amber-950/20 border border-amber-500/20'
                }`}>
                  {scores.mobile.health}% - {scores.mobile.health > 85 ? 'OPTIMAL' : 'MODERATE'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${scores.mobile.health > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${scores.mobile.health}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>ESTIMATED LATENCY: {scores.mobile.latency}</span>
                <span>PACKET LOSS: {scores.mobile.health > 85 ? '0.00%' : '3.82%'}</span>
              </div>
            </div>

            {/* Tailscale health */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span>Tailscale Secure Tunnel Health</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  scores.tailscale.health > 85 ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/20' : 'text-red-400 bg-red-950/20 border border-red-500/20 animate-pulse'
                }`}>
                  {scores.tailscale.health}% - {scores.tailscale.health > 85 ? 'SECURE' : 'UNSECURED'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${scores.tailscale.health > 85 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                  style={{ width: `${scores.tailscale.health}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>ESTIMATED LATENCY: {scores.tailscale.latency}</span>
                <span>ENCRYPTION OVERHEAD: {scores.tailscale.health > 85 ? 'AES-256-GCM' : 'NONE (STALE)'}</span>
              </div>
            </div>

            {/* Sockets gateway health */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.02]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>Gateway Multiplexer Health</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  scores.connections.health > 85 ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/20' : 'text-amber-400 bg-amber-950/20 border border-amber-500/20'
                }`}>
                  {scores.connections.health}% - {scores.connections.health > 85 ? 'EXCELLENT' : 'DEGRADED'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${scores.connections.health > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${scores.connections.health}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
                <span>ESTIMATED LATENCY: {scores.connections.latency}</span>
                <span>BUFFER LEVEL: {scores.connections.health > 85 ? '0.01ms (CLEAR)' : '1.45ms (QUEUED)'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recommendations & Live Terminal Logs section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[300px]">
        
        {/* RECOMMENDATION EXECUTIONS (lg:col-span-7) */}
        <div className="lg:col-span-7 cyber-glass border border-white/[0.04] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                Executable Tuning Recommendations
              </h3>
            </div>

            <div className="space-y-3">
              {/* Rec 1: PC Connect */}
              <div className="p-3.5 bg-black/40 border border-white/[0.02] hover:border-white/[0.06] rounded-xl flex items-center justify-between text-xs transition-colors">
                <div className="min-w-0 pr-4">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-sky-400" />
                    <span>Run PC Sync Protocol</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Synchronize cache registries and establish memory-mapped transfer threads with local PC.
                  </div>
                </div>
                <button 
                  onClick={runPcOptimization}
                  disabled={executing.pc || scores.pc.progress === 100}
                  className={`px-3 py-1.5 border font-mono text-[10px] rounded transition-all uppercase whitespace-nowrap min-w-[120px] text-center font-bold ${
                    scores.pc.progress === 100
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                      : 'bg-sky-950/40 hover:bg-sky-900/40 border-sky-800/30 hover:border-sky-500/50 text-sky-400'
                  }`}
                >
                  {executing.pc ? 'SYNCING...' : scores.pc.progress === 100 ? 'PC OPTIMIZED' : 'OPTIMIZE PC'}
                </button>
              </div>

              {/* Rec 2: Mobile Comp */}
              <div className="p-3.5 bg-black/40 border border-white/[0.02] hover:border-white/[0.06] rounded-xl flex items-center justify-between text-xs transition-colors">
                <div className="min-w-0 pr-4">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Secure Mobile Handshake</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Generate fresh authorization tokens and establish secure elliptic-curve signature handshakes.
                  </div>
                </div>
                <button 
                  onClick={runMobileAuth}
                  disabled={executing.mobile || scores.mobile.progress === 100}
                  className={`px-3 py-1.5 border font-mono text-[10px] rounded transition-all uppercase whitespace-nowrap min-w-[120px] text-center font-bold ${
                    scores.mobile.progress === 100
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                      : 'bg-emerald-950/40 hover:bg-emerald-900/40 border-emerald-800/30 hover:border-emerald-500/50 text-emerald-400'
                  }`}
                >
                  {executing.mobile ? 'SECURING...' : scores.mobile.progress === 100 ? 'LINK SECURED' : 'SECURE LINK'}
                </button>
              </div>

              {/* Rec 3: Tailscale router */}
              <div className="p-3.5 bg-black/40 border border-white/[0.02] hover:border-white/[0.06] rounded-xl flex items-center justify-between text-xs transition-colors">
                <div className="min-w-0 pr-4">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Provision Tailscale Subnet</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Force network address NAT traversal, mount tailscaled daemon, and active secure overlay mesh.
                  </div>
                </div>
                <button 
                  onClick={runTailscaleRouter}
                  disabled={executing.tailscale || scores.tailscale.progress === 100}
                  className={`px-3 py-1.5 border font-mono text-[10px] rounded transition-all uppercase whitespace-nowrap min-w-[120px] text-center font-bold ${
                    scores.tailscale.progress === 100
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                      : 'bg-indigo-950/40 hover:bg-indigo-900/40 border-indigo-800/30 hover:border-indigo-500/50 text-indigo-400'
                  }`}
                >
                  {executing.tailscale ? 'CONFIGURING...' : scores.tailscale.progress === 100 ? 'TUNNEL OK' : 'MOUNT TUNNEL'}
                </button>
              </div>

              {/* Rec 4: Socket multiplexer */}
              <div className="p-3.5 bg-black/40 border border-white/[0.02] hover:border-white/[0.06] rounded-xl flex items-center justify-between text-xs transition-colors">
                <div className="min-w-0 pr-4">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-purple-400" />
                    <span>Recalibrate Socket Lanes</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Clear packet buffers, multiplex connection ports, and resolve stale socket handles.
                  </div>
                </div>
                <button 
                  onClick={runConnectionsOptimize}
                  disabled={executing.connections || scores.connections.progress === 100}
                  className={`px-3 py-1.5 border font-mono text-[10px] rounded transition-all uppercase whitespace-nowrap min-w-[120px] text-center font-bold ${
                    scores.connections.progress === 100
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                      : 'bg-purple-950/40 hover:bg-purple-900/40 border-purple-800/30 hover:border-purple-500/50 text-purple-400'
                  }`}
                >
                  {executing.connections ? 'CLEANING...' : scores.connections.progress === 100 ? 'LANES OK' : 'OPTIMIZE LANES'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TERMINAL DIAGNOSTIC LOGS (lg:col-span-5) */}
        <div className="lg:col-span-5 cyber-glass border border-white/[0.04] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                  Execution Output Console
                </h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Standard log outputs for executed connection calibrations:
            </p>

            <div className="bg-black/60 border border-white/[0.03] p-3 rounded-xl h-60 overflow-y-auto font-mono text-[9px] leading-normal space-y-1.5 scrollbar-thin text-slate-400">
              {logs.map((log, index) => (
                <div key={index} className="truncate">
                  <span className="text-emerald-500">❯</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>AUDIT STATE: OK</span>
            <span>TCP/UDP PORTS: SECURE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
