import { useState, useRef } from 'react';
import DataIndexerNode from './DataIndexerNode';
import FeatureMatrixNode from './FeatureMatrixNode';
import SwarmOpsNode from './SwarmOpsNode';
import TerminalNode from './TerminalNode';
import { ZoomIn, ZoomOut, Target } from 'lucide-react';
import { Message, Mode } from '../../types';

interface SpatialCanvasProps {
  messages: Message[];
  mode: Mode;
  isLoading: boolean;
  onSendMessage: (msg: string) => void;
  onClearHistory: () => void;
  attachmentBase64: string | null;
  attachmentMimeType: string;
  attachmentName: string;
  onRemoveAttachment: () => void;
  onAddAttachment: (b64: string, mime?: string, name?: string) => void;
}

export default function SpatialCanvas({
  messages, mode, isLoading, onSendMessage, onClearHistory,
  attachmentBase64, attachmentMimeType, attachmentName,
  onRemoveAttachment, onAddAttachment
}: SpatialCanvasProps) {

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAdjust = e.deltaY * -0.001;
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(0.1, prev.scale + scaleAdjust), 2)
    }));
  };

  return (
    <div 
      className="flex-1 h-full w-full relative overflow-hidden bg-[#030406] select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: `${100 * transform.scale}px ${100 * transform.scale}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
          `,
          backgroundPosition: `${transform.x}px ${transform.y}px`,
          backgroundColor: '#030406'
        }}
      />
      
      {/* Nodes Container */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        <DataIndexerNode initialX={200} initialY={100} />
        <FeatureMatrixNode initialX={800} initialY={100} />
        <SwarmOpsNode initialX={200} initialY={450} />
        <TerminalNode 
          initialX={800} initialY={350} 
          messages={messages}
          mode={mode}
          isLoading={isLoading}
          onSendMessage={onSendMessage}
          onClearHistory={onClearHistory}
          attachmentBase64={attachmentBase64}
          attachmentMimeType={attachmentMimeType}
          attachmentName={attachmentName}
          onRemoveAttachment={onRemoveAttachment}
          onAddAttachment={onAddAttachment}
        />
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-2xl">
        <button 
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }))}
          className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          className="p-2 hover:bg-white/10 rounded-full text-[#38bdf8] hover:text-[#7dd3fc] transition-colors"
        >
          <Target className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.1) }))}
          className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
