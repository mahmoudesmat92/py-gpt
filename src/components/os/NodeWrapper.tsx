import { useState, useRef } from 'react';
import { GripHorizontal } from 'lucide-react';

interface NodeWrapperProps {
  id?: string;
  title: string;
  initialX: number;
  initialY: number;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export default function NodeWrapper({ title, initialX, initialY, width, height, children }: NodeWrapperProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="absolute bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: width ? `${width}px` : '400px',
        height: height ? `${height}px` : 'auto',
      }}
      onPointerDown={(e) => e.stopPropagation()} // stop clicks from panning the canvas
    >
      <div 
        className="h-8 bg-black/40 border-b border-white/5 flex items-center px-3 cursor-grab active:cursor-grabbing hover:bg-white/[0.02] transition-colors"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <GripHorizontal className="w-4 h-4 text-slate-500 mr-2" />
        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-4 flex-1 overflow-auto min-h-0">
        {children}
      </div>
    </div>
  );
}
