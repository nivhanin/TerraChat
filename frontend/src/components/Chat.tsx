import { useState } from 'react';
import { Paper, Button, Box, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageList from './MessageList';
import { Message } from '../types';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from './Sidebar';

interface ChatProps {
  sidebarExpanded: boolean;
}

export const Chat = ({ sidebarExpanded }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: input,
      role: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: data.response,
        role: 'assistant',
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: 'Sorry, there was an error processing your message.',
        role: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Box
        sx={{
          height: 'calc(100% - 80px)',
          overflow: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'action.hover',
            borderRadius: '4px',
          },
        }}
      >
        <MessageList messages={messages} isLoading={isLoading} />
      </Box>

      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: sidebarExpanded ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          right: 0,
          p: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper'),
          borderTop: 1,
          borderColor: 'divider',
          mx: 3,
          mb: 3,
          borderRadius: 2,
          zIndex: 1100,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant='outlined'
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.23)'
                      : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
          <Button
            variant='contained'
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            sx={{
              transform: isLoading ? 'rotate(360deg)' : 'none',
              transition: 'transform 0.5s',
              alignSelf: 'flex-start',
            }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
