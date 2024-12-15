import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LLMValidationResponse, validateLLMKeys } from '../services/api';

interface LLMValidationContextType {
  llmValidation: LLMValidationResponse | null;
  isLoading: boolean;
  hasValidKey: boolean;
}

const LLMValidationContext = createContext<LLMValidationContextType | undefined>(undefined);

export const LLMValidationProvider = ({ children }: { children: ReactNode }) => {
  const [llmValidation, setLlmValidation] = useState<LLMValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkLLMKeys = async () => {
      try {
        const validation = await validateLLMKeys();
        if (mounted) {
          setLlmValidation(validation);
        }
      } catch (error) {
        console.error('Failed to validate LLM keys:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkLLMKeys();

    return () => {
      mounted = false;
    };
  }, []);

  const hasValidKey = Boolean(
    llmValidation &&
      llmValidation.LANGCHAIN_API_KEY &&
      llmValidation.HF_TOKEN &&
      llmValidation.MISTRAL_API_KEY
  );

  return (
    <LLMValidationContext.Provider value={{ llmValidation, isLoading, hasValidKey }}>
      {children}
    </LLMValidationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLLMValidation = () => {
  const context = useContext(LLMValidationContext);
  if (context === undefined) {
    throw new Error('useLLMValidation must be used within a LLMValidationProvider');
  }
  return context;
};
