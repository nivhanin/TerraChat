import { Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { Chat } from './components/Chat';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useState } from 'react';

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <ThemeProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Sidebar onStateChange={setSidebarExpanded} />
          <Box
            component='main'
            sx={{
              flex: 1,
              p: 3,
              transition: (theme) =>
                theme.transitions.create('margin', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              height: 'calc(100vh - 64px)',
              overflow: 'hidden',
            }}
          >
            <Chat sidebarExpanded={sidebarExpanded} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
