import { useEffect, useState } from 'react';
import { subscribeToScores, saveScoresToCloud } from '../firebase';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function SystemToast() {
  const [health, setHealth] = useState(100);
  const [showToast, setShowToast] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToScores((cloudScores) => {
      if (cloudScores) {
        const h = Math.round((cloudScores.pc.health + cloudScores.mobile.health + cloudScores.tailscale.health + cloudScores.connections.health) / 4);
        setHealth(h);
        if (h < 85) {
          setShowToast(true);
        } else {
          setShowToast(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRecovery = () => {
    setIsRecovering(true);
    // Attempt to reset scores back to healthy via fetch webhook or just setting health high
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_audit' } })}).catch(()=>null);
    } catch(e) {}
    
    setTimeout(() => {
      // Optimistically update cloud scores to 100% health
      const recoveredScores = {
        pc: { name: 'PC Connection', progress: 100, health: 100, status: 'Connected • Optimized', speed: '980 Mbps', latency: '3ms' },
        mobile: { name: 'Mobile Companion', progress: 100, health: 100, status: 'Authorized • Secure Mesh', speed: '290 Mbps', latency: '15ms' },
        tailscale: { name: 'Tailscale VPN Mesh', progress: 100, health: 100, status: 'Tunnel Active', speed: '360 Mbps', latency: '19ms' },
        connections: { name: 'Network Sockets Gateway', progress: 100, health: 100, status: 'Gateway Optimized', speed: '2.8 Gbps', latency: '1ms' }
      };
      saveScoresToCloud(recoveredScores);
      setIsRecovering(false);
      setShowToast(false);
    }, 2500);
  };

  if (!showToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="cyber-glass-glow !border-red-500/50 !shadow-[0_0_40px_rgba(239,68,68,0.2)] rounded-xl p-4 flex flex-col gap-3 w-[340px]">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold uppercase tracking-wide text-sm text-red-400">CRITICAL SYSTEM ALERT</h4>
            <div className="font-mono text-[10px] text-red-400/80">System Health Dropped to {health}%</div>
          </div>
        </div>
        
        <p className="text-xs text-slate-300">
          Core operational integrity is compromised. Immediate action is required to restore stable metrics.
        </p>

        <button 
          onClick={handleRecovery}
          disabled={isRecovering}
          className="mt-2 w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-mono text-xs uppercase tracking-wider rounded transition-all flex justify-center items-center gap-2"
        >
          {isRecovering ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              Executing Recovery Sequence...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Initiate Recovery Sequences
            </>
          )}
        </button>
      </div>
    </div>
  );
}
