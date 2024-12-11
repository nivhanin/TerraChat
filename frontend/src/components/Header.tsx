import { Avatar, Box, Typography } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  return (
    <Box
      sx={{
        height: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        zIndex: 1200,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          variant='square'
          src='/images/terra_ai.png'
          alt='AI Assistant'
          sx={{ width: 40, height: 40 }}
        />
        <Typography variant='h6' component='h1' sx={{ fontWeight: 'bold' }}>
          TerraChat
        </Typography>
      </Box>
      <ThemeToggle />
    </Box>
  );
};
