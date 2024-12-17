import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root = createRoot(document.getElementById('root')!, {
  // Handle uncaught errors (errors not caught by Error Boundaries)
  onUncaughtError: (error, errorInfo) => {
    // You can integrate with your error reporting service here (e.g., Sentry, LogRocket)
    console.error('Uncaught error:', error);
    console.error('Error info:', errorInfo);
  },
  // Handle errors caught by Error Boundaries
  onCaughtError: (error, errorInfo) => {
    // Handle errors that were caught by Error Boundaries
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  },
});

root.render(<App />);
