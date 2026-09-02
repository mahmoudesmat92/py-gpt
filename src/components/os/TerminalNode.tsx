import NodeWrapper from './NodeWrapper';
import ChatWindow from '../ChatWindow';
import { Message, Mode } from '../../types';

interface TerminalNodeProps {
  initialX: number;
  initialY: number;
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

export default function TerminalNode({ 
  initialX, initialY,
  messages, mode, isLoading, 
  onSendMessage, onClearHistory,
  attachmentBase64, attachmentMimeType, attachmentName,
  onRemoveAttachment, onAddAttachment
}: TerminalNodeProps) {
  return (
    <NodeWrapper title="Terminal // Console Interface" initialX={initialX} initialY={initialY} width={600} height={600}>
      <div className="h-full w-full flex flex-col">
        <ChatWindow 
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
    </NodeWrapper>
  );
}
