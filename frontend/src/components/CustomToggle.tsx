import { styled } from '@mui/material/styles';

const ToggleContainer = styled('div')<{ checked: boolean }>(
  ({
    theme: {
      palette: {
        mode: themeMode,
        primary: { main: primaryColor },
      },
    },
    checked,
  }) => ({
    width: '40px',
    height: '24px',
    backgroundColor: checked ? primaryColor : themeMode === 'dark' ? '#656359' : '#D4D2CA',
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  })
);

const ToggleCircle = styled('div')<{ checked: boolean }>(
  ({
    theme: {
      palette: {
        common: { white: whiteColor },
      },
    },
    checked,
  }) => ({
    width: '18px',
    height: '18px',
    backgroundColor: whiteColor,
    borderRadius: '50%',
    position: 'absolute',
    top: '3px',
    left: checked ? '19px' : '3px',
    transition: 'left 0.2s',
  })
);

interface CustomToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export const CustomToggle = ({ checked, onChange, label }: CustomToggleProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ToggleContainer checked={checked} onClick={onChange}>
        <ToggleCircle checked={checked} />
      </ToggleContainer>
      {label && <span style={{ fontSize: '14px', userSelect: 'none' }}>{label}</span>}
    </div>
  );
};
