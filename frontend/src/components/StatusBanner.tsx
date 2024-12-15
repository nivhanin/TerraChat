import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const StatusBanner: React.FC = () => {
  const {
    palette: {
      mode: themeMode,
      text: { primary: textColor },
    },
  } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: themeMode === 'dark' ? '#413F38' : '#E3E0D5',
        color: themeMode === 'dark' ? '#E3E0D5' : textColor,
        padding: '2px 8px',
        textAlign: 'center',
        borderRadius: '4px',
      }}
    >
      <Typography variant='body2'>Rate-limit free AI chat bot</Typography>
    </Box>
  );
};

export default StatusBanner;
