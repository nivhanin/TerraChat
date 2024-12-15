import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { useModelAvatar } from '../contexts/ModelAvatarContext';

const MODEL_IMAGES = {
  'open-mistral-nemo': 'mistralai.png',
  'models/gemini-1.5-pro': 'gemini_pro.png',
  'models/gemini-1.5-flash': 'gemini.png',
  'models/gemini-1.5-flash-8b': 'gemini_8b.png',
  'command-r-plus-08-2024': 'cohere_plus.png',
  'command-r-08-2024': 'cohere.png',
} as const;

const MODEL_DISPLAY_NAMES = {
  'open-mistral-nemo': 'MistralAI',
  'models/gemini-1.5-pro': 'Gemini AI Pro',
  'models/gemini-1.5-flash': 'Gemini AI Flash',
  'models/gemini-1.5-flash-8b': 'Gemini AI Flash 8B',
  'command-r-plus-08-2024': 'Cohere+',
  'command-r-08-2024': 'Cohere',
} as const;

const defaultModelImage = '/images/terra_ai.png';

const getAssistantAvatar = (model?: string) => {
  const imagePath = MODEL_IMAGES[model as keyof typeof MODEL_IMAGES];
  return imagePath ? `/images/${imagePath}` : defaultModelImage;
};

const getDisplayName = (model?: string) => {
  if (!model) return 'Terra AI';
  return MODEL_DISPLAY_NAMES[model as keyof typeof MODEL_DISPLAY_NAMES] || model;
};

interface ModelAvatarProps {
  source?: string;
}

const ModelAvatar: React.FC<ModelAvatarProps> = ({ source }) => {
  const {
    palette: { mode: themeMode },
  } = useTheme();
  const { showModelAvatars } = useModelAvatar();
  const avatarUrl = showModelAvatars ? getAssistantAvatar(source) : defaultModelImage;
  const displayName = getDisplayName(source);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '4px 0',
      }}
    >
      <Avatar
        src={avatarUrl}
        alt={displayName}
        variant='square'
        sx={{
          width: 36,
          height: 36,
        }}
      />
      {showModelAvatars && (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: '24px',
            }}
          >
            {displayName}
          </Typography>
          {source && (
            <Typography
              sx={{
                color: themeMode === 'dark' ? '#ABA99E' : '#4B483A',
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 400,
              }}
            >
              ({source})
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ModelAvatar;
