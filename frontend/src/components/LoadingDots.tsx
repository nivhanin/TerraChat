import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';

const loadingAnimation = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.3);
    opacity: 0.3;
  }
`;

const LoadingDots = () => (
  <Box sx={{ display: 'flex', gap: 1, px: 1 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'text.secondary',
          animation: `${loadingAnimation} 1s infinite`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </Box>
);

export default LoadingDots;
