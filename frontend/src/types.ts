export type MessageRoles = 'user' | 'assistant' | 'human' | 'ai';
export type ModelSource = 'gemini' | 'cohere' | 'mistral';

export type Message = {
  id: number;
  content: string;
  role: MessageRoles;
  source?: ModelSource;
};
