export type Message = {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  source?: 'gemini' | 'cohere' | 'mistral' | 'claude';
};
