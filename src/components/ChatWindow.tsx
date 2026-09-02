import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { 
  Send, Paperclip, Volume2, 
  Copy, ExternalLink, X, HelpCircle, Sparkles, Check,
  Terminal, Cpu, Activity, Mic, MicOff, Loader2
} from 'lucide-react';
import { Message, Mode } from '../types';

interface ChatWindowProps {
  messages: Message[];
  mode: Mode;
  isLoading: boolean;
  onSendMessage: (text: string, imageBase64?: string) => void;
  onClearHistory: () => void;
  attachmentBase64: string | null;
  attachmentMimeType?: string;
  attachmentName?: string;
  onRemoveAttachment: () => void;
  onAddAttachment: (base64: string, mimeType?: string, name?: string) => void;
}

export default function ChatWindow({
  messages,
  mode,
  isLoading,
  onSendMessage,
  onClearHistory,
  attachmentBase64,
  attachmentMimeType,
  attachmentName,
  onRemoveAttachment,
  onAddAttachment
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Audio Recording & Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 3D Mouse Parallax State
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll to the bottom of the chat list
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Autofocus the input cursor when mode changes or mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, [mode]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks to release the mic
        stream.getTracks().forEach(track => track.stop());

        setIsTranscribing(true);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Data,
                mimeType: 'audio/webm'
              })
            });
            
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error("Invalid JSON response: " + rawText.slice(0, 50));
      }
  
            if (res.ok && data.text) {
              setInputText(prev => prev ? `${prev} ${data.text}` : data.text);
            } else {
              console.error("Transcription response error:", data.error);
            }
          } catch (err) {
            console.error("Error transcribing audio payload:", err);
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone device access failed:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize to range -1 to 1
    const x = mouseX / (width / 2);
    const y = mouseY / (height / 2);
    
    setCoords({ x, y });
  };

  const handleSend = () => {
    if (!inputText.trim() && !attachmentBase64) return;
    onSendMessage(inputText, attachmentBase64 || undefined);
    setInputText('');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onAddAttachment(reader.result, file.type, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const playTTS = async (text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) {
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      synth.speak(utterance);
    } catch (e) {
      console.error("TTS error:", e);
    }
  };

  return (
    <div id="chat-window-container" className="flex-1 h-full flex flex-col bg-[#030406] overflow-hidden relative">
      {/* Background radial spotlight glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/[0.02] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-sky-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Upper Status / Toolbar */}
      <div className="p-4 border-b border-white/[0.05] cyber-glass flex items-center justify-between flex-shrink-0 select-none relative z-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
            Active Core Channel: <strong className="text-[#38bdf8]">{mode}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="clear-history-btn"
            onClick={onClearHistory}
            className="px-3 py-1 rounded-md text-[10px] font-mono border border-white/[0.08] hover:border-[#ef4444]/30 hover:bg-[#ef4444]/10 text-slate-400 hover:text-[#ef4444] transition-all duration-300"
          >
            Flush Thread Memory
          </button>
        </div>
      </div>

      {/* Main Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center select-none max-w-4xl mx-auto">
            {/* Interactive 3D Perspective Card Wrapper */}
            <div 
              className="perspective-container cursor-grab active:cursor-grabbing py-6 w-full max-w-2xl flex flex-col items-center justify-center"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setCoords({ x: 0, y: 0 });
              }}
            >
              <div 
                className="w-full bg-[#08090c]/80 border border-white/[0.06] rounded-2xl p-8 relative flex flex-col items-center transition-all duration-300 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                style={{
                  transform: `perspective(1000px) rotateX(${coords.y * -15}deg) rotateY(${coords.x * 15}deg) translateZ(0px)`,
                  transformStyle: 'preserve-3d',
                  transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* 3D Parallax background mesh inside */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/[0.03] blur-[40px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/[0.03] blur-[40px] rounded-full pointer-events-none" />

                {/* Glowing Core Hub */}
                <div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] to-[#082f49] flex items-center justify-center border border-white/[0.1] shadow-[0_0_30px_rgba(56,189,248,0.15)] mb-6 transition-transform"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <Sparkles className="w-8 h-8 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                </div>

                <div className="space-y-2 text-center" style={{ transform: 'translateZ(30px)' }}>
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase font-display">
                    Mody OS Matrix Channel
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
                    A highly optimized visual interface to direct context streams through Gemini's raw thinking models. Paint frames, load system presets, or toggle real-time grounding search.
                  </p>
                </div>

                {/* Floating 3D Node Clusters */}
                <div 
                  className="grid grid-cols-2 gap-4 w-full mt-8 text-left"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] hover:border-[#38bdf8]/25 hover:bg-black/60 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-[#38bdf8]" />
                      <div className="text-[11px] font-display font-bold text-white uppercase tracking-wider">Multi-Modal canvas</div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans group-hover:text-slate-400 transition-colors">
                      Sketch and overlay images in the paint canvas and instantly stream them directly to the vision mode models.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] hover:border-indigo-500/25 hover:bg-black/60 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <div className="text-[11px] font-display font-bold text-white uppercase tracking-wider">Grounding Matrix</div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans group-hover:text-slate-400 transition-colors">
                      Engage search integration to feed dynamic research data back into responses, showing explicit citation citations.
                    </p>
                  </div>
                </div>

                {/* Subtle perspective footnote */}
                <div 
                  className="mt-6 flex items-center gap-1.5 text-[8px] font-mono text-slate-600 uppercase tracking-widest"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <Activity className="w-3 h-3 text-[#38bdf8] animate-pulse" />
                  <span>3D Spatial Grid Active • Hover to pivot perspective</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            return (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                key={msg.id}
                id={`message-bubble-${msg.id}`}
                className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'items-start'}`}
              >
                {/* Sender Identity */}
                <span className="text-[9px] font-mono text-slate-500 mb-1.5 tracking-wider uppercase">
                  {isUser ? 'LOCAL CLIENT SOURCE' : isSystem ? 'CORE SYSTEM RECONCILER' : 'GEMINI MODEL RESPONSE'} • {msg.timestamp}
                </span>

                {/* Message Box */}
                <div
                  className={`p-4.5 rounded-2xl border leading-relaxed text-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)] ${
                    isUser
                      ? 'bg-gradient-to-br from-[#12141c] to-[#0c0d12] border-white/[0.08] text-slate-100 rounded-tr-none'
                      : isSystem
                      ? 'bg-rose-950/10 border-rose-900/30 text-rose-300 rounded-tl-none font-mono text-xs'
                      : 'bg-gradient-to-br from-[#08090c] to-[#030406] border-white/[0.05] text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Parts */}
                  {msg.parts.map((part, pIdx) => {
                    if (part.type === 'image' && part.imageUrl) {
                      return (
                        <div key={pIdx} className="mb-3 max-w-sm rounded-lg overflow-hidden border border-white/[0.08]">
                          <img src={part.imageUrl} alt="Attached input" className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
                        </div>
                      );
                    }
                    if (part.type === 'video' && part.videoUrl) {
                      return (
                        <div key={pIdx} className="mb-3 max-w-sm rounded-lg overflow-hidden border border-white/[0.08] bg-black">
                          <video src={part.videoUrl} controls className="w-full h-auto max-h-64 object-contain" />
                        </div>
                      );
                    }

                    const rawText = part.text || "";

                    return (
                      <div key={pIdx} className="markdown-body" dir="auto">
                        <Markdown>{rawText}</Markdown>
                      </div>
                    );
                  })}

                  {/* Grounding URLs */}
                  {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-1.5 select-none">
                      <span className="text-[9px] font-mono text-emerald-400 block uppercase tracking-widest">
                        Grounding Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.groundingUrls.map((g, idx) => (
                          <a
                            key={idx}
                            href={g.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[9px] bg-emerald-950/10 border border-emerald-900/30 hover:border-emerald-500 text-emerald-400 px-2 py-1 rounded-md transition-all duration-300 font-mono"
                          >
                            <span>{g.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                {!isSystem && (
                  <div className="flex items-center gap-3 mt-2 px-1 opacity-40 hover:opacity-100 transition-opacity duration-300 select-none">
                    <button
                      onClick={() => handleCopyText(msg.parts.find(p => p.type === 'text')?.text || "", msg.id)}
                      className="p-1 hover:text-[#38bdf8] text-slate-500 transition-colors flex items-center gap-1 text-[10px] font-mono"
                      title="Copy message payload"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Payload Saved</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {!isUser && (
                      <button
                        onClick={() => playTTS(msg.parts.find(p => p.type === 'text')?.text || "")}
                        className="p-1 hover:text-[#38bdf8] text-slate-500 transition-colors flex items-center gap-1 text-[10px] font-mono"
                        title="Vocalize message block"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Vocalize</span>
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start max-w-[80%] animate-pulse">
            <span className="text-[9px] font-mono text-slate-500 mb-1 tracking-wider uppercase">
              MODEL ENGINE • PIPING CHUNKS
            </span>
            <div className="p-4 bg-gradient-to-br from-[#08090c] to-[#030406] border border-white/[0.05] text-slate-300 rounded-2xl rounded-tl-none text-xs font-mono flex items-center gap-3 shadow-lg">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>Piping neural context blocks...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Console Bar */}
      <div className="p-5 border-t border-white/[0.05] cyber-glass flex-shrink-0 relative z-10">
        {/* Attachment Previews */}
        {attachmentBase64 && (
          <div className="mb-4 p-2.5 bg-[#08090c] border border-white/[0.06] rounded-xl flex items-center justify-between select-none shadow-md animate-[slideUp_0.2s_ease-out]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg border border-white/[0.1] overflow-hidden bg-black flex-shrink-0 flex items-center justify-center">
                {attachmentMimeType?.startsWith('video/') ? (
                  <video src={attachmentBase64} className="w-full h-full object-cover animate-pulse" muted playsInline />
                ) : (
                  <img src={attachmentBase64} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono text-sky-400 block uppercase tracking-wider font-bold">
                  {attachmentMimeType?.startsWith('video/') ? 'Multi-modal Video Frame Loaded' : 'Multi-modal Image Frame Loaded'}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {attachmentName || (attachmentMimeType?.startsWith('video/') ? 'Matrix video is ready for vision model pipe' : 'Matrix image is ready for vision model pipe')}
                </span>
              </div>
            </div>
            <button
              id="remove-attachment-btn"
              onClick={onRemoveAttachment}
              className="p-1.5 rounded-md bg-white/[0.02] border border-white/[0.05] hover:border-[#ef4444]/30 hover:text-[#ef4444] text-slate-400 transition-all duration-300"
              title="Remove attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex items-end gap-3 bg-[#050608]/90 border border-white/[0.06] focus-within:border-[#38bdf8]/40 p-3 rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          {/* Actions Column */}
          <div className="flex items-center gap-1 select-none flex-shrink-0">
            <button
              id="trigger-file-upload"
              onClick={triggerFileInput}
              className="p-2.5 rounded-lg bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.03] hover:border-white/[0.1]"
              title="Attach frame (Image or MP4/WebM video)"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              id="voice-transcribe-btn"
              onClick={toggleRecording}
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                isRecording 
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse'
                  : isTranscribing
                  ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                  : 'bg-white/[0.02] border-white/[0.03] text-slate-400 hover:text-[#38bdf8] hover:border-[#38bdf8]/35 hover:bg-white/[0.04]'
              }`}
              title={isRecording ? "Stop recording and transcribe" : "Record audio prompt"}
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
          </div>

          {/* Text Area Input */}
          <textarea
            ref={textareaRef}
            id="chat-input-textarea"
            dir="auto"
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              mode === 'vision' 
                ? 'Address instructions and query properties of the attached image...' 
                : mode === 'image'
                ? 'Type detailed prompt tokens to render a visual element...'
                : 'Send a prompt frame to the core engine...'
            }
            className="flex-1 bg-transparent border-0 text-sm text-slate-200 placeholder-slate-600 focus:ring-0 focus:outline-none resize-none leading-relaxed py-1.5 max-h-32 min-h-[24px]"
            style={{ height: 'auto' }}
          />

          {/* Submit */}
          <button
            id="send-message-btn"
            onClick={handleSend}
            disabled={(!inputText.trim() && !attachmentBase64) || isLoading}
            className="p-2.5 rounded-lg bg-white/[0.02] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/[0.02] disabled:hover:text-[#38bdf8] disabled:hover:shadow-none flex-shrink-0 flex items-center justify-center border border-white/[0.05] hover:border-[#38bdf8]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footnote tips */}
        <div className="flex items-center justify-between text-[9px] text-slate-600 font-mono mt-3 select-none tracking-wide">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Shift + Enter for multiline blocks</span>
          </span>
          <span>SYSTEM CHANNELS OK • SECURITY PROTOCOLS ENFORCED</span>
        </div>
      </div>
    </div>
  );
}
