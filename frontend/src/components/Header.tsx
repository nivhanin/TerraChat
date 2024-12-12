import { Box, Typography, Button } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';
import ArticleIcon from '@mui/icons-material/Article';

export const Header = () => {
  return (
    <Box
      sx={{
        height: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        zIndex: 1200,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Terra Chat
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant='text' startIcon={<ArticleIcon />} sx={{ color: 'text.secondary' }}>
          Documentation
        </Button>
        <ThemeToggle />
      </Box>
    </Box>
  );
};
