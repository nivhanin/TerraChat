import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useLLMValidation } from '../contexts/LLMValidationContext';
import TerraSvg from '../../images/TerraSvg';
import { useTheme } from '../contexts/ThemeContext';

export const GettingStarted = () => {
  const { isDarkMode } = useTheme();
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
    <Box
      sx={{
        maxWidth: '800px',
        p: 4,
        mx: 'auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <TerraSvg />
        <Box>
          <Typography variant='h4' sx={{ mb: 2, fontWeight: 600, letterSpacing: '0.72px' }}>
            Welcome to TerraChat
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            To use TerraChat, you'll need to configure the following API keys in your environment.
            <br />
            These keys are essential for the application to work.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <List>
          {apiKeys.map(({ name, key }) => (
            <ListItem key={key}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <KeyIcon
                    sx={{
                      fontSize: 32,
                      color: llmValidation[key as keyof typeof llmValidation]
                        ? '#56A427'
                        : '#D42222',
                    }}
                  />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={name}
                secondary={
                  llmValidation[key as keyof typeof llmValidation]
                    ? 'Configured successfully'
                    : 'Required - Not configured'
                }
                primaryTypographyProps={{
                  sx: {
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '24px',
                  },
                }}
                secondaryTypographyProps={{
                  sx: {
                    fontSize: '14px',
                    fontStyle: 'normal',
                    color: isDarkMode ? '#D4D2CA' : '#4B483A',
                    fontWeight: 400,
                    lineHeight: '20px',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        <Typography
          sx={{
            color: isDarkMode ? '#BAB8AD' : '#4B483A',
            textAlign: 'center',
            fontSize: '14px',
            lineHeight: '20px',
          }}
        >
          {allKeysConfigured
            ? "All required API keys are configured. You'll be redirected to the chat interface."
            : 'All the API keys listed above are required to access the chat interface'}
        </Typography>
      </Box>
    </Box>
  );
};
