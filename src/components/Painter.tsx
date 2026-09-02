import { useRef, useState, useEffect } from 'react';
import { Trash2, Download, Send, Eraser, Brush } from 'lucide-react';

interface PainterProps {
  onSendToChat: (base64Data: string) => void;
}

export default function Painter({ onSendToChat }: PainterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    '#ffffff', // White
    '#f87171', // Red
    '#60a5fa', // Blue
    '#34d399', // Green
    '#fbbf24', // Yellow
    '#c084fc', // Purple
    '#f472b6', // Pink
    '#050608'  // Dark canvas match
  ];

  // Set up and resize canvas dynamically using ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      // Keep existing drawings if resizing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dark premium canvas background
        ctx.fillStyle = '#050608';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw delicate blueprint lines
        ctx.strokeStyle = '#121620';
        ctx.lineWidth = 1;
        const gridSize = 25;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Re-draw temp contents
        ctx.drawImage(tempCanvas, 0, 0);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(container);
    resizeCanvas();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#050608' : color;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#121620';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mody-os-sketch-${Date.now()}.png`;
    a.click();
  };

  const exportToVisionChat = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL('image/png');
    onSendToChat(base64);
  };

  return (
    <div id="painter-container" className="h-full flex flex-col bg-[#030406]">
      {/* Control Bar */}
      <div className="p-4 border-b border-white/[0.05] bg-[#050608]/90 backdrop-blur flex flex-wrap items-center justify-between gap-4 flex-shrink-0 select-none">
        <div className="flex items-center gap-5">
          {/* Brush vs Eraser */}
          <div className="flex items-center bg-black/40 border border-white/[0.04] p-1 rounded-lg">
            <button
              id="brush-tool-btn"
              onClick={() => setIsEraser(false)}
              className={`p-1.5 rounded-md transition-all duration-300 ${!isEraser ? 'bg-white/[0.06] text-[#38bdf8]' : 'text-slate-500 hover:text-slate-300'}`}
              title="Paint Brush"
            >
              <Brush className="w-4 h-4" />
            </button>
            <button
              id="eraser-tool-btn"
              onClick={() => setIsEraser(true)}
              className={`p-1.5 rounded-md transition-all duration-300 ${isEraser ? 'bg-white/[0.06] text-[#38bdf8]' : 'text-slate-500 hover:text-slate-300'}`}
              title="Eraser Grid"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Palettes */}
          {!isEraser && (
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  id={`color-btn-${c.replace('#', '')}`}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all duration-300 ${
                    color === c ? 'border-white ring-2 ring-[#38bdf8]/40 scale-110' : 'border-white/10 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 p-0 rounded-full border border-white/25 cursor-pointer bg-transparent overflow-hidden"
                title="Custom Color Pick"
              />
            </div>
          )}

          {/* Brush Size Slider */}
          <div className="flex items-center gap-2.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Stroke Weight:</span>
            <input
              id="brush-size-slider"
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 h-1 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-[#38bdf8] focus:outline-none"
            />
            <span className="text-[10px] font-mono text-[#38bdf8] w-8">{brushSize}px</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="clear-canvas-btn"
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/[0.03] hover:bg-rose-950/20 hover:border-rose-900/40 hover:text-rose-400 text-slate-400 text-xs transition-all duration-300 font-mono"
            title="Wipe current grid sketch"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            id="download-canvas-btn"
            onClick={downloadImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/[0.03] hover:bg-white/[0.04] hover:text-slate-200 text-slate-400 text-xs transition-all duration-300 font-mono"
            title="Download Sketch as PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PNG</span>
          </button>
          <button
            id="export-vision-btn"
            onClick={exportToVisionChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] hover:bg-[#38bdf8]/20 text-xs transition-all duration-300 font-mono shadow-[0_0_15px_rgba(56,189,248,0.05)]"
            title="Send sketch to Vision Chat"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Attach to Vision</span>
          </button>
        </div>
      </div>

      {/* Canvas Drawing Board */}
      <div ref={containerRef} id="canvas-drawing-area" className="flex-1 w-full relative overflow-hidden bg-[#050608]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute inset-0 cursor-crosshair"
        />
      </div>
    </div>
  );
}
