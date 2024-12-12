// src/components/ModelAvatar.tsx
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const MODEL_IMAGES = {
  'open-mistral-nemo': 'mistralai.png',
  'models/gemini-1.5-pro': 'gemini_pro.png',
  'models/gemini-1.5-flash': 'gemini.png',
  'models/gemini-1.5-flash-8b': 'gemini_8b.png',
  'command-r-plus-08-2024': 'cohere_plus.png',
  'command-r-08-2024': 'cohere.png',
} as const;

const defaultModelImage = '/images/terra_ai.png';

const getAssistantAvatar = (model?: string) => {
  const imagePath = MODEL_IMAGES[model as keyof typeof MODEL_IMAGES];
  return imagePath ? `/images/${imagePath}` : defaultModelImage;
};

interface ModelAvatarProps {
  source?: string; // Accept source prop
}

const ModelAvatar: React.FC<ModelAvatarProps> = ({ source }) => {
  const avatarUrl = getAssistantAvatar(source);
  const modelName = source || 'Unknown Model'; // Fallback if source is not provided
  const originalModelName = source ? `(${source})` : ''; // Display original model name

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 1,
        borderRadius: 2,
      }}
    >
      <Avatar src={avatarUrl} alt={modelName} sx={{ width: 40, height: 40 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {modelName}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {originalModelName}
        </Typography>
      </Box>
    </Box>
  );
};

export default ModelAvatar;
