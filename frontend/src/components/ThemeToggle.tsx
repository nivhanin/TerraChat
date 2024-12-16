import { IconButton, Box } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 1300,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: '50%',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 8px rgba(0, 0, 0, 0.5)'
            : '0 4px 8px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: 'text.secondary',
          padding: 1.5,
          '&:hover': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          },
        }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Box>
  );
};
