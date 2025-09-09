// =====================================================
// Responsive Theme Configuration
// Theme overrides and responsive design tokens
// =====================================================

import { Theme, createTheme } from '@mui/material/styles';
import { Breakpoints } from '@mui/material/styles';

// Custom breakpoints for mobile-first design
const customBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Responsive typography scales
const getResponsiveTypography = (breakpoints: Breakpoints) => ({
  h1: {
    fontSize: '2rem',
    [breakpoints.up('sm')]: {
      fontSize: '2.5rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '3rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '3.5rem',
    },
  },
  h2: {
    fontSize: '1.75rem',
    [breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2.25rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '2.5rem',
    },
  },
  h3: {
    fontSize: '1.5rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.75rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  },
  h4: {
    fontSize: '1.25rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
  },
  h5: {
    fontSize: '1.125rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },
  h6: {
    fontSize: '1rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.125rem',
    },
  },
  body1: {
    fontSize: '0.875rem',
    [breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
  },
  body2: {
    fontSize: '0.75rem',
    [breakpoints.up('sm')]: {
      fontSize: '0.875rem',
    },
  },
  button: {
    fontSize: '0.875rem',
    [breakpoints.up('sm')]: {
      fontSize: '0.875rem',
    },
  },
});

// Responsive spacing
const getResponsiveSpacing = (breakpoints: Breakpoints) => (factor: number) => ({
  padding: `${factor * 8}px`,
  [breakpoints.up('sm')]: {
    padding: `${factor * 12}px`,
  },
  [breakpoints.up('md')]: {
    padding: `${factor * 16}px`,
  },
});

// Mobile-optimized component overrides
const getMobileComponentOverrides = (theme: Theme) => ({
  MuiAppBar: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          minHeight: 56,
        },
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          minHeight: 56,
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          minHeight: 44, // Better touch target
          fontSize: '0.875rem',
        },
      },
      sizeSmall: {
        [theme.breakpoints.down('md')]: {
          minHeight: 36,
          fontSize: '0.75rem',
        },
      },
      sizeLarge: {
        [theme.breakpoints.down('md')]: {
          minHeight: 52,
          fontSize: '1rem',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1),
        },
      },
      sizeSmall: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(0.5),
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          '& .MuiInputBase-root': {
            fontSize: '16px', // Prevents zoom on iOS
          },
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          fontSize: '16px', // Prevents zoom on iOS
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          borderRadius: theme.spacing(1),
          margin: theme.spacing(0.5),
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(2),
          '&:last-child': {
            paddingBottom: theme.spacing(2),
          },
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        [theme.breakpoints.down('md')]: {
          margin: theme.spacing(1),
          width: `calc(100% - ${theme.spacing(2)})`,
          maxHeight: `calc(100% - ${theme.spacing(2)})`,
        },
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(2),
          fontSize: '1.25rem',
        },
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1, 2),
        },
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1, 2, 2),
          gap: theme.spacing(1),
        },
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: 'auto',
        '&.Mui-selected': {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          minHeight: 48,
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          height: 24,
          fontSize: '0.75rem',
        },
      },
      sizeSmall: {
        [theme.breakpoints.down('md')]: {
          height: 20,
          fontSize: '0.7rem',
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          minHeight: 48,
        },
      },
      scrollButtons: {
        [theme.breakpoints.down('md')]: {
          '&.Mui-disabled': {
            opacity: 0.3,
          },
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          minHeight: 48,
          fontSize: '0.875rem',
          minWidth: 'auto',
          padding: theme.spacing(1, 2),
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1),
          fontSize: '0.875rem',
        },
      },
      head: {
        [theme.breakpoints.down('md')]: {
          fontSize: '0.75rem',
          fontWeight: 600,
        },
      },
    },
  },
  MuiSnackbar: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          bottom: 80, // Above bottom navigation
        },
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down('md')]: {
          bottom: 80, // Above bottom navigation
        },
      },
    },
  },
});

// Create responsive theme
export const createResponsiveTheme = (mode: 'light' | 'dark' = 'light') => {
  const baseTheme = createTheme({
    breakpoints: customBreakpoints,
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
  });

  return createTheme({
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      ...getResponsiveTypography(baseTheme.breakpoints),
    },
    components: {
      ...baseTheme.components,
      ...getMobileComponentOverrides(baseTheme),
    },
    spacing: 8, // Base spacing unit
  });
};

// Mobile-specific theme tokens
export const mobileThemeTokens = {
  touchTarget: {
    minSize: 44, // Minimum touch target size
    comfortable: 48, // Comfortable touch target size
    large: 56, // Large touch target size
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.1)',
    modal: '0 8px 32px rgba(0, 0, 0, 0.2)',
    fab: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  zIndex: {
    mobileHeader: 1100,
    mobileNavigation: 1200,
    bottomNavigation: 1000,
    fab: 1050,
    modal: 1300,
    snackbar: 1400,
  },
};

export default createResponsiveTheme;
