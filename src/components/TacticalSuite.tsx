import { useState, useEffect, useRef } from 'react';
import { 
  Compass, Crosshair, Activity, Target, Shield, 
  Play, Square, RefreshCw 
} from 'lucide-react';

interface TargetNode {
  id: string;
  name: string;
  type: 'Drone' | 'Satellite' | 'Base Station' | 'Server Nexus' | 'Relay Station';
  lat: number;
  lng: number;
  threatLevel: 'MINIMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ONLINE' | 'ACTIVE' | 'SHIELDED' | 'STANDBY';
  velocity: string;
  frequency: string;
}

export default function TacticalSuite() {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('T-01');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const radarAngleRef = useRef<number>(0);
  const [commLogs, setCommLogs] = useState<string[]>([
    '[INIT] Map Communication Active.',
    '[SYS] Syncing coordinate locations with global network...',
    '[INFO] Connection locked on target vector Alpha-9.',
  ]);

  const [targets, setTargets] = useState<TargetNode[]>([
    { id: 'T-01', name: 'Alpha-9 Satellite Connection', type: 'Satellite', lat: 37.7749, lng: -122.4194, threatLevel: 'MINIMAL', status: 'ONLINE', velocity: '7,540 m/s', frequency: '14.24 GHz' },
    { id: 'T-02', name: 'Airborne Drone Beta-3', type: 'Drone', lat: 34.0522, lng: -118.2437, threatLevel: 'HIGH', status: 'ACTIVE', velocity: '450 m/s', frequency: '5.82 GHz' },
    { id: 'T-03', name: 'Main Server Core', type: 'Server Nexus', lat: 40.7128, lng: -74.0060, threatLevel: 'CRITICAL', status: 'ONLINE', velocity: '0 m/s', frequency: '920.4 MHz' },
    { id: 'T-04', name: 'Pacific Relay Station 12', type: 'Relay Station', lat: 21.3069, lng: -157.8583, threatLevel: 'MEDIUM', status: 'STANDBY', velocity: '0 m/s', frequency: '2.44 GHz' },
    { id: 'T-05', name: 'Orbital Uplink Gamma-1', type: 'Satellite', lat: 51.5074, lng: -0.1278, threatLevel: 'MINIMAL', status: 'SHIELDED', velocity: '7,620 m/s', frequency: '18.91 GHz' },
  ]);

  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate Radar Sweep Visual
  useEffect(() => {
    let animationId: number;
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 10;

      // Draw background rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let r = radius / 4; r <= radius; r += radius / 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Draw outer circle ticks
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw radar sweep line
      if (isScanning) {
        radarAngleRef.current = (radarAngleRef.current + 1.5) % 360;
      }
      const angleRad = (radarAngleRef.current * Math.PI) / 180;
      const sweepX = cx + radius * Math.cos(angleRad);
      const sweepY = cy + radius * Math.sin(angleRad);

      // Gradient sweep effect
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.02)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angleRad - 0.25, angleRad);
      ctx.closePath();
      ctx.fill();

      // Core scanning line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Draw targets as flashing dots
      targets.forEach((target, index) => {
        // Map target coordinates relative to center
        // Let's create semi-deterministic relative spots on radar
        const seedAngle = (index * 72 + 35) * (Math.PI / 180);
        const seedDist = (radius * (0.3 + (index * 0.15))) % radius;
        const tx = cx + seedDist * Math.cos(seedAngle);
        const ty = cy + seedDist * Math.sin(seedAngle);

        const isSelected = target.id === selectedTargetId;

        // Draw targets
        ctx.fillStyle = target.threatLevel === 'CRITICAL' || target.threatLevel === 'HIGH' 
          ? 'rgba(239, 68, 68, 0.85)' 
          : 'rgba(56, 189, 248, 0.85)';
        ctx.beginPath();
        ctx.arc(tx, ty, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw pulse around selected target
        if (isSelected) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tx, ty, 8 + Math.sin(Date.now() / 150) * 4, 0, Math.PI * 2);
          ctx.stroke();

          // Target Label Text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.font = '9px monospace';
          ctx.fillText(target.id, tx + 8, ty - 4);
        }
      });

      animationId = requestAnimationFrame(drawRadar);
    };

    drawRadar();
    return () => cancelAnimationFrame(animationId);
  }, [isScanning, targets, selectedTargetId]);

  const addCommLog = (msg: string) => {
    setCommLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const selectedTarget = targets.find(t => t.id === selectedTargetId) || targets[0];

  const handleInterceptTarget = (id: string) => {
    addCommLog(`SYSTEM: Targeting laser ready for device ${id}.`);
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'tactical_laser', targetId: id } })}).catch(()=>null);
    } catch(e) {}
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        addCommLog(`SYSTEM: Laser started. Device ${t.name} status changed to ACTIVE.`);
        return { ...t, status: 'ACTIVE' };
      }
      return t;
    }));
  };

  const handleShieldTarget = (id: string) => {
    addCommLog(`SYSTEM: Activating defense shield for device ${id}.`);
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'SHIELDED' };
      }
      return t;
    }));
  };

  const handleSyncGps = () => {
    addCommLog(`SYSTEM: Syncing location data with GPS satellites...`);
    setTimeout(() => {
      addCommLog(`SYSTEM: GPS sync complete.`);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#030406] text-slate-100 p-6 overflow-y-auto font-sans">
      {/* Background glow effects */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-sky-500/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-red-500/[0.015] blur-[120px] rounded-full pointer-events-none" />

      {/* Title & Banner HUD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.05] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
              TACTICAL MAP & MONITOR
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            NETWORK STATUS: SECURE • DETECTING 5 DEVICE LOCATIONS ON MAP
          </p>
        </div>

        {/* Global HUD Stats Bar */}
        <div className="flex flex-wrap gap-4 mt-3 md:mt-0 text-[10px] font-mono bg-black/40 border border-white/[0.05] p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-slate-500">LASER BEAM STATUS</span>
            <span className="text-emerald-400 font-bold">READY</span>
          </div>
          <div className="w-[1px] bg-white/[0.08]" />
          <div className="flex flex-col">
            <span className="text-slate-500">SCAN FREQUENCY</span>
            <span className="text-[#38bdf8] font-bold">582.04 THz</span>
          </div>
          <div className="w-[1px] bg-white/[0.08]" />
          <div className="flex flex-col">
            <span className="text-slate-500">DEFENSE SHIELD</span>
            <span className="text-amber-400 font-bold">94.8% POWER</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
        {/* Left Interactive Radar Sweeper (lg:col-span-5) */}
        <div className="lg:col-span-5 cyber-glass border border-white/[0.04] rounded-2xl p-5 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 border border-white/[0.04] px-2.5 py-1 rounded-md text-[9px] font-mono">
            <Compass className="w-3.5 h-3.5 text-[#38bdf8] animate-spin" />
            <span className="text-slate-300">RADAR SCANNER ACTIVE</span>
          </div>

          <div className="flex-1 flex items-center justify-center py-6 w-full max-w-[280px] aspect-square relative">
            <canvas 
              ref={radarCanvasRef} 
              width={260} 
              height={260}
              className="border border-white/[0.02] rounded-full bg-black/40"
            />
          </div>

          {/* Radar Controls */}
          <div className="w-full border-t border-white/[0.04] pt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all ${
                isScanning 
                  ? 'bg-red-950/20 border border-red-500/20 text-red-400' 
                  : 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400'
              }`}
            >
              {isScanning ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>HALT RADAR</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>START RADAR</span>
                </>
              )}
            </button>

            <button
              onClick={handleSyncGps}
              className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] rounded-lg text-[10px] font-mono flex items-center gap-1.5 text-slate-300"
            >
              <RefreshCw className="w-3 h-3 text-[#38bdf8]" />
              <span>RESET CALIBRATION</span>
            </button>
          </div>
        </div>

        {/* Middle Target Detail & Comm Terminal (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Target List and Quick Lock Grid */}
          <div className="cyber-glass border-white/[0.05] rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-3">
              MONITORED DEVICES & THREAT LEVEL
            </h3>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {targets.map((target) => {
                const isSelected = target.id === selectedTargetId;
                const isCritical = target.threatLevel === 'CRITICAL' || target.threatLevel === 'HIGH';
                return (
                  <div
                    key={target.id}
                    onClick={() => {
                      setSelectedTargetId(target.id);
                      addCommLog(`USER: Targeted coordinate lock mapped to ${target.id} (${target.name}).`);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'bg-sky-950/15 border-sky-500/20 text-white shadow-md' 
                        : 'bg-black/30 border-white/[0.02] hover:border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500/10' : 'bg-white/[0.01]'} border ${isSelected ? 'border-sky-500/25' : 'border-white/[0.04]'}`}>
                        <Crosshair className={`w-4 h-4 ${isSelected ? 'text-[#38bdf8]' : 'text-slate-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold font-display truncate">
                          {target.name}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="uppercase">{target.type}</span>
                          <span>•</span>
                          <span>{target.velocity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${
                        isCritical 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/15' 
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/15'
                      }`}>
                        {target.threatLevel}
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/[0.04] ${
                        target.status === 'ONLINE' || target.status === 'ACTIVE'
                          ? 'text-emerald-400'
                          : target.status === 'SHIELDED'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}>
                        {target.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Target Matrix Controls */}
          <div className="cyber-glass border-white/[0.05] rounded-2xl p-5 flex-1 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#38bdf8]/5 blur-2xl rounded-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4">
                <span className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-wider font-bold">
                  Target Coordinate Matrix
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  ID REFERENCE: {selectedTarget.id}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">Type Specifier</span>
                  <span className="text-xs font-bold font-display text-slate-200 mt-1 block">{selectedTarget.type}</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">Lat coordinate</span>
                  <span className="text-xs font-bold font-mono text-sky-400 mt-1 block">{selectedTarget.lat.toFixed(4)}°N</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">Lng coordinate</span>
                  <span className="text-xs font-bold font-mono text-sky-400 mt-1 block">{selectedTarget.lng.toFixed(4)}°W</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">Carrier Bandwidth</span>
                  <span className="text-xs font-bold font-mono text-slate-200 mt-1 block">{selectedTarget.frequency}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleInterceptTarget(selectedTarget.id)}
                className="flex-1 py-2.5 bg-red-950/10 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-400 hover:text-white rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4 animate-pulse" />
                <span>START PROTECTIVE LASER</span>
              </button>

              <button
                onClick={() => handleShieldTarget(selectedTarget.id)}
                className="flex-1 py-2.5 bg-sky-950/10 border border-sky-500/20 hover:bg-sky-500/10 hover:border-sky-500/40 text-[#38bdf8] hover:text-white rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>TURN ON PROTECTIVE SHIELD</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Diagnostic Comm logs at the footer */}
      <div className="mt-6 cyber-glass border-white/[0.05] rounded-2xl p-4">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase">
            <Activity className="w-3.5 h-3.5 text-red-500" />
            <span>SYSTEM COMMUNICATION LOGS</span>
          </span>
          <span className="text-[9px] font-mono text-slate-600 uppercase">
            COMMUNICATION CHANNELS READY
          </span>
        </div>

        <div className="space-y-1.5 max-h-[100px] overflow-y-auto font-mono text-[9px] leading-relaxed text-slate-500">
          {commLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-slate-600 select-none">[{idx.toString().padStart(2, '0')}]</span>
              <span className={log.includes('WARN') ? 'text-amber-400/90' : log.includes('INIT') ? 'text-emerald-400' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
