import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useLLMValidation } from '../contexts/LLMValidationContext';

export const GettingStarted = () => {
  const { llmValidation, isLoading } = useLLMValidation();

  const apiKeys = [
    { name: 'LangChain', key: 'LANGCHAIN_API_KEY' },
    { name: 'Hugging Face', key: 'HF_TOKEN' },
    { name: 'Cohere', key: 'COHERE_API_KEY' },
    { name: 'Google', key: 'GOOGLE_API_KEY' },
    { name: 'Mistral', key: 'MISTRAL_API_KEY' },
  ];

  if (isLoading || !llmValidation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        Welcome to TerraChat
      </Typography>
      <Typography variant='body1' paragraph>
        To get started with TerraChat, you'll need to set up your API keys for the language models.
        Please configure the following API keys in your environment:
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <List>
          {apiKeys.map(({ name, key }) => (
            <ListItem key={key}>
              <ListItemIcon>
                <KeyIcon
                  color={llmValidation[key as keyof typeof llmValidation] ? 'success' : 'error'}
                />
              </ListItemIcon>
              <ListItemText
                primary={name}
                secondary={
                  llmValidation[key as keyof typeof llmValidation]
                    ? 'Configured successfully'
                    : 'Not configured'
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Typography variant='body2' sx={{ mt: 3, color: 'text.secondary' }}>
        Once you've configured at least one API key, you'll be automatically redirected to the chat
        interface.
      </Typography>
    </Box>
  );
};
