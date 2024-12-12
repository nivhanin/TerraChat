export type MessageRoles = 'user' | 'assistant' | 'human' | 'ai';

export type Message = {
  id: number;
  content: string;
  role: MessageRoles;
  source?: 'gemini' | 'cohere' | 'mistral' | 'claude';
};
