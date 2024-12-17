import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorDisplayProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorDisplay({ title, message, actionText, onAction }: ErrorDisplayProps) {
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
        {title}
      </Typography>
      <Typography color='text.secondary' sx={{ maxWidth: 500 }}>
        {message}
      </Typography>
      {actionText && onAction && (
        <Button variant='contained' color='primary' onClick={onAction} sx={{ mt: 2 }}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}
