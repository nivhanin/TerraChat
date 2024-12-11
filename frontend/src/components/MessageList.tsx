import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Message } from '../types';
import { Person as PersonIcon } from '@mui/icons-material';
import { keyframes } from '@mui/material/styles';
import { useEffect, useRef } from 'react';

const MODEL_IMAGES = {
  'open-mistral-nemo': 'mistralai.png',
  'models/gemini-1.5-pro': 'gemini_pro.png',
  'models/gemini-1.5-flash': 'gemini.png',
  'models/gemini-1.5-flash-8b': 'gemini_8b.png',
  'command-r-plus-08-2024': 'cohere_plus.png',
  'command-r-08-2024': 'cohere.png',
} as const;

const getAssistantAvatar = (model?: string) => {
  if (!model) {
    return (
      <Avatar
        variant='square'
        src='/images/terra_ai.png'
        alt='AI Assistant'
        sx={{ width: 40, height: 40 }}
      />
    );
  }

  const imagePath = MODEL_IMAGES[model as keyof typeof MODEL_IMAGES];
  if (!imagePath) {
    return (
      <Avatar
        variant='square'
        src='/images/terra_ai.png'
        alt='AI Assistant'
        sx={{ width: 40, height: 40 }}
      />
    );
  }

  return (
    <Avatar
      variant='square'
      src={`/images/${imagePath}`}
      alt={`${model} AI`}
      sx={{ width: 40, height: 40 }}
    />
  );
};

const loadingAnimation = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.3);
    opacity: 0.3;
  }
`;

const LoadingDots = () => (
  <Box sx={{ display: 'flex', gap: 1, px: 1 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'text.secondary',
          animation: `${loadingAnimation} 1s infinite`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </Box>
);

const MessageList = ({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
          }}
        >
          {message.role === 'user' ? (
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <PersonIcon />
            </Avatar>
          ) : (
            getAssistantAvatar(message.source)
          )}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: '70%',
              bgcolor: (theme) =>
                message.role === 'user'
                  ? theme.palette.primary.main
                  : theme.palette.mode === 'dark'
                    ? 'grey.700'
                    : 'grey.100',
              color: message.role === 'user' ? 'white' : 'inherit',
            }}
          >
            <Typography variant='body1'>{message.content}</Typography>
          </Paper>
        </Box>
      ))}
      {isLoading && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.700' : 'grey.100'),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LoadingDots />
          </Paper>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
