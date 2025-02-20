import { Box, Typography, Paper } from '@mui/material';
import { Message, MessageRoles } from '../types';
import { styled } from '@mui/material/styles';
import { useEffect, useRef } from 'react';
import ModelAvatar from './ModelAvatar';
import LoadingDots from './LoadingDots';
import { MessageControls } from './MessageControls';

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'messageRole',
})<{ messageRole: MessageRoles }>(({ theme, messageRole }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  gap: '16px',
  ...(messageRole === 'assistant' && { flexDirection: 'column', alignItems: 'flex-start' }),
  ...(messageRole === 'user' && {
    alignSelf: 'flex-end',
    width: 'auto',
    maxWidth: '75%',
    borderRadius: '10px',
  }),
  backgroundColor:
    messageRole === 'assistant'
      ? 'transparent'
      : theme.palette.mode === 'dark'
        ? 'rgba(65, 63, 56, 0.50)'
        : 'rgba(227, 224, 213, 0.50)',
}));

const MessageList = ({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '800px', mx: 'auto' }}>
      {messages.map((message) => (
        <StyledPaper messageRole={message.role} key={message.id} elevation={0}>
          {message.role === 'assistant' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <ModelAvatar source={message.source} />
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              gap: 2,
              flexDirection: message.role === 'user' ? 'row-reverse' : 'column',
            }}
          >
            <Typography variant='body1'>{message.content}</Typography>
            {message.role === 'assistant' && (
              <Box
                className='message-controls'
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <MessageControls />
                {message.responseTime && (
                  <Typography
                    variant='caption'
                    sx={{
                      alignSelf: 'center',
                      color: 'text.secondary',
                      fontSize: '12px',
                    }}
                  >
                    {(message.responseTime / 1000).toFixed(2)}s
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </StyledPaper>
      ))}
      {isLoading && (
        <Box sx={{ display: 'flex', gap: 3, px: 4, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <LoadingDots />
          </Box>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
