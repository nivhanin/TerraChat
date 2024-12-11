import { Box, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useState } from 'react';

export const DRAWER_WIDTH = 240;
export const MINI_DRAWER_WIDTH = 80;

interface SidebarProps {
  onStateChange?: (isOpen: boolean) => void;
}

export const Sidebar = ({ onStateChange }: SidebarProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
    onStateChange?.(!open);
  };

  return (
    <>
      <Drawer
        variant='permanent'
        sx={{
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleToggle}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          {/* Sidebar content goes here */}
          {/* You can add navigation items, filters, etc. */}
        </Box>
      </Drawer>
    </>
  );
};
