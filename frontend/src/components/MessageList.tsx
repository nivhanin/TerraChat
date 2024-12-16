import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Message, MessageRoles } from '../types';
import { styled } from '@mui/material/styles';
import { useEffect, useRef } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ModelAvatar from './ModelAvatar';
import LoadingDots from './LoadingDots';

const MessageControls = () => (
  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
    <IconButton size='small' sx={{ color: 'text.secondary' }}>
      <VolumeUpIcon fontSize='small' />
    </IconButton>
    <IconButton size='small' sx={{ color: 'text.secondary' }}>
      <ContentCopyIcon fontSize='small' />
    </IconButton>
    <IconButton size='small' sx={{ color: 'text.secondary' }}>
      <ThumbUpIcon fontSize='small' />
    </IconButton>
    <IconButton size='small' sx={{ color: 'text.secondary' }}>
      <ThumbDownIcon fontSize='small' />
    </IconButton>
    <IconButton size='small' sx={{ color: 'text.secondary' }}>
      <AutorenewIcon fontSize='small' />
    </IconButton>
  </Box>
);

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
            <ModelAvatar source={message.source} /> // Use the source prop
          )}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'column',
            }}
          >
            <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
            {message.role === 'assistant' && (
              <Box className='message-controls'>
                <MessageControls
                // onCopy={() => navigator.clipboard.writeText(message.content)}
                />
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
