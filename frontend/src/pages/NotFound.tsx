import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 3,
        textAlign: 'center',
      }}
    >
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant='h1' sx={{ fontSize: '6rem', fontWeight: 700, color: 'text.primary' }}>
        404
      </Typography>
      <Typography variant='h4' component='h2' color='text.primary' gutterBottom>
        Page Not Found
      </Typography>
      <Typography color='text.secondary' sx={{ maxWidth: 500 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant='contained' color='primary' onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </Box>
  );
};
