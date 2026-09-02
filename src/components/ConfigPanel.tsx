import { Settings, Sliders, Search, BrainCircuit, AlertTriangle } from 'lucide-react';
import { SUPPORTED_MODELS } from '../types';

interface ConfigPanelProps {
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  temperature: number;
  onChangeTemperature: (val: number) => void;
  thinkingLevel: 'HIGH' | 'LOW' | 'MINIMAL';
  onChangeThinkingLevel: (level: 'HIGH' | 'LOW' | 'MINIMAL') => void;
  useSearch: boolean;
  onToggleSearch: (val: boolean) => void;
  systemPrompt: string;
  onChangeSystemPrompt: (prompt: string) => void;
}

export default function ConfigPanel({
  selectedModelId,
  onSelectModel,
  temperature,
  onChangeTemperature,
  thinkingLevel,
  onChangeThinkingLevel,
  useSearch,
  onToggleSearch,
  systemPrompt,
  onChangeSystemPrompt
}: ConfigPanelProps) {
  const isGemini3 = selectedModelId.startsWith('gemini-3');

  return (
    <div id="config-panel" className="w-80 h-full bg-[#050608] border-l border-white/[0.06] flex flex-col select-none relative">
      {/* Visual background spotlight indicator */}
      <div className="absolute bottom-0 right-0 w-36 h-36 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none" />

      {/* Title */}
      <div className="p-5 border-b border-white/[0.05] flex items-center gap-2.5 flex-shrink-0 bg-black/20 z-10">
        <Settings className="w-4 h-4 text-[#38bdf8]" />
        <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-display">Engine settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Core Neural Model
          </label>
          <div className="space-y-1.5">
            {SUPPORTED_MODELS.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <button
                  key={model.id}
                  id={`model-select-${model.id}`}
                  onClick={() => onSelectModel(model.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-950/25 to-indigo-950/25 border-sky-500/20 text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.05)]'
                      : 'bg-black/20 border-white/[0.03] text-slate-400 hover:border-white/[0.08] hover:bg-black/30 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide font-display">{model.name}</span>
                    {model.paid ? (
                      <span className="text-[7px] bg-indigo-950/40 text-indigo-400 border border-indigo-800/50 px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-widest">
                        PREMIUM
                      </span>
                    ) : (
                      <span className="text-[7px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded uppercase font-mono tracking-widest">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">{model.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Entropy (Temp)</span>
            </label>
            <span className="text-[11px] font-mono font-bold text-[#38bdf8]">{temperature}</span>
          </div>
          <div className="p-3 bg-black/20 border border-white/[0.03] rounded-xl">
            <input
              id="temperature-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-[#38bdf8] focus:outline-none"
            />
            <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-2">
              <span>DETERMINISTIC (0.0)</span>
              <span>CREATIVE (2.0)</span>
            </div>
          </div>
        </div>

        {/* Search Grounding (Web Search Plugin) */}
        <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.04] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#10b981] drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]" />
              <div>
                <span className="text-xs font-semibold text-slate-200 font-display">Web Search Grounding</span>
                <p className="text-[8px] text-slate-500 font-mono tracking-tight mt-0.5">Inject Live Google Results</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="search-grounding-toggle"
                type="checkbox"
                checked={useSearch}
                onChange={(e) => onToggleSearch(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/[0.05] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10b981] shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* Thinking Level Controls */}
        <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.04] space-y-3">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-4 h-4 text-[#a855f7] drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]" />
            <div>
              <span className="text-xs font-semibold text-slate-200 font-display">Reasoning Core</span>
              <p className="text-[8px] text-slate-500 font-mono tracking-tight mt-0.5">Control thinking depth thresholds</p>
            </div>
          </div>

          {isGemini3 ? (
            <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.04]">
              {(['MINIMAL', 'LOW', 'HIGH'] as const).map((lvl) => {
                const isActive = thinkingLevel === lvl;
                return (
                  <button
                    key={lvl}
                    id={`thinking-btn-${lvl}`}
                    onClick={() => onChangeThinkingLevel(lvl)}
                    className={`py-1 rounded text-[8px] font-mono transition-all duration-300 border ${
                      isActive
                        ? 'bg-purple-950/40 border-purple-800/30 text-[#c084fc] font-bold shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                        : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-[8px] text-slate-500 font-mono bg-black/30 p-2.5 rounded-lg border border-white/[0.03] flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0" />
              <span>Thinking controls require Gemini 3 models.</span>
            </div>
          )}
        </div>

        {/* System Prompt Box */}
        <div className="space-y-2">
          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            System Instructions
          </label>
          <textarea
            id="system-prompt-textarea"
            value={systemPrompt}
            onChange={(e) => onChangeSystemPrompt(e.target.value)}
            className="w-full h-36 bg-black/20 border border-white/[0.05] focus:border-[#38bdf8]/40 rounded-xl p-3 text-xs text-slate-200 font-mono resize-none focus:outline-none leading-relaxed transition-all duration-300"
            placeholder="Custom system instructions..."
          />
        </div>
      </div>
    </div>
  );
}
