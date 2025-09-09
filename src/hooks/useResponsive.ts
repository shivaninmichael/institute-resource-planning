// =====================================================
// Responsive Hook
// Custom hook for responsive design utilities
// =====================================================

import { useTheme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallScreen: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation: 'portrait' | 'landscape';
}

interface ResponsiveConfig {
  mobile?: any;
  tablet?: any;
  desktop?: any;
  default?: any;
}

export const useResponsive = (): ResponsiveValues => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  const isPortrait = useMediaQuery('(orientation: portrait)');

  const screenSize = useMemo(() => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    if (isXl) return 'xl';
    return 'md';
  }, [isXs, isSm, isMd, isLg, isXl]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    screenSize,
    orientation: isPortrait ? 'portrait' : 'landscape',
  };
};

export const useResponsiveValue = <T>(config: ResponsiveConfig): T => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return useMemo(() => {
    if (isMobile && config.mobile !== undefined) {
      return config.mobile;
    }
    if (isTablet && config.tablet !== undefined) {
      return config.tablet;
    }
    if (isDesktop && config.desktop !== undefined) {
      return config.desktop;
    }
    return config.default;
  }, [isMobile, isTablet, isDesktop, config]);
};

export const useBreakpointValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}): T | undefined => {
  const { screenSize } = useResponsive();
  
  return useMemo(() => {
    // Return the value for current screen size, or fallback to smaller sizes
    if (values[screenSize]) return values[screenSize];
    
    const breakpointOrder: Array<keyof typeof values> = ['xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(screenSize);
    
    // Look for the next available value in descending order
    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const breakpoint = breakpointOrder[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }
    
    return undefined;
  }, [screenSize, values]);
};

// Hook for responsive grid columns
export const useResponsiveColumns = (config: {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}) => {
  const { screenSize } = useResponsive();
  
  return useMemo(() => {
    const defaultColumns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };
    const columns = { ...defaultColumns, ...config };
    
    return columns[screenSize] || columns.md;
  }, [screenSize, config]);
};

// Hook for responsive spacing
export const useResponsiveSpacing = (config: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}) => {
  return useResponsiveValue({
    mobile: config.mobile || 1,
    tablet: config.tablet || 2,
    desktop: config.desktop || 3,
    default: 2,
  });
};

// Hook for responsive font sizes
export const useResponsiveFontSize = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}) => {
  return useResponsiveValue({
    mobile: config.mobile || '0.875rem',
    tablet: config.tablet || '1rem',
    desktop: config.desktop || '1.125rem',
    default: '1rem',
  });
};

export default useResponsive;
