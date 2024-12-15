import { Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModelAvatarProvider } from './contexts/ModelAvatarContext';
import { LLMValidationProvider, useLLMValidation } from './contexts/LLMValidationContext';
import { Chat } from './pages/Chat';
import { Header } from './components/Header';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GettingStarted } from './pages/GettingStarted';

const AppRoutes = () => {
  const { isLoading, hasValidKey } = useLLMValidation();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <Routes>
      <Route
        path='/'
        element={
          hasValidKey ? <Navigate to='/chat' replace /> : <Navigate to='/getting-started' replace />
        }
      />
      <Route
        path='/getting-started'
        element={hasValidKey ? <Navigate to='/chat' replace /> : <GettingStarted />}
      />
      <Route
        path='/chat'
        element={hasValidKey ? <Chat /> : <Navigate to='/getting-started' replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LLMValidationProvider>
          <ModelAvatarProvider>
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
                  <AppRoutes />
                </Box>
              </Box>
            </Box>
          </ModelAvatarProvider>
        </LLMValidationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
