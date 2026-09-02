export type Mode = 'chat' | 'completion' | 'image' | 'vision' | 'agent';

export interface Model {
  id: string;
  name: string;
  description: string;
  paid?: boolean;
}

export interface Preset {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
  icon: string;
}

export interface MessagePart {
  type: 'text' | 'image' | 'video';
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
  timestamp: string;
  groundingUrls?: Array<{ title: string; url: string }>;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  mode: Mode;
  modelId: string;
  presetId: string;
  systemPrompt: string;
  notepadContent: string;
  temperature: number;
  thinkingLevel: 'HIGH' | 'LOW' | 'MINIMAL';
  useSearch: boolean;
  createdAt: string;
}

export const SUPPORTED_MODELS: Model[] = [
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', description: 'Recommended for fast, smart general tasks. Free tier.' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Preview)', description: 'Best for complex reasoning, math, and code tasks.', paid: true },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', description: 'Optimal for tasks that should happen fast. Free tier.' },
  { id: 'gemini-3.1-flash-lite-image', name: 'Gemini 3.1 Image Gen', description: 'Image generation model.', paid: true }
];

export const PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'General Assistant',
    systemPrompt: 'You are a helpful, precise, and friendly AI assistant. Give comprehensive and accurate responses.',
    description: 'Standard helpful assistant preset.',
    icon: 'MessageSquare'
  },
  {
    id: 'coder',
    name: 'Expert Coder',
    systemPrompt: 'You are an elite senior software engineer. Write concise, optimal, clean, and production-ready code with minimal conversational fluff. Focus on robust implementations.',
    description: 'Optimal for writing code and debugging.',
    icon: 'Code'
  },
  {
    id: 'joke',
    name: 'Joke Agent',
    systemPrompt: 'You are a stand-up comedian. Answer all queries with a touch of humor, witty jokes, or lighthearted sarcasm while remaining informative.',
    description: 'Humorous, playful responder.',
    icon: 'Laugh'
  },
  {
    id: 'batman',
    name: 'Batman',
    systemPrompt: 'You are Batman, the Dark Knight of Gotham. Respond in character—gruff, serious, and deeply dedicated to justice. Gotham is your home.',
    description: ' Gotham\'s legendary protector persona.',
    icon: 'ShieldAlert'
  },
  {
    id: 'researcher',
    name: 'Academic Researcher',
    systemPrompt: 'You are a distinguished research scientist. Answer queries with rigorous, citation-backed analytical prose, exploring hypotheses, methodology, and theoretical frameworks.',
    description: 'Rigorous and deep analytical persona.',
    icon: 'GraduationCap'
  }
];
