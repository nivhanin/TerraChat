import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, Theme, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme: Theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#1A1914' : '#F5F4F0',
        paper: isDarkMode ? '#1A1914' : '#F5F4F0',
      },
      primary: {
        main: '#F0CB0C',
      },
      text: {
        primary: isDarkMode ? '#F5F4F0' : '#28261C',
        secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
      error: {
        main: '#D42222',
      },
      success: {
        main: '#56A427',
      },
      divider: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: isDarkMode ? '#292823' : '#FFF',
            borderRadius: '16px',
            border: `1px solid ${isDarkMode ? '#413F38' : '#D4D2CA'}`,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: '32px',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            alignSelf: 'stretch',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '4px',
            flex: '1 0 0',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
