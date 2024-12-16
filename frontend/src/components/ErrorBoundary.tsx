import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
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
            We're sorry for the inconvenience. Please try reloading the page or contact support if
            the problem persists.
          </Typography>
          <Button variant='contained' color='primary' onClick={this.handleReload} sx={{ mt: 2 }}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
