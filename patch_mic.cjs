const fs = require('fs');

let code = fs.readFileSync('src/components/ChatWindow.tsx', 'utf-8');

const targetButton = `            <button
              onClick={toggleRecording}
              className={\`p-2.5 rounded-lg border transition-all duration-300 \${
                isRecording 
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse'
                  : isTranscribing
                  ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                  : 'bg-white/[0.02] border-white/[0.03] text-slate-400 hover:text-[#38bdf8] hover:border-[#38bdf8]/35 hover:bg-white/[0.04]'
              }\`}
              title={isRecording ? "Stop recording and transcribe" : "Record audio prompt"}
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>`;

const replacementButton = `            <button
              onClick={toggleRecording}
              className={\`flex items-center gap-2 px-3 py-2.5 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 \${
                isRecording 
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse'
                  : isTranscribing
                  ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                  : 'bg-white/[0.02] border-white/[0.03] text-slate-400 hover:text-[#38bdf8] hover:border-[#38bdf8]/35 hover:bg-white/[0.04]'
              }\`}
              title={isRecording ? "Stop recording and transcribe" : "Record audio prompt"}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Transcribing...</span>
                </>
              ) : isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Input</span>
                </>
              )}
            </button>`;

code = code.replace(targetButton, replacementButton);
fs.writeFileSync('src/components/ChatWindow.tsx', code);
console.log("Patched ChatWindow.tsx");
