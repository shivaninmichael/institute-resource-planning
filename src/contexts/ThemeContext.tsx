// =====================================================
// Theme Context
// Manages theme customization and dark mode
// =====================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  Theme,
  PaletteMode,
} from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleMode: () => {},
  primaryColor: '#1976d2',
  setPrimaryColor: () => {},
  secondaryColor: '#dc004e',
  setSecondaryColor: () => {},
  borderRadius: 4,
  setBorderRadius: () => {},
  fontSize: 14,
  setFontSize: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Load theme settings from localStorage
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('themePrimaryColor') || '#1976d2';
  });

  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem('themeSecondaryColor') || '#dc004e';
  });

  const [borderRadius, setBorderRadius] = useState(() => {
    return Number(localStorage.getItem('themeBorderRadius')) || 4;
  });

  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem('themeFontSize')) || 14;
  });

  // Save theme settings to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('themePrimaryColor', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem('themeSecondaryColor', secondaryColor);
  }, [secondaryColor]);

  useEffect(() => {
    localStorage.setItem('themeBorderRadius', borderRadius.toString());
  }, [borderRadius]);

  useEffect(() => {
    localStorage.setItem('themeFontSize', fontSize.toString());
  }, [fontSize]);

  // Create theme
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    shape: {
      borderRadius,
    },
    typography: {
      fontSize,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: `${borderRadius * 2}px`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: `${borderRadius * 2}px`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: `${borderRadius * 2}px`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: `${borderRadius}px`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: `${borderRadius * 2}px`,
          },
        },
      },
    } as const,
  });

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const value = {
    mode,
    toggleMode,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    borderRadius,
    setBorderRadius,
    fontSize,
    setFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
