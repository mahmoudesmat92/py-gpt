import NodeWrapper from './NodeWrapper';
import { Network, Cpu, Zap, XCircle } from 'lucide-react';

export default function FeatureMatrixNode({ initialX, initialY }: { initialX: number; initialY: number }) {
  const features = [
    {
      id: "F-01",
      name: "Autonomous Lead Generation",
      type: "Async Scraper",
      priority: "CRITICAL",
      status: "ACTIVE"
    },
    {
      id: "F-02",
      name: "Dynamic Pricing Engine",
      type: "Market Oracle",
      priority: "HIGH",
      status: "ACTIVE"
    },
    {
      id: "F-03",
      name: "Zero-Touch Fulfillment",
      type: "API Webhook",
      priority: "CRITICAL",
      status: "IDLE"
    }
  ];

  return (
    <NodeWrapper title="Feature Mapping // Async Business Loop" initialX={initialX} initialY={initialY} width={450}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-display text-slate-200">Asynchronous Operations Matrix</h3>
        </div>

        <div className="space-y-2">
          {features.map((feat) => (
            <div key={feat.id} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200">{feat.name}</div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase">{feat.type}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                  {feat.priority}
                </span>
                <span className={`text-[8px] font-mono uppercase flex items-center gap-1 ${
                  feat.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {feat.status === 'ACTIVE' && <Zap className="w-2 h-2" />}
                  {feat.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 text-slate-400">
          <XCircle className="w-4 h-4 flex-shrink-0 text-slate-500 mt-0.5" />
          <p className="text-[10px] font-mono leading-relaxed">
            Constraint Enforced: All synchronous daily maintenance features have been purged from the matrix. System operates strictly on zero-touch event triggers.
          </p>
        </div>
      </div>
      </NodeWrapper>
  );
}
