import { useState } from 'react';
import { Button, Box, TextField, Typography, InputAdornment, styled } from '@mui/material';
import TerraSvg from '../../images/TerraSvg';
import SendActive from '../../images/SendActive'; // Adjust the import based on your file structure
import MessageList from './MessageList';
import { Message } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import SendSvg from '../../images/Send';

const CssTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'dark' ? '#292823' : '#FFF',
    '& fieldset': {
      border: `1px solid ${theme.palette.mode === 'dark' ? '#413F38' : '#D4D2CA'}`,
    },
    '&:hover fieldset': {
      //todo: discuss madina regarding this behaviour
    },
    '&.Mui-focused': {
      '& fieldset': {
        border: `2px solid ${theme.palette.mode === 'dark' ? '#413F38' : '#D4D2CA'}`,
      },
    },
  },
}));

export const Chat = () => {
  const { isDarkMode } = useTheme(); // Get the current theme
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {messages.length < 1 ? (
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              mt: 8,
              mb: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <TerraSvg />
            <Typography
              variant='h4'
              sx={{
                textAlign: 'center',
                color: 'text.primary',
                fontSize: '36px',
                fontWeight: '600',
                lineHeight: '48px',
                letterSpacing: '0.72px',
              }}
            >
              Woof, how can I help you?
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              pb: '100px',
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
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          ...(messages.length > 1 || isLoading ? { bottom: 0 } : { top: '50%' }),
          p: 4,
          zIndex: 1100,
        }}
      >
        <Box
          sx={{ maxWidth: '800px', mx: 'auto', display: 'flex', gap: 1, justifyContent: 'center' }}
        >
          <CssTextField
            fullWidth
            multiline
            maxRows={4}
            variant='outlined'
            placeholder='Chat with Terra'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              maxWidth: '600px',
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    sx={{
                      minWidth: 'auto',
                      borderRadius: '50%',
                      ...((input.trim() || !isLoading) && {
                        '&:hover': {
                          backgroundColor: 'rgba(240, 203, 12, 0.16)',
                        },
                      }),
                    }}
                  >
                    {!input.trim() || isLoading ? (
                      <SendSvg color={isDarkMode ? '#656359' : '#E3E0D5'} />
                    ) : (
                      <SendActive />
                    )}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
