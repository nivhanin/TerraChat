import { Box, Typography, Button } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';
import StatusBanner from './StatusBanner';
import { useLocation } from 'react-router-dom';
import { useModelAvatar } from '../contexts/ModelAvatarContext';
import { CustomToggle } from './CustomToggle';
import { ModelStatusIcons } from './ModelStatusIcons';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

export const Header = () => {
  const location = useLocation();
  const { showModelAvatars, toggleModelAvatars } = useModelAvatar();

  const handleDocClick = () => {
    // TODO: Add documentation link when ready
    // window.open('/documentation', '_blank');
  };

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
          <Button
            onClick={handleDocClick}
            startIcon={<ArticleOutlinedIcon />}
            sx={{
              color: 'text.primary',
              textTransform: 'none',
            }}
          >
            Documentation
          </Button>
          <ThemeToggle />
        </Box>
      </Box>
    </Box>
  );
};
