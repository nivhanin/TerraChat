import { useNavigate } from 'react-router-dom';
import { ErrorDisplay } from '../components/ErrorDisplay';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <ErrorDisplay
      title='404 - Page Not Found'
      message="The page you're looking for doesn't exist or has been moved."
      actionText='Go to Home'
      onAction={() => navigate('/')}
    />
  );
}
