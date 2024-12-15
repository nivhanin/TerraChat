import { ModelSource } from '../types';

export interface LLMValidationResponse {
  LANGCHAIN_API_KEY: boolean;
  HF_TOKEN: boolean;
  COHERE_API_KEY: boolean;
  GOOGLE_API_KEY: boolean;
  MISTRAL_API_KEY: boolean;
}

interface ChatResponse {
  response: string;
  source?: ModelSource;
}

const BASE_URL = 'http://localhost:8000';

export const validateLLMKeys = async (): Promise<LLMValidationResponse> => {
  const response = await fetch(`${BASE_URL}/llms`);
  if (!response.ok) {
    throw new Error('Failed to validate LLM keys');
  }
  return response.json();
};

export const sendChatMessage = async (question: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};
