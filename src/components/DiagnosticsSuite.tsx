import { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Shield, Volume2, Play, Square, Flame, 
  Wind, Terminal, Database, Sliders,
  Layers, Activity, Gauge, AlertTriangle, CheckCircle2
} from 'lucide-react';

interface Subsystem {
  name: string;
  category: 'LOGIC' | 'NETWORKING' | 'MEMORY' | 'HARDWARE';
  status: 'OPTIMAL' | 'COMPROMISED' | 'WARNING' | 'REPAIRING';
  efficiency: number;
}

export default function DiagnosticsSuite() {
  // --- SUB-TABS STATE ---
  // 'all' = Consolidated Deck
  // 'synth' = Recommendation 1: Web Audio Pitch Synth
  // 'thermal' = Recommendation 2: Core Heat Monitor
  // 'repair' = Recommendation 3: Automated Self-Repair Protocol
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'synth' | 'thermal' | 'repair'>('all');

  // --- RECOMMENDATION 1: WEB AUDIO SYNTH & PITCH MODULATOR ---
  const [synthWave, setSynthWave] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  const [pitch, setPitch] = useState<number>(440); // A4 default
  const [isPlayingSynth, setIsPlayingSynth] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startTone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop existing oscillator if any
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = synthWave;
      osc.frequency.setValueAtTime(pitch, audioCtxRef.current.currentTime);
      
      // Keep volume safe, soft and pleasant
      gain.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlayingSynth(true);
      addLog(`SYNTH: Initialized diagnostic ${synthWave} wave tone at ${pitch}Hz.`);
    } catch (e) {
      console.error('Failed to play synthesizer tone', e);
    }
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    setIsPlayingSynth(false);
    addLog('SYNTH: Stopped audio diagnostic diagnostics.');
  };

  // Adjust pitch in real-time
  useEffect(() => {
    if (isPlayingSynth && oscillatorRef.current && audioCtxRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(pitch, audioCtxRef.current.currentTime);
    }
  }, [pitch, isPlayingSynth]);

  // Adjust waveform in real-time
  useEffect(() => {
    if (isPlayingSynth && oscillatorRef.current) {
      startTone();
    }
  }, [synthWave]);

  // Clean up oscillator on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Live Oscilloscope Simulation Drawing
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw baseline center line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Setup primary wave stroke
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(0.5, '#6366f1');
      gradient.addColorStop(1, '#ec4899');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      const width = canvas.width;
      const height = canvas.height;
      const amplitude = isPlayingSynth ? 35 : 4; // small idle noise vs high amplitude
      const frequency = (pitch / 440) * 0.04; // speed/wavelength proportional to pitch
      
      for (let x = 0; x < width; x++) {
        let y = height / 2;
        if (synthWave === 'sine') {
          y += Math.sin(x * frequency + phase) * amplitude;
        } else if (synthWave === 'square') {
          y += Math.sign(Math.sin(x * frequency + phase)) * amplitude;
        } else if (synthWave === 'sawtooth') {
          y += (((x * frequency + phase) % (Math.PI * 2)) / (Math.PI * 2) - 0.5) * 2 * amplitude;
        } else if (synthWave === 'triangle') {
          y += (Math.abs(((x * frequency + phase) % (Math.PI * 2)) / Math.PI - 1) - 0.5) * 2 * amplitude;
        }
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      phase += isPlayingSynth ? (pitch / 440) * 0.12 : 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlayingSynth, synthWave, pitch, activeSubTab]);


  // --- RECOMMENDATION 2: DYNAMIC THERMAL MONITOR & OVERCLOCK FLUID INJECTION ---
  const [thermals, setThermals] = useState({
    cpu: 64,
    gpu: 71,
    neuralTPU: 58,
    memoryCore: 52
  });
  const [isCoolingActive, setIsCoolingActive] = useState<boolean>(false);
  const [isUnderclocked, setIsUnderclocked] = useState<boolean>(false);
  const [coolantLevel, setCoolantLevel] = useState<number>(100);

  // Thermals simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setThermals(prev => {
        let coolingFactor = isCoolingActive ? -5 : 0;
        let clockFactor = isUnderclocked ? -7 : 1.2;
        
        const randomFluctuation = () => Math.floor(Math.random() * 5) - 2;

        return {
          cpu: Math.max(38, Math.min(98, prev.cpu + randomFluctuation() + coolingFactor + clockFactor)),
          gpu: Math.max(42, Math.min(105, prev.gpu + randomFluctuation() + coolingFactor + clockFactor * 1.2)),
          neuralTPU: Math.max(35, Math.min(95, prev.neuralTPU + randomFluctuation() + coolingFactor + clockFactor * 0.8)),
          memoryCore: Math.max(30, Math.min(85, prev.memoryCore + randomFluctuation() + coolingFactor + clockFactor * 0.6))
        };
      });

      // Coolant level recovery
      if (!isCoolingActive && coolantLevel < 100) {
        setCoolantLevel(prev => Math.min(100, prev + 2));
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [isCoolingActive, isUnderclocked, coolantLevel]);

  const triggerCoolingFluid = () => {
    if (isCoolingActive || coolantLevel < 20) return;
    setIsCoolingActive(true);
    setCoolantLevel(prev => Math.max(0, prev - 35));
    addLog('COOLING: Injected liquid helium coolant matrix into central processing cluster.');
    setTimeout(() => {
      setIsCoolingActive(false);
      addLog('COOLING: Thermal pressure normalization cycle complete. Nitrogen chambers secure.');
    }, 6000);
  };

  // Derived Performance Multiplier
  const clockMultiplier = isUnderclocked 
    ? 0.85 
    : parseFloat((1.0 + (98 - thermals.cpu) / 38).toFixed(2));


  // --- RECOMMENDATION 3: AUTOMATED SELF-REPAIR PROTOCOL SCANNER ---
  const [subsystems, setSubsystems] = useState<Subsystem[]>([
    { name: 'Memory Allocation Index', category: 'MEMORY', status: 'OPTIMAL', efficiency: 98 },
    { name: 'Gateway Sockets Bus', category: 'NETWORKING', status: 'WARNING', efficiency: 74 },
    { name: 'Cognitive Logic Gates', category: 'LOGIC', status: 'OPTIMAL', efficiency: 95 },
    { name: 'SHA Decryptor Engine', category: 'MEMORY', status: 'COMPROMISED', efficiency: 42 },
    { name: 'Neural Hypervisor Router', category: 'LOGIC', status: 'OPTIMAL', efficiency: 99 },
    { name: 'Thermodynamic Coolant Pump', category: 'HARDWARE', status: 'WARNING', efficiency: 68 }
  ]);

  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanType, setScanType] = useState<'quick' | 'deep' | 'memory'>('quick');
  const [scanLogs, setScanLogs] = useState<string[]>([
    '[INIT] Diagnostic scanning module online.',
    '[INFO] Select a scan protocol type below and dispatch the probe.'
  ]);

  const addScanLog = (msg: string) => {
    setScanLogs(prev => [...prev.slice(-25), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleRunSystemScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    addScanLog(`DISPATCHER: Instantiating [${scanType.toUpperCase()}] integrity checksum probe...`);

    const totalSteps = scanType === 'deep' ? 30 : scanType === 'memory' ? 20 : 12;
    const intervalTime = scanType === 'deep' ? 250 : scanType === 'memory' ? 180 : 100;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const current = Math.floor((step / totalSteps) * 100);
      
      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanProgress(100);
        addScanLog('DISPATCHER: Integrity validation sequence completed. Calibration results loaded.');
      } else {
        setScanProgress(current);
        if (step === Math.floor(totalSteps * 0.25)) {
          addScanLog(`DISPATCHER: Probing database registers... Standard bounds verified.`);
        } else if (step === Math.floor(totalSteps * 0.5)) {
          addScanLog(`DISPATCHER: Analyzing decryption pipeline entropy metrics... SHA registers unstable.`);
        } else if (step === Math.floor(totalSteps * 0.75)) {
          addScanLog(`DISPATCHER: Polling thermoelectric coolant state... Flow warning flagged.`);
        }
      }
    }, intervalTime);
  };

  const handleSelfRepair = () => {
    addScanLog('REPAIRMAN: Shunting hot-bypass lines for compromised subsystems...');
    
    setSubsystems(prev => prev.map(s => {
      if (s.status !== 'OPTIMAL') {
        addScanLog(`REPAIRMAN: Recalibrating '${s.name}'. Swapping logic gates...`);
        return { ...s, status: 'REPAIRING', efficiency: Math.min(100, s.efficiency + 15) };
      }
      return s;
    }));

    setTimeout(() => {
      setSubsystems(prev => prev.map(s => {
        if (s.status === 'REPAIRING' || s.status !== 'OPTIMAL') {
          return { ...s, status: 'OPTIMAL', efficiency: 100 };
        }
        return s;
      }));
      addScanLog('REPAIRMAN: Matrix auto-repair complete. All modules locked in OPTIMAL status.');
    }, 2000);
  };

  const handleRepairModule = (index: number) => {
    const sub = subsystems[index];
    addScanLog(`REPAIRMAN: Dispatching targeted repair unit to subsystem: ${sub.name}`);
    setSubsystems(prev => prev.map((s, i) => {
      if (i === index) {
        return { ...s, status: 'REPAIRING' };
      }
      return s;
    }));

    setTimeout(() => {
      setSubsystems(prev => prev.map((s, i) => {
        if (i === index) {
          return { ...s, status: 'OPTIMAL', efficiency: 100 };
        }
        return s;
      }));
      addScanLog(`REPAIRMAN: Targeted repair of '${sub.name}' completed successfully.`);
    }, 1200);
  };


  // Logs display
  const [generalLogs, setGeneralLogs] = useState<string[]>([
    '[SECURE] Diagnostics suite compiled and ready.',
    '[SYSTEM] Local audio node initialized under soft credentials.'
  ]);

  const addLog = (msg: string) => {
    setGeneralLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#030406] text-slate-100 p-6 overflow-y-auto font-sans relative">
      {/* Background subtle highlight */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/[0.015] blur-[150px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.05] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h1 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
              JARVIS System Development Center
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            Interactive center to monitor system heat, test sounds, and repair errors.
          </p>
        </div>

        {/* Core Global Status Metrics */}
        <div className="flex items-center gap-4 mt-3 md:mt-0 text-[10px] font-mono bg-black/40 border border-white/[0.04] p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-slate-500">ENGINE STATE</span>
            <span className={`font-bold uppercase ${isPlayingSynth ? 'text-sky-400' : 'text-indigo-400'}`}>
              {isPlayingSynth ? 'SIGNAL ACTIVE' : 'GRID STANDBY'}
            </span>
          </div>
          <div className="w-[1px] h-4 bg-white/[0.08]" />
          <div className="flex flex-col">
            <span className="text-slate-500">CLOCK MULTIPLIER</span>
            <span className="text-amber-400 font-bold">{clockMultiplier}x SPEED</span>
          </div>
          <div className="w-[1px] h-4 bg-white/[0.08]" />
          <div className="flex flex-col">
            <span className="text-slate-500">SYSTEM STABILITY</span>
            <span className="text-emerald-400 font-bold">98.4% SECURE</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR (Enhance & Consolidate Recommendations) */}
      <div className="flex cyber-glass p-1 rounded-xl border-white/[0.05] mb-6 gap-1 max-w-2xl">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-all duration-300 flex items-center justify-center gap-2 ${
            activeSubTab === 'all'
              ? 'bg-[#1e293b]/50 border border-white/[0.08] text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>All-In-One Dashboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('synth')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-all duration-300 flex items-center justify-center gap-2 ${
            activeSubTab === 'synth'
              ? 'bg-[#1e293b]/50 border border-white/[0.08] text-sky-400 shadow-lg'
              : 'text-slate-400 hover:text-sky-300 hover:bg-white/[0.01]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-sky-400" />
          <span>1. Sound Generator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('thermal')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-all duration-300 flex items-center justify-center gap-2 ${
            activeSubTab === 'thermal'
              ? 'bg-[#1e293b]/50 border border-white/[0.08] text-amber-400 shadow-lg'
              : 'text-slate-400 hover:text-amber-300 hover:bg-white/[0.01]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>2. Temperature Monitor</span>
        </button>

        <button
          onClick={() => setActiveSubTab('repair')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-all duration-300 flex items-center justify-center gap-2 ${
            activeSubTab === 'repair'
              ? 'bg-[#1e293b]/50 border border-white/[0.08] text-emerald-400 shadow-lg'
              : 'text-slate-400 hover:text-emerald-300 hover:bg-white/[0.01]'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Automatic Error Fixer</span>
        </button>
      </div>

      {/* ACTIVE SUB-TAB CONTAINER CONTENT */}
      <div className="flex-1 min-h-0">
        
        {/* TAB 1: ALL CONSOLIDATED COCKPIT VIEW */}
        {activeSubTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recommendation 1 Quick Card */}
            <div className="lg:col-span-4 cyber-glass border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                      Sound Generator
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded bg-sky-950/20">
                    REC 01
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                  Generates raw testing tones. Use the screens below or the sound tab to watch the live soundwaves.
                </p>

                {/* Oscilloscope Mini Preview */}
                <div className="bg-black/60 border border-white/[0.03] p-2 rounded-xl mb-4 overflow-hidden">
                  <canvas ref={canvasRef} width="320" height="90" className="w-full h-20 rounded opacity-90" />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>ACTIVE WAVEFORM</span>
                  <span className="text-sky-400 font-bold uppercase">{synthWave}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-white/[0.04] pt-4 flex gap-2">
                <button
                  onClick={() => setActiveSubTab('synth')}
                  className="flex-1 py-1.5 border border-white/[0.06] hover:bg-white/[0.02] text-slate-300 rounded-lg text-[10px] font-mono uppercase transition-all"
                >
                  Configure Sounds
                </button>
                {!isPlayingSynth ? (
                  <button
                    onClick={startTone}
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>PLAY</span>
                  </button>
                ) : (
                  <button
                    onClick={stopTone}
                    className="flex-1 py-1.5 bg-red-950/20 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Square className="w-2.5 h-2.5 fill-current animate-pulse" />
                    <span>STOP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Recommendation 2 Quick Card */}
            <div className="lg:col-span-4 cyber-glass border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                      Core Temperature Monitor
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded bg-amber-950/20">
                    REC 02
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                  Scale processor cores. Keep the system cool to prevent slowing down under heavy processing loads.
                </p>

                {/* Main Temperature meter */}
                <div className="bg-black/40 border border-white/[0.03] p-4 rounded-xl space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">CORE TEMPERATURE</span>
                    <span className={`text-xs font-mono font-bold ${thermals.cpu > 78 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                      {thermals.cpu}°C
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        thermals.cpu > 78 ? 'bg-red-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${thermals.cpu}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>COOLANT RESERVOIR</span>
                    <span className="text-sky-400">{coolantLevel}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/[0.04] pt-4 flex gap-2">
                <button
                  onClick={() => setActiveSubTab('thermal')}
                  className="flex-1 py-1.5 border border-white/[0.06] hover:bg-white/[0.02] text-slate-300 rounded-lg text-[10px] font-mono uppercase transition-all"
                >
                  More Details
                </button>
                <button
                  onClick={triggerCoolingFluid}
                  disabled={isCoolingActive || coolantLevel < 20}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                    isCoolingActive
                      ? 'bg-sky-950/30 border border-sky-500/20 text-sky-400'
                      : 'bg-sky-900 hover:bg-sky-800 text-white shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  }`}
                >
                  <Wind className="w-2.5 h-2.5" />
                  <span>COOL DOWN</span>
                </button>
              </div>
            </div>

            {/* Recommendation 3 Quick Card */}
            <div className="lg:col-span-4 cyber-glass border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                      Self-Repair Center
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-950/20">
                    REC 03
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                  Run diagnostics checks and click repair to fix component issues immediately.
                </p>

                {/* Subsystem small list */}
                <div className="space-y-2 mb-4">
                  {subsystems.slice(0, 3).map((sub, idx) => (
                    <div key={idx} className="p-2 bg-black/40 border border-white/[0.02] rounded-lg flex items-center justify-between text-[10px]">
                      <span className="text-slate-300 font-medium truncate max-w-[120px]">{sub.name}</span>
                      <span className={`text-[8px] font-mono px-1 rounded border ${
                        sub.status === 'OPTIMAL' ? 'text-emerald-400 border-emerald-500/20' : 'text-amber-400 border-amber-500/20'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-white/[0.04] pt-4 flex gap-2">
                <button
                  onClick={() => setActiveSubTab('repair')}
                  className="flex-1 py-1.5 border border-white/[0.06] hover:bg-white/[0.02] text-slate-300 rounded-lg text-[10px] font-mono uppercase transition-all"
                >
                  Script Center
                </button>
                <button
                  onClick={handleSelfRepair}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-mono font-bold transition-all"
                >
                  REPAIR NOW
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DETAILED SOUND & PITCH SYNTH PANEL */}
        {activeSubTab === 'synth' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Control Panel (col-span-5) */}
            <div className="lg:col-span-5 cyber-glass border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                  <Volume2 className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                    Sound Pitch Panel
                  </h3>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-relaxed mb-5">
                  Verify speaker performance. Generate clean sound pitches and watch the graph to check speaker status in real time.
                </p>

                {/* Carrier Selection */}
                <div className="space-y-3 mb-6">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block">Select Soundwave Type</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['sine', 'square', 'sawtooth', 'triangle'] as const).map((wave) => (
                      <button
                        key={wave}
                        onClick={() => {
                          setSynthWave(wave);
                          addLog(`SYNTH: Changed carrier wave profile to ${wave.toUpperCase()}`);
                        }}
                        className={`py-2.5 rounded-xl text-[10px] font-mono uppercase border transition-all ${
                          synthWave === wave
                            ? 'bg-sky-950/30 border-sky-500/30 text-sky-400 font-bold'
                            : 'bg-black/40 border-white/[0.02] hover:border-white/[0.06] text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {wave}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pitch Frequency Slider */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">SOUND PITCH</span>
                    <span className="text-sky-400 font-bold bg-sky-950/20 border border-sky-500/20 px-2 py-0.5 rounded">
                      {pitch} Hz
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="1500" 
                    value={pitch} 
                    onChange={(e) => setPitch(parseInt(e.target.value))}
                    className="w-full accent-sky-400 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-600">
                    <span>100Hz (DEEP BASS)</span>
                    <span>440Hz (A4 TUNE)</span>
                    <span>1500Hz (HIGH TREBLE)</span>
                  </div>
                </div>

                {/* Quick Calibration Frequency Presets */}
                <div className="space-y-3">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block">Quick Pitch Presets</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { hz: 120, label: 'SUB' },
                      { hz: 440, label: 'A4' },
                      { hz: 528, label: 'SOL' },
                      { hz: 880, label: 'A5' },
                      { hz: 963, label: 'PURE' }
                    ].map((preset) => (
                      <button
                        key={preset.hz}
                        onClick={() => {
                          setPitch(preset.hz);
                          addLog(`SYNTH: Jumped tone to Calibration Preset ${preset.hz}Hz [${preset.label}]`);
                        }}
                        className={`py-1.5 rounded text-[9px] font-mono border transition-all ${
                          pitch === preset.hz
                            ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-400 font-bold'
                            : 'bg-black/30 border-white/[0.02] hover:border-white/[0.06] text-slate-400'
                        }`}
                      >
                        <div>{preset.label}</div>
                        <div className="text-[7px] text-slate-500 mt-0.5">{preset.hz}Hz</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pitch synthesizer emit actions */}
              <div className="border-t border-white/[0.04] pt-5 mt-6 flex gap-3">
                {!isPlayingSynth ? (
                  <button
                    onClick={startTone}
                    className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>PLAY SOUND</span>
                  </button>
                ) : (
                  <button
                    onClick={stopTone}
                    className="flex-1 py-3 bg-red-950/30 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4 fill-current animate-pulse" />
                    <span>STOP SOUND</span>
                  </button>
                )}
              </div>
            </div>

            {/* Oscilloscope Sandbox (col-span-7) */}
            <div className="lg:col-span-7 cyber-glass border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span>Real-Time Audio Graph</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
                    GRAPH ACTIVE
                  </span>
                </div>

                {/* Large custom Canvas */}
                <div className="bg-black/80 border border-white/[0.05] p-3 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center min-h-[220px]">
                  <canvas ref={canvasRef} width="600" height="200" className="w-full h-[200px] rounded-xl opacity-95" />
                  
                  {/* Status Overlay */}
                  {!isPlayingSynth && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none">
                      <Volume2 className="w-8 h-8 text-slate-600 animate-bounce mb-2" />
                      <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Sound is Stopped</span>
                      <p className="text-[10px] text-slate-600 max-w-[280px] mt-1">The sound graph is idle. Click "Play Sound" to start generating audio tones and watch the graph.</p>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Note: Volume is safely capped at 6% for pleasant hearing. Safe pitch limits are always maintained.
                </p>
              </div>

              {/* Core Wave Stats readout */}
              <div className="border-t border-white/[0.04] pt-4 mt-4 grid grid-cols-3 gap-4 text-center font-mono text-[10px]">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/[0.02]">
                  <span className="text-slate-500 block text-[8px] uppercase">Wavelength</span>
                  <span className="text-sky-400 font-bold">{(1000 / pitch).toFixed(2)} ms</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/[0.02]">
                  <span className="text-slate-500 block text-[8px] uppercase">Peak Amplitude</span>
                  <span className="text-indigo-400 font-bold">{isPlayingSynth ? '0.06 Vpp' : '0.00 Vpp'}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/[0.02]">
                  <span className="text-slate-500 block text-[8px] uppercase">Harmonic Phase</span>
                  <span className="text-purple-400 font-bold">{isPlayingSynth ? 'Dynamic' : 'Coherent'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CORE THERMAL & OVERCLOCK SYSTEM PANEL */}
        {activeSubTab === 'thermal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Heat gauges (col-span-7) */}
            <div className="lg:col-span-7 cyber-glass border border-white/[0.04] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                    Processor Temperature Matrix
                  </h3>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-relaxed mb-6">
                  High processing speeds make the AI smarter but generate more heat. Maintain safe temperature limits.
                </p>

                {/* Readouts List */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* CPU Gauge */}
                  <div className="bg-black/40 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Thinking Cores</span>
                      <span className={`text-[10px] font-mono font-bold ${thermals.cpu > 75 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                        {thermals.cpu}°C
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          thermals.cpu > 75 ? 'bg-red-500' : 'bg-sky-400'
                        }`}
                        style={{ width: `${thermals.cpu}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 mt-2 block font-mono">LIMIT: 105°C max</span>
                  </div>

                  {/* GPU Gauge */}
                  <div className="bg-black/40 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Image Cores</span>
                      <span className={`text-[10px] font-mono font-bold ${thermals.gpu > 80 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                        {thermals.gpu}°C
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          thermals.gpu > 80 ? 'bg-red-500' : 'bg-purple-400'
                        }`}
                        style={{ width: `${thermals.gpu}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 mt-2 block font-mono">LIMIT: 110°C max</span>
                  </div>

                  {/* TPU Gauge */}
                  <div className="bg-black/40 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">AI Training Cores</span>
                      <span className={`text-[10px] font-mono font-bold ${thermals.neuralTPU > 75 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                        {thermals.neuralTPU}°C
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          thermals.neuralTPU > 75 ? 'bg-red-500' : 'bg-indigo-400'
                        }`}
                        style={{ width: `${thermals.neuralTPU}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 mt-2 block font-mono">LIMIT: 95°C max</span>
                  </div>

                  {/* Memory Gauge */}
                  <div className="bg-black/40 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Memory Chips</span>
                      <span className={`text-[10px] font-mono font-bold ${thermals.memoryCore > 70 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                        {thermals.memoryCore}°C
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          thermals.memoryCore > 70 ? 'bg-red-500' : 'bg-pink-400'
                        }`}
                        style={{ width: `${thermals.memoryCore}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 mt-2 block font-mono">LIMIT: 85°C max</span>
                  </div>
                </div>
              </div>

              {/* Status Warning if hot */}
              {thermals.cpu > 78 || thermals.gpu > 82 ? (
                <div className="bg-red-950/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
                  <div>
                    <span className="text-xs font-bold text-red-200 font-display uppercase tracking-wider block">OVERHEAT WARNING</span>
                    <p className="text-[10px] text-red-400/90 leading-relaxed mt-1">Silicon structures are getting hot. Click "COOL DOWN" or turn on the speed limiter to lower heat.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/10 border border-emerald-500/10 p-4 rounded-2xl flex items-start gap-3 mt-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-200 font-display uppercase tracking-wider block">SYSTEM COOL</span>
                    <p className="text-[10px] text-slate-400/90 leading-relaxed mt-1">All processors are operating at safe temperatures. Speeds are highly optimized.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Overclock / Cooling details (col-span-5) */}
            <div className="lg:col-span-5 cyber-glass border border-white/[0.04] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                    Processor Speed Adjuster
                  </h3>
                </div>

                {/* Clock multiplier stats */}
                <div className="bg-black/60 border border-white/[0.03] p-5 rounded-2xl text-center space-y-2 mb-6">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">PROCESSING SPEED MULTIPLIER</span>
                  <div className="text-4xl font-extrabold font-display tracking-tight text-amber-400">
                    {clockMultiplier}x
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">
                    {(clockMultiplier * 3.4).toFixed(2)} GHz Actual Speed
                  </span>
                </div>

                {/* Liquid Helium Reservoir */}
                <div className="space-y-3 mb-6 bg-black/40 border border-white/[0.03] p-4 rounded-2xl">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" /> COOLANT RESERVOIR
                    </span>
                    <span className="text-sky-400 font-bold">{coolantLevel}%</span>
                  </div>
                  
                  {/* Helium fluid container */}
                  <div className="h-5 w-full bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                      style={{ width: `${coolantLevel}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-slate-400">
                      COOLING FLUID MATRIX
                    </div>
                  </div>
                  <p className="text-[8.5px] text-slate-500 font-mono">Refills automatically at +2% every few seconds.</p>
                </div>
              </div>

              {/* Cooling actions */}
              <div className="space-y-2">
                <button
                  onClick={triggerCoolingFluid}
                  disabled={isCoolingActive || coolantLevel < 20}
                  className={`w-full py-3 rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isCoolingActive
                      ? 'bg-sky-950/40 border border-sky-500/20 text-sky-400'
                      : coolantLevel < 20
                      ? 'bg-red-950/20 border border-red-500/10 text-red-400 cursor-not-allowed'
                      : 'bg-white/[0.02] border border-white/[0.06] hover:bg-sky-500/10 hover:border-sky-500/30 text-slate-300 shadow-md'
                  }`}
                >
                  <Wind className={`w-4 h-4 ${isCoolingActive ? 'animate-spin' : ''}`} />
                  <span>
                    {isCoolingActive 
                      ? 'COOLING IN PROGRESS...' 
                      : coolantLevel < 20 
                      ? 'RESERVOIR INSUFFICIENT (<20%)' 
                      : 'COOL SYSTEM NOW'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsUnderclocked(!isUnderclocked);
                    addLog(`COOLING: Underclock gate bypass set to ${!isUnderclocked ? 'ENABLED (Thermal safe)' : 'DISABLED (Maximum clock)'}.`);
                  }}
                  className={`w-full py-2.5 border rounded-xl text-xs font-mono transition-all duration-300 flex items-center justify-center gap-2 ${
                    isUnderclocked
                      ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-400 font-bold'
                      : 'bg-black/30 border-white/[0.02] hover:border-white/[0.06] text-slate-500'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isUnderclocked ? 'SPEED LIMITER ON' : 'TURN ON SPEED LIMITER'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AUTOMATED SYSTEM REPAIR SCRIPTS PANEL */}
        {activeSubTab === 'repair' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Subsystems List (col-span-7) */}
            <div className="lg:col-span-7 cyber-glass border border-white/[0.04] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                      System Component Health Checks
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    6 MODULES MONITORED
                  </span>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-relaxed mb-4">
                  Monitor system component health. If any component has errors, click "FIX" to repair it.
                </p>

                {/* Subsystems interactive list */}
                <div className="space-y-3">
                  {subsystems.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/[0.02] flex items-center justify-between transition-all hover:bg-black/60 hover:border-white/[0.06]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-display text-slate-200">{sub.name}</span>
                          <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wide">({sub.category})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 w-24 bg-white/[0.02] rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                sub.efficiency > 90 ? 'bg-emerald-400' : sub.efficiency > 60 ? 'bg-amber-400' : 'bg-red-400'
                              }`} 
                              style={{ width: `${sub.efficiency}%` }} 
                            />
                          </div>
                          <span className="text-[8.5px] font-mono text-slate-500">{sub.efficiency}% integrity</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded border uppercase ${
                          sub.status === 'OPTIMAL'
                            ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                            : sub.status === 'WARNING'
                            ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                            : sub.status === 'REPAIRING'
                            ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-400 animate-pulse'
                            : 'bg-red-950/20 border-red-500/20 text-red-400'
                        }`}>
                          {sub.status}
                        </span>

                        {sub.status !== 'OPTIMAL' && sub.status !== 'REPAIRING' && (
                          <button
                            onClick={() => handleRepairModule(idx)}
                            className="px-2 py-1 bg-white/[0.03] hover:bg-[#38bdf8]/10 hover:text-[#38bdf8] hover:border-[#38bdf8]/20 border border-white/[0.06] rounded text-[8.5px] font-mono font-bold transition-all uppercase"
                          >
                            FIX
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick global actions */}
              <div className="border-t border-white/[0.04] pt-5 mt-6 flex justify-between items-center">
                <span className="text-[9.5px] font-mono text-slate-500">
                  AVERAGE SYSTEM HEALTH: <span className="text-emerald-400 font-bold">94.2%</span>
                </span>
                <button
                  onClick={handleSelfRepair}
                  className="px-4 py-2 bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/50 text-emerald-400 rounded-xl text-xs font-mono font-bold transition-all uppercase shadow-md"
                >
                  RUN FULL SYSTEM AUTO-REPAIR
                </button>
              </div>
            </div>

            {/* Right Diagnostic Probe Controller (col-span-5) */}
            <div className="lg:col-span-5 cyber-glass border border-white/[0.04] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 font-display">
                    System Scan Settings
                  </h3>
                </div>

                {/* Scan Type selection */}
                <div className="space-y-3 mb-6">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block">SCAN DEPTH</span>
                  <div className="space-y-2">
                    {[
                      { id: 'quick', name: 'Quick Diagnostics Scan', desc: 'Inspect core processor status and local settings (Takes 2 seconds)', icon: Cpu },
                      { id: 'memory', name: 'Memory Storage Scan', desc: 'Map memory storage blocks and safety encryption keys (Takes 4 seconds)', icon: Database },
                      { id: 'deep', name: 'Deep System Scan', desc: 'A deep scan of all processor paths and error files (Takes 6 seconds)', icon: Terminal }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (isScanning) return;
                          setScanType(t.id as any);
                          addLog(`SCANNER: Configuration profile altered to [${t.id.toUpperCase()}]`);
                        }}
                        disabled={isScanning}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          scanType === t.id
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-black/20 border-white/[0.02] text-slate-400 hover:bg-black/30 hover:border-white/[0.06] hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-display text-xs font-bold">
                          <t.icon className={`w-3.5 h-3.5 ${scanType === t.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span>{t.name}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 pl-5 font-mono">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scanning Progress bar */}
                {isScanning || scanProgress > 0 ? (
                  <div className="p-4 bg-black/60 border border-white/[0.04] rounded-2xl mb-6">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                      <span>SCANNING SPEED: <span className="text-emerald-400">1024 registers/s</span></span>
                      <span className="font-bold">{scanProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-500 mt-2 block font-mono">STATUS: Scanning active. Please do not close this window.</span>
                  </div>
                ) : (
                  <div className="p-4 bg-black/40 border border-white/[0.02] rounded-2xl mb-6 text-center text-slate-500 font-mono text-[10px]">
                    Diagnostic scanner is ready. Click the button below to start.
                  </div>
                )}
              </div>

              <button
                onClick={handleRunSystemScan}
                disabled={isScanning}
                className={`w-full py-3.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  isScanning 
                    ? 'bg-slate-900/40 border border-white/[0.02] text-slate-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                }`}
              >
                {isScanning ? 'SCAN IN PROGRESS...' : `START [${scanType.toUpperCase()}] SCAN`}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Interactive Logs readout panel (At the Footer of all tabs) */}
      <div className="mt-6 cyber-glass border-white/[0.05] p-4 rounded-2xl relative z-10">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase">
            <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>SYSTEM LOGS & DIAGNOSTICS REPORT</span>
          </span>
          <span className="text-[9px] font-mono text-slate-600 uppercase">
            STATUS STABLE
          </span>
        </div>

        <div className="space-y-1.5 max-h-[110px] overflow-y-auto font-mono text-[9px] leading-relaxed text-slate-500 pr-1">
          {scanLogs.map((log, idx) => (
            <div key={`scan-${idx}`} className="flex gap-2">
              <span className="text-slate-600 select-none">[{idx.toString().padStart(2, '0')}]</span>
              <span className={log.includes('warning') || log.includes('discrepancies') || log.includes('unstable') ? 'text-amber-400/90' : log.includes('completed') || log.includes('complete') ? 'text-emerald-400' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
          {generalLogs.map((log, idx) => (
            <div key={`gen-${idx}`} className="flex gap-2">
              <span className="text-slate-600 select-none">[{idx.toString().padStart(2, '0')}]</span>
              <span className="text-indigo-400/90">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
