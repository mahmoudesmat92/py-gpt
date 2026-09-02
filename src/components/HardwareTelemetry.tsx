import { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, Thermometer, Monitor, RefreshCw, Settings2, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function HardwareTelemetry() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [thresholds, setThresholds] = useState({
    cpuLoad: 80,
    cpuTemp: 85,
    memUsed: 85,
    gpuTemp: 85
  });

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/hardware-sync');
      
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error("Invalid JSON response: " + rawText.slice(0, 50));
      }
  
      setTelemetry(data);
      setHistory(prev => {
        const newHist = [...prev, {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpuLoad: data.load?.currentLoad || 0,
          cpuTemp: data.cpuTemp?.main || 0,
          memUsed: data.mem ? (data.mem.used / data.mem.total) * 100 : 0
        }];
        if (newHist.length > 20) newHist.shift();
        return newHist;
      });
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!telemetry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-emerald-400 font-mono text-[10px] py-12">
        <RefreshCw className="w-6 h-6 animate-spin mb-3" />
        <span>ESTABLISHING HARDWARE BRIDGE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200">REAL-TIME HARDWARE TELEMETRY</h2>
            <p className="text-[10px] text-slate-500 font-mono">WebSockets Bridge Connected via systeminformation</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg border transition-all ${showSettings ? 'bg-[#38bdf8]/10 border-[#38bdf8]/30 text-[#38bdf8]' : 'bg-black/40 border-white/[0.04] text-slate-400 hover:text-slate-200'}`}
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
      
      {showSettings && (
        <div className="bg-black/60 border border-white/[0.04] rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="text-[10px] font-mono text-slate-400 mb-4 uppercase flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Alert Thresholds Configuration
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-500 font-mono uppercase block">CPU Load (%)</label>
              <input 
                type="number" 
                value={thresholds.cpuLoad}
                onChange={(e) => setThresholds(prev => ({ ...prev, cpuLoad: Number(e.target.value) }))}
                className="w-full bg-black/40 border border-white/[0.1] rounded p-1.5 text-xs text-slate-300 font-mono outline-none focus:border-[#38bdf8]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-500 font-mono uppercase block">CPU Temp (°C)</label>
              <input 
                type="number" 
                value={thresholds.cpuTemp}
                onChange={(e) => setThresholds(prev => ({ ...prev, cpuTemp: Number(e.target.value) }))}
                className="w-full bg-black/40 border border-white/[0.1] rounded p-1.5 text-xs text-slate-300 font-mono outline-none focus:border-[#38bdf8]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-500 font-mono uppercase block">Memory Used (%)</label>
              <input 
                type="number" 
                value={thresholds.memUsed}
                onChange={(e) => setThresholds(prev => ({ ...prev, memUsed: Number(e.target.value) }))}
                className="w-full bg-black/40 border border-white/[0.1] rounded p-1.5 text-xs text-slate-300 font-mono outline-none focus:border-[#38bdf8]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-500 font-mono uppercase block">GPU Temp (°C)</label>
              <input 
                type="number" 
                value={thresholds.gpuTemp}
                onChange={(e) => setThresholds(prev => ({ ...prev, gpuTemp: Number(e.target.value) }))}
                className="w-full bg-black/40 border border-white/[0.1] rounded p-1.5 text-xs text-slate-300 font-mono outline-none focus:border-[#38bdf8]/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl space-y-2 transition-all ${(telemetry.load?.currentLoad || 0) > thresholds.cpuLoad ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-black/40 border-white/[0.04]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className={`w-4 h-4 ${(telemetry.load?.currentLoad || 0) > thresholds.cpuLoad ? 'text-red-400' : 'text-emerald-400'}`} />
              <span className="text-[10px] font-mono uppercase">CPU Load</span>
            </div>
            {(telemetry.load?.currentLoad || 0) > thresholds.cpuLoad && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <div className={`text-xl font-bold font-mono ${(telemetry.load?.currentLoad || 0) > thresholds.cpuLoad ? 'text-red-400' : 'text-slate-200'}`}>
            {telemetry.load?.currentLoad?.toFixed(1) || 0}%
          </div>
          <div className="text-[9px] text-slate-500 font-mono truncate">
            {telemetry.cpu?.brand || 'Unknown CPU'}
          </div>
        </div>

        <div className={`p-4 rounded-xl space-y-2 transition-all ${(telemetry.cpuTemp?.main || 0) > thresholds.cpuTemp ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-black/40 border-white/[0.04]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Thermometer className={`w-4 h-4 ${(telemetry.cpuTemp?.main || 0) > thresholds.cpuTemp ? 'text-red-400' : 'text-orange-400'}`} />
              <span className="text-[10px] font-mono uppercase">CPU Temp</span>
            </div>
            {(telemetry.cpuTemp?.main || 0) > thresholds.cpuTemp && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <div className={`text-xl font-bold font-mono ${(telemetry.cpuTemp?.main || 0) > thresholds.cpuTemp ? 'text-red-400' : 'text-slate-200'}`}>
            {telemetry.cpuTemp?.main || 0}°C
          </div>
          <div className="text-[9px] text-slate-500 font-mono">
            Max: {telemetry.cpuTemp?.max || 0}°C
          </div>
        </div>

        <div className={`p-4 rounded-xl space-y-2 transition-all ${(telemetry.mem ? (telemetry.mem.used / telemetry.mem.total) * 100 : 0) > thresholds.memUsed ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-black/40 border-white/[0.04]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <HardDrive className={`w-4 h-4 ${(telemetry.mem ? (telemetry.mem.used / telemetry.mem.total) * 100 : 0) > thresholds.memUsed ? 'text-red-400' : 'text-[#38bdf8]'}`} />
              <span className="text-[10px] font-mono uppercase">Memory</span>
            </div>
            {(telemetry.mem ? (telemetry.mem.used / telemetry.mem.total) * 100 : 0) > thresholds.memUsed && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <div className={`text-xl font-bold font-mono ${(telemetry.mem ? (telemetry.mem.used / telemetry.mem.total) * 100 : 0) > thresholds.memUsed ? 'text-red-400' : 'text-slate-200'}`}>
            {telemetry.mem ? ((telemetry.mem.used / telemetry.mem.total) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[9px] text-slate-500 font-mono">
            {telemetry.mem ? (telemetry.mem.used / 1024 / 1024 / 1024).toFixed(1) : 0} GB / {telemetry.mem ? (telemetry.mem.total / 1024 / 1024 / 1024).toFixed(1) : 0} GB
          </div>
        </div>

        <div className={`p-4 rounded-xl space-y-2 transition-all ${(telemetry.graphics?.controllers?.[0]?.temperatureGpu || telemetry.cpuTemp?.main || 0) > thresholds.gpuTemp ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-black/40 border-white/[0.04]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Monitor className={`w-4 h-4 ${(telemetry.graphics?.controllers?.[0]?.temperatureGpu || telemetry.cpuTemp?.main || 0) > thresholds.gpuTemp ? 'text-red-400' : 'text-purple-400'}`} />
              <span className="text-[10px] font-mono uppercase">GPU Temp & VRAM</span>
            </div>
            {(telemetry.graphics?.controllers?.[0]?.temperatureGpu || telemetry.cpuTemp?.main || 0) > thresholds.gpuTemp && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <div className={`text-xl font-bold font-mono ${(telemetry.graphics?.controllers?.[0]?.temperatureGpu || telemetry.cpuTemp?.main || 0) > thresholds.gpuTemp ? 'text-red-400' : 'text-slate-200'}`}>
            {telemetry.graphics?.controllers?.[0]?.temperatureGpu || telemetry.cpuTemp?.main || 0}°C <span className="text-xs text-slate-500 ml-1">({telemetry.graphics?.controllers?.[0]?.vram || 0} MB)</span>
          </div>
          <div className="text-[9px] text-slate-500 font-mono truncate">
            {telemetry.graphics?.controllers?.[0]?.model || 'Unknown GPU'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-black/40 border border-white/[0.04] p-5 rounded-xl">
        <h3 className="text-[10px] font-mono text-slate-400 mb-4 uppercase">Load & Temp History</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="cpuLoad" stroke="#10b981" fillOpacity={1} fill="url(#colorLoad)" name="CPU Load (%)" />
              <Area type="monotone" dataKey="cpuTemp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" name="CPU Temp (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-[9px] font-mono text-slate-600 text-center uppercase tracking-widest mt-8">
        OS: {telemetry.osInfo?.distro} {telemetry.osInfo?.release} ({telemetry.osInfo?.platform})
      </div>
    </div>
  );
}
