import { createContext, useContext, useState, ReactNode } from 'react';

interface ModelAvatarContextType {
  showModelAvatars: boolean;
  toggleModelAvatars: () => void;
}

const ModelAvatarContext = createContext<ModelAvatarContextType | undefined>(undefined);

export const ModelAvatarProvider = ({ children }: { children: ReactNode }) => {
  const [showModelAvatars, setShowModelAvatars] = useState(false);

  const toggleModelAvatars = () => {
    setShowModelAvatars((prev) => !prev);
  };

  return (
    <ModelAvatarContext.Provider value={{ showModelAvatars, toggleModelAvatars }}>
      {children}
    </ModelAvatarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModelAvatar = () => {
  const context = useContext(ModelAvatarContext);
  if (context === undefined) {
    throw new Error('useModelAvatar must be used within a ModelAvatarProvider');
  }
  return context;
};
