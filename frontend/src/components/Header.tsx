import { Box, Typography, Button } from '@mui/material';
import StatusBanner from './StatusBanner';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useModelAvatar } from '../contexts/ModelAvatarContext';
import { CustomToggle } from './CustomToggle';
import { ModelStatusIcons } from './ModelStatusIcons';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import TerraSvg from '../../images/TerraSvg';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showModelAvatars, toggleModelAvatars } = useModelAvatar();

  const handleDocClick = () => {
    navigate('/documentation');
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
          <RouterLink
            to='/'
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <TerraSvg additionalStyles={{ width: '32px', height: '32px', marginRight: '12px' }} />
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600, color: 'text.primary' }}>
                TerraChat
              </Typography>
            </Box>
          </RouterLink>
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
        </Box>
      </Box>
    </Box>
  );
};
