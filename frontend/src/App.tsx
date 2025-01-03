import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModelAvatarProvider } from './contexts/ModelAvatarContext';
import { LLMValidationProvider, useLLMValidation } from './contexts/LLMValidationContext';
import { Layout } from './components/Layout';
import { Chat } from './pages/Chat';
import { NotFound } from './pages/NotFound';
import { GettingStarted } from './pages/GettingStarted';
import { Documentation } from './pages/Documentation';

function AppRoutes() {
  const { isLoading, hasValidKey } = useLLMValidation();

  if (isLoading) {
    return null;
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
      <Route path='/documentation' element={<Documentation />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LLMValidationProvider>
        <ModelAvatarProvider>
          <BrowserRouter>
            <Layout>
              <AppRoutes />
            </Layout>
          </BrowserRouter>
        </ModelAvatarProvider>
      </LLMValidationProvider>
    </ThemeProvider>
  );
}
