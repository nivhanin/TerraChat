export type MessageRoles = 'user' | 'assistant' | 'human' | 'ai';
export type ModelSource =
  | 'gemini'
  | 'cohere'
  | 'mistral'
  | 'xai'
  | 'openai'
  | 'o1-mini'
  | 'gpt-3.5-turbo'
  | 'gpt-4o-mini';

export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  source?: string;
  responseTime?: number;
}
