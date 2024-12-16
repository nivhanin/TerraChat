import { Box, Typography } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';
import StatusBanner from './StatusBanner';
import { useLocation } from 'react-router-dom';
import { useModelAvatar } from '../contexts/ModelAvatarContext';
import { CustomToggle } from './CustomToggle';
import { ModelStatusIcons } from './ModelStatusIcons';

export const Header = () => {
  const location = useLocation();
  const { showModelAvatars, toggleModelAvatars } = useModelAvatar();

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1200 }}>
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
            TerraChat
          </Typography>
          <StatusBanner />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <ModelStatusIcons />
          {location.pathname === '/chat' && (
            <CustomToggle
              checked={showModelAvatars}
              onChange={toggleModelAvatars}
              label='Show Sources'
            />
          )}
          <ThemeToggle />
        </Box>
      </Box>
    </Box>
  );
};
