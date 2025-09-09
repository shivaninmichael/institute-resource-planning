// =====================================================
// OpenEducat ERP Frontend - Theme Configuration
// Material-UI theme with custom branding and styling
// =====================================================

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// =====================================================
// Color Palette
// =====================================================

const primaryColors = {
  main: '#1976d2', // Blue
  light: '#42a5f5',
  dark: '#1565c0',
  contrastText: '#ffffff',
};

const secondaryColors = {
  main: '#dc004e', // Pink
  light: '#ff5983',
  dark: '#9a0036',
  contrastText: '#ffffff',
};

const successColors = {
  main: '#2e7d32', // Green
  light: '#4caf50',
  dark: '#1b5e20',
  contrastText: '#ffffff',
};

const warningColors = {
  main: '#ed6c02', // Orange
  light: '#ff9800',
  dark: '#e65100',
  contrastText: '#ffffff',
};

const errorColors = {
  main: '#d32f2f', // Red
  light: '#ef5350',
  dark: '#c62828',
  contrastText: '#ffffff',
};

const infoColors = {
  main: '#0288d1', // Light Blue
  light: '#03a9f4',
  dark: '#01579b',
  contrastText: '#ffffff',
};

const greyColors = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// =====================================================
// Typography
// =====================================================

const typography = {
  fontFamily: [
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
  ].join(','),
  
  h1: {
    fontSize: '2.5rem',
    fontWeight: 300,
    lineHeight: 1.2,
    letterSpacing: '-0.00833em',
  },
  
  h2: {
    fontSize: '2rem',
    fontWeight: 300,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
  },
  
  h3: {
    fontSize: '1.75rem',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  
  h4: {
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.00735em',
  },
  
  h5: {
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
  },
  
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
  },
  
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },
  
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
  },
};

// =====================================================
// Component Defaults
// =====================================================

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      elevation2: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      },
      elevation3: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      },
    },
  },
  
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
      },
    },
  },
  
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          fontWeight: 600,
          backgroundColor: greyColors[50],
        },
      },
    },
  },
  
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${greyColors[200]}`,
        padding: '16px',
      },
    },
  },
  
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: greyColors[50],
        },
      },
    },
  },
  
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: '24px 24px 16px 24px',
        borderBottom: `1px solid ${greyColors[200]}`,
      },
    },
  },
  
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '24px',
      },
    },
  },
  
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px 24px 24px',
        borderTop: `1px solid ${greyColors[200]}`,
      },
    },
  },
  
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    },
  },
  
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      },
    },
  },
  
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '4px 8px',
        '&:hover': {
          backgroundColor: greyColors[100],
        },
      },
    },
  },
  
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '4px 8px',
        '&:hover': {
          backgroundColor: greyColors[100],
        },
        '&.Mui-selected': {
          backgroundColor: primaryColors.light + '20',
          '&:hover': {
            backgroundColor: primaryColors.light + '30',
          },
        },
      },
    },
  },
  
  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
  },
  
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: 48,
      },
    },
  },
  
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 6,
      },
    },
  },
  
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        },
      },
    },
  },
  
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 44,
        height: 24,
        padding: 0,
      },
      switchBase: {
        padding: 2,
        '&.Mui-checked': {
          transform: 'translateX(20px)',
        },
      },
      thumb: {
        width: 20,
        height: 20,
      },
      track: {
        borderRadius: 12,
        opacity: 1,
        backgroundColor: greyColors[300],
      },
    },
  },
  
  MuiCheckbox: {
    styleOverrides: {
      root: {
        '&.Mui-checked': {
          color: primaryColors.main,
        },
      },
    },
  },
  
  MuiRadio: {
    styleOverrides: {
      root: {
        '&.Mui-checked': {
          color: primaryColors.main,
        },
      },
    },
  },
  
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        marginLeft: 0,
        marginRight: 16,
      },
    },
  },
  
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: greyColors[800],
        borderRadius: 6,
        fontSize: '0.75rem',
        padding: '8px 12px',
      },
      arrow: {
        color: greyColors[800],
      },
    },
  },
  
  MuiSnackbar: {
    styleOverrides: {
      root: {
        '& .MuiSnackbarContent-root': {
          borderRadius: 8,
        },
      },
    },
  },
  
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
  
  MuiBreadcrumbs: {
    styleOverrides: {
      root: {
        '& .MuiBreadcrumbs-separator': {
          margin: '0 8px',
        },
      },
    },
  },
  
  MuiPagination: {
    styleOverrides: {
      root: {
        '& .MuiPaginationItem-root': {
          borderRadius: 8,
          margin: '0 2px',
        },
      },
    },
  },
  
  MuiRating: {
    styleOverrides: {
      root: {
        '& .MuiRating-iconFilled': {
          color: warningColors.main,
        },
        '& .MuiRating-iconHover': {
          color: warningColors.light,
        },
      },
    },
  },
  
  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  
  MuiSpeedDial: {
    styleOverrides: {
      fab: {
        backgroundColor: primaryColors.main,
        '&:hover': {
          backgroundColor: primaryColors.dark,
        },
      },
    },
  },
  
  MuiSpeedDialAction: {
    styleOverrides: {
      fab: {
        backgroundColor: greyColors[100],
        color: greyColors[700],
        '&:hover': {
          backgroundColor: greyColors[200],
        },
      },
    },
  },
};

// =====================================================
// Theme Creation Functions
// =====================================================

export const createAppTheme = (mode: PaletteMode = 'light') => {
  const isLight = mode === 'light';
  
  const baseTheme: ThemeOptions = {
    palette: {
      mode,
      primary: primaryColors,
      secondary: secondaryColors,
      success: successColors,
      warning: warningColors,
      error: errorColors,
      info: infoColors,
      grey: greyColors,
      background: {
        default: isLight ? greyColors[50] : greyColors[900],
        paper: isLight ? '#ffffff' : greyColors[800],
      },
      text: {
        primary: isLight ? greyColors[900] : greyColors[100],
        secondary: isLight ? greyColors[700] : greyColors[300],
      },
      divider: isLight ? greyColors[200] : greyColors[700],
    },
    typography: typography as any,
    components: components as any,
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
      '0 24px 48px rgba(0,0,0,0.35), 0 20px 16px rgba(0,0,0,0.20)',
      '0 29px 58px rgba(0,0,0,0.40), 0 25px 20px rgba(0,0,0,0.18)',
      '0 34px 68px rgba(0,0,0,0.45), 0 30px 24px rgba(0,0,0,0.16)',
      '0 39px 78px rgba(0,0,0,0.50), 0 35px 28px rgba(0,0,0,0.14)',
      '0 44px 88px rgba(0,0,0,0.55), 0 40px 32px rgba(0,0,0,0.12)',
      '0 49px 98px rgba(0,0,0,0.60), 0 45px 36px rgba(0,0,0,0.10)',
      '0 54px 108px rgba(0,0,0,0.65), 0 50px 40px rgba(0,0,0,0.08)',
      '0 59px 118px rgba(0,0,0,0.70), 0 55px 44px rgba(0,0,0,0.06)',
      '0 64px 128px rgba(0,0,0,0.75), 0 60px 48px rgba(0,0,0,0.04)',
      '0 69px 138px rgba(0,0,0,0.80), 0 65px 52px rgba(0,0,0,0.02)',
      '0 74px 148px rgba(0,0,0,0.85), 0 70px 56px rgba(0,0,0,0.00)',
      '0 79px 158px rgba(0,0,0,0.90), 0 75px 60px rgba(0,0,0,0.00)',
      '0 84px 168px rgba(0,0,0,0.95), 0 80px 64px rgba(0,0,0,0.00)',
      '0 89px 178px rgba(0,0,0,1.00), 0 85px 68px rgba(0,0,0,0.00)',
      '0 94px 188px rgba(0,0,0,1.00), 0 90px 72px rgba(0,0,0,0.00)',
      '0 99px 198px rgba(0,0,0,1.00), 0 95px 76px rgba(0,0,0,0.00)',
      '0 104px 208px rgba(0,0,0,1.00), 0 100px 80px rgba(0,0,0,0.00)',
      '0 109px 218px rgba(0,0,0,1.00), 0 105px 84px rgba(0,0,0,0.00)',
      '0 114px 228px rgba(0,0,0,1.00), 0 110px 88px rgba(0,0,0,0.00)',
      '0 119px 238px rgba(0,0,0,1.00), 0 115px 92px rgba(0,0,0,0.00)' as any,
      '0 124px 248px rgba(0,0,0,1.00), 0 120px 96px rgba(0,0,0,0.00)' as any,
    ] as any,
  };

  return createTheme(baseTheme);
};

// =====================================================
// Default Theme
// =====================================================

export const defaultTheme = createAppTheme('light');

// =====================================================
// Dark Theme
// =====================================================

export const darkTheme = createAppTheme('dark');

// =====================================================
// Export
// =====================================================

export default defaultTheme;
