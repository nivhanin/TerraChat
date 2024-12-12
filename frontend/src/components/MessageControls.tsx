import { Box, IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface MessageControlsProps {
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export const MessageControls = ({ onCopy, onRegenerate }: MessageControlsProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        opacity: 0,
        transition: 'opacity 0.2s',
        '.MuiPaper-root:hover &': {
          opacity: 1,
        },
      }}
    >
      <Tooltip title='Read aloud'>
        <IconButton size='small' sx={{ color: 'text.secondary' }}>
          <VolumeUpIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Copy message'>
        <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={onCopy}>
          <ContentCopyIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Good response'>
        <IconButton size='small' sx={{ color: 'text.secondary' }}>
          <ThumbUpIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Poor response'>
        <IconButton size='small' sx={{ color: 'text.secondary' }}>
          <ThumbDownIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Regenerate response'>
        <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={onRegenerate}>
          <AutorenewIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
