import { Box } from '@mui/material';
import { Header } from './Header';
import { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      bgcolor: 'background.default',
    }}
  >
    <Header />
    <Box component='main' sx={{ flex: 1 }}>
      {children}
    </Box>
    <ThemeToggle />
  </Box>
);
