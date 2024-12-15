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
    { name: 'Mistral', key: 'MISTRAL_API_KEY' },
  ];

  if (isLoading || !llmValidation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const allKeysConfigured = Object.values(llmValidation).every((value) => value);

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        Welcome to TerraChat
      </Typography>
      <Typography variant='body1' paragraph>
        To use TerraChat, you must configure the following API keys in your environment. All of
        these keys are mandatory for the application to function:
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
                    : 'Required - Not configured'
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Typography variant='body2' sx={{ mt: 3, color: 'text.secondary' }}>
        {allKeysConfigured
          ? "All required API keys are configured. You'll be redirected to the chat interface."
          : 'You must configure all the required API keys above to access the chat interface.'}
      </Typography>
    </Box>
  );
};
