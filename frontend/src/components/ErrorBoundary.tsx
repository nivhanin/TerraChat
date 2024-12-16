import { ReactNode, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);
      console.error('Uncaught error:', event.error);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (error) {
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
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
        <Typography variant='h4' component='h1' gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography color='text.secondary' sx={{ maxWidth: 500 }}>
          We're sorry for the inconvenience. Please try reloading the page or contact support if the
          problem persists.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reload Page
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
}
