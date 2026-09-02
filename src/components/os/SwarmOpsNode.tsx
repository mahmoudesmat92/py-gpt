import NodeWrapper from './NodeWrapper';
import { Bot, Terminal, Activity, CheckCircle2, XOctagon } from 'lucide-react';

export default function SwarmOpsNode({ initialX, initialY }: { initialX: number; initialY: number }) {
  return (
    <NodeWrapper title="Swarm Commander // Autonomous Agents" initialX={initialX} initialY={initialY} width={550}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-display text-slate-200">Execution Protocols</h3>
          </div>
          <div className="px-2 py-1 bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded text-[9px] font-mono text-[#38bdf8] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            SWARM ACTIVE
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Agent Alpha</span>
              <span className="text-[8px] font-mono bg-blue-500/20 text-blue-300 px-1 rounded">SCRAPER</span>
            </div>
            <div className="h-1 bg-white/5 rounded overflow-hidden">
              <div className="h-full bg-[#38bdf8] w-full origin-left animate-[scale-x_2s_ease-in-out_infinite]" />
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
              <Activity className="w-3 h-3" />
              <span>Silent Operation Enforced</span>
            </div>
          </div>

          <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Agent Beta</span>
              <span className="text-[8px] font-mono bg-purple-500/20 text-purple-300 px-1 rounded">MARKETING</span>
            </div>
            <div className="h-1 bg-white/5 rounded overflow-hidden">
              <div className="h-full bg-purple-400 w-3/4" />
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Projected ROI: $4,200/mo</span>
            </div>
          </div>
        </div>

        <div className="bg-black/60 border border-white/5 rounded-lg p-3 font-mono text-[10px] space-y-2">
          <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-white/5 pb-2">
            <Terminal className="w-3 h-3" />
            <span>CRITICAL LOGS ONLY</span>
          </div>
          <div className="text-emerald-400">
            [14:02:01] SUCCESS: Arbitrage pipeline 0x4A executed. Gross margin +18%.
          </div>
          <div className="text-emerald-400">
            [15:44:22] SUCCESS: Automated outreach campaign converted 3 high-ticket leads.
          </div>
          <div className="text-red-400 flex items-start gap-1.5">
            <XOctagon className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>[16:01:05] FAILURE: Webhook target unreachable (Timeout). Self-healing protocol initiated. Re-routed to backup node.</span>
          </div>
        </div>
      </div>
      </NodeWrapper>
  );
}
