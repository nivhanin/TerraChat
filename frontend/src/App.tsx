import { Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { Chat } from './components/Chat';
import { Header } from './components/Header';

function App() {
  return (
    <ThemeProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Header />
        <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Box
            component='main'
            sx={{
              flex: 1,
              transition: (theme) =>
                theme.transitions.create('margin', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              height: 'calc(100vh - 64px)',
              overflow: 'hidden',
            }}
          >
            <Chat />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
