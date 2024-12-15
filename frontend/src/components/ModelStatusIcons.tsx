import { Box, Tooltip, Avatar, Divider, Menu, IconButton, Typography } from '@mui/material';
import { useLLMValidation } from '../contexts/LLMValidationContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExtensionIcon from '@mui/icons-material/Extension';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const REQUIRED_MODELS = [
  {
    name: 'Mistral AI',
    key: 'MISTRAL_API_KEY',
    image: {
      light: '/images/mistralai.png',
      dark: '/images/mistralai.png',
    },
  },
  {
    name: 'LangChain',
    key: 'LANGCHAIN_API_KEY',
    image: {
      light:
        'https://cdn.prod.website-files.com/6645c0129428882861d078b8/66603a39194163a0afacec77_65d663e4f1e9fdefc56f1b95_langchain-removebg-preview.png',
      dark: 'https://cdn.prod.website-files.com/6645c0129428882861d078b8/66603a39194163a0afacec77_65d663e4f1e9fdefc56f1b95_langchain-removebg-preview.png',
    },
  },
  {
    name: 'Hugging Face',
    key: 'HF_TOKEN',
    image: {
      light: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
      dark: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    },
  },
];

const OPTIONAL_MODELS = [
  {
    name: 'Gemini',
    key: 'GOOGLE_API_KEY',
    image: {
      light: '/images/gemini.png',
      dark: '/images/gemini.png',
    },
  },
  {
    name: 'Cohere',
    key: 'COHERE_API_KEY',
    image: {
      light: '/images/cohere.png',
      dark: '/images/cohere.png',
    },
  },
  {
    name: 'Grok',
    key: 'XAI_API_KEY',
    image: {
      light: '/images/xai_black.png',
      dark: '/images/xai_light.png',
    },
  },
];

interface ModelIconProps {
  name: string;
  image: {
    light: string;
    dark: string;
  };
  isConfigured: boolean;
}

const ModelIcon = ({ name, image, isConfigured }: ModelIconProps) => {
  const theme = useTheme();
  const themeMode = theme.palette.mode;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Avatar
        src={image[themeMode]}
        variant='square'
        alt={name}
        sx={{
          width: 24,
          height: 24,
          opacity: isConfigured ? 1 : 0.5,
        }}
      />
      {isConfigured ? (
        <CheckCircleIcon
          sx={{
            position: 'absolute',
            right: -6,
            bottom: -6,
            fontSize: 14,
            color: 'success.main',
            bgcolor: 'background.paper',
            borderRadius: '50%',
          }}
        />
      ) : (
        <CancelIcon
          sx={{
            position: 'absolute',
            right: -6,
            bottom: -6,
            fontSize: 14,
            color: 'error.main',
            bgcolor: 'background.paper',
            borderRadius: '50%',
          }}
        />
      )}
    </Box>
  );
};

export const ModelStatusIcons = () => {
  const { llmValidation } = useLLMValidation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  if (!llmValidation) return null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {/* Required Models */}
      {REQUIRED_MODELS.map(({ name, key, image }) => (
        <Tooltip
          key={key}
          title={`${name}: ${llmValidation[key as keyof typeof llmValidation] ? 'Configured' : 'Not Configured'}`}
        >
          <Box>
            <ModelIcon
              name={name}
              image={image}
              isConfigured={Boolean(llmValidation[key as keyof typeof llmValidation])}
            />
          </Box>
        </Tooltip>
      ))}

      {/* Extensions Icon and Menu */}
      <Divider orientation='vertical' flexItem sx={{ mx: 1 }} />
      <Tooltip title='Additional Models'>
        <Box
          onClick={handleClick}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <ExtensionIcon sx={{ fontSize: 20 }} />
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 280,
              bgcolor: theme.palette.background.paper,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
              Additional Models
            </Typography>
            <IconButton size='small' onClick={handleClose} sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>

          {/* Models List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {OPTIONAL_MODELS.map(({ name, key, image }) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <ModelIcon
                  name={name}
                  image={image}
                  isConfigured={Boolean(llmValidation[key as keyof typeof llmValidation])}
                />
                <Box>
                  <Box sx={{ fontSize: '14px', fontWeight: 500 }}>{name}</Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};
