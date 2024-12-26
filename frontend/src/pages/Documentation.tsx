import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Paper,
  Tooltip,
} from '@mui/material';
import TerraSvg from '../../images/TerraSvg';
import { useTheme } from '../contexts/ThemeContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { REQUIRED_MODELS, OPTIONAL_MODELS } from '../components/ModelStatusIcons';

const MODEL_LINKS = {
  MISTRAL_API_KEY: 'https://console.mistral.ai/api-keys/',
  LANGCHAIN_API_KEY: 'https://smith.langchain.com/',
  HF_TOKEN: 'https://huggingface.co/settings/tokens',
  GOOGLE_API_KEY: 'https://aistudio.google.com/apikey',
  COHERE_API_KEY: 'https://dashboard.cohere.com/api-keys',
  XAI_API_KEY: 'https://console.x.ai',
  OPENAI_API_KEY: 'https://platform.openai.com/settings',
};

export const Documentation = () => {
  const { isDarkMode } = useTheme();

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // Optionally add a toast notification here
  };

  const ModelTable = ({
    models,
    title,
  }: {
    models: typeof REQUIRED_MODELS;
    title: string;
    required: boolean;
  }) => (
    <Box>
      <Typography variant='h5' sx={{ textAlign: 'left', fontWeight: 600, mb: 3 }}>
        {title}
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>Environment Variable</TableCell>
              <TableCell>API Key Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map(({ name, key, image }) => (
              <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={image[isDarkMode ? 'dark' : 'light']}
                      variant='square'
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography sx={{ fontWeight: 500 }}>{name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      component='code'
                      sx={{
                        fontFamily: 'monospace',
                        p: 0.5,
                        borderRadius: 1,
                        color: !isDarkMode ? 'text.primary' : 'primary.main',
                      }}
                    >
                      {key}
                    </Typography>
                    <Tooltip title='Copy environment variable'>
                      <IconButton
                        size='small'
                        onClick={() => handleCopyKey(key)}
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        <ContentCopyIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Link
                    href={MODEL_LINKS[key as keyof typeof MODEL_LINKS]}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{
                      textDecoration: 'none',
                      color: !isDarkMode ? 'text.primary' : 'primary.main',
                      '&:hover': { textDecoration: 'underline' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    Get {name} API Key →
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box
      sx={{
        maxWidth: '1000px',
        p: 4,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <TerraSvg additionalStyles={{ alignSelf: 'center' }} />
        <Box>
          <Typography variant='h4' sx={{ mb: 2, fontWeight: 600 }}>
            TerraChat Documentation
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Welcome to TerraChat! This guide will help you set up and configure your environment to
            get started with our AI chat interface.
          </Typography>
        </Box>
      </Box>

      <ModelTable models={REQUIRED_MODELS} title='Required API Keys' required={true} />

      <ModelTable models={OPTIONAL_MODELS} title='Optional API Keys' required={false} />

      <Box>
        <Typography variant='h5' sx={{ textAlign: 'left', fontWeight: 600, mb: 3 }}>
          Configuration Steps
        </Typography>

        <List sx={{ p: 3 }}>
          <ListItem>
            <ListItemText
              primary='1. Obtain API Keys'
              secondary='Click on the API Key links above to get your credentials from the respective platforms.'
              primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='2. Set Environment Variables'
              secondary='Create a .env file in the project root and add the environment variables using the names shown above.'
              primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='3. Grant Access to Mixtral-8x7B Model'
              secondary={
                <>
                  To use the Mixtral-8x7B model, you need to grant access on Hugging Face. Follow
                  this link to request access:
                  <Link
                    href='https://huggingface.co/mistralai/Mixtral-8x7B-v0.1'
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{
                      textDecoration: 'none',
                      color: !isDarkMode ? 'text.primary' : 'primary.main',
                      '&:hover': { textDecoration: 'underline' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    Mixtral-8x7B Model on Hugging Face →
                  </Link>
                  We use the Mixtral-8x7B model for generating embeddings, which are essential for
                  the functionality of TerraChat.
                </>
              }
              primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='4. Restart Application'
              secondary='Restart the application to apply the new environment variables.'
              primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            />
          </ListItem>
        </List>

        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: '14px',
            mt: 4,
          }}
        >
          For additional support or questions, please refer to our GitHub repository or contact
          support.
        </Typography>
      </Box>
    </Box>
  );
};
