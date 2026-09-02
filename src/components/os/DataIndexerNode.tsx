import NodeWrapper from './NodeWrapper';
import { Database, Filter, ArrowRight } from 'lucide-react';

export default function DataIndexerNode({ initialX, initialY }: { initialX: number; initialY: number }) {
  const arbitrageData = [
    {
      id: "ARB-0912",
      sector: "Real Estate",
      asset: "Distressed Commercial Unit",
      action: "Acquire & Subdivide",
      roi: "+34.5%",
      status: "Verified",
    },
    {
      id: "ARB-0913",
      sector: "Supply Chain",
      asset: "Unoptimized Freight Routes",
      action: "Reroute via 3PL Node",
      roi: "+12.2%",
      status: "Executable",
    },
    {
      id: "ARB-0914",
      sector: "Real Estate",
      asset: "Zoning Reclassification",
      action: "Permit Arbitrage",
      roi: "+89.0%",
      status: "Pending",
    }
  ];

  return (
    <NodeWrapper title="Supply Chain Data Dropzone" initialX={initialX} initialY={initialY} width={550}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-display text-slate-200">Raw Ingestion Stream</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-400">
            <Filter className="w-3 h-3" />
            <span>PASSIVE INCOME FILTER: STRICT</span>
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-white/[0.02] border-b border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Asset Ref</span>
            <span className="col-span-2">Action Protocol</span>
            <span className="text-right">Est ROI</span>
          </div>
          <div className="divide-y divide-white/5 max-h-[200px] overflow-y-auto">
            {arbitrageData.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 px-3 py-2.5 hover:bg-white/[0.02] transition-colors items-center group">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-[#38bdf8]">{item.id}</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">{item.sector}</span>
                </div>
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-xs text-slate-300 font-medium truncate">{item.asset}</span>
                  <span className="text-[9px] text-slate-500 flex items-center gap-1">
                    <ArrowRight className="w-2 h-2" />
                    {item.action}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end gap-0.5">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">{item.roi}</span>
                  <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    item.status === 'Executable' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.status === 'Verified' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
          <p className="text-[10px] font-mono text-red-400 leading-relaxed">
            [SYS_LOG]: Purged 14,209 non-actionable data points. Retained exclusively optimal arbitrage opportunities requiring zero manual maintenance.
          </p>
        </div>
      </div>
      </NodeWrapper>
  );
}
