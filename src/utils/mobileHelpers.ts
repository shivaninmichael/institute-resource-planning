// =====================================================
// Mobile Helper Utilities
// Utility functions for mobile optimization
// =====================================================

// Detect if device is mobile
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Detect if device supports touch
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get device orientation
export const getDeviceOrientation = (): 'portrait' | 'landscape' => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

interface ViewportDimensions {
  width: number;
  height: number;
  availableHeight: number;
}

// Get viewport dimensions
export const getViewportDimensions = (): ViewportDimensions => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    availableHeight: window.innerHeight - (window.outerHeight - window.innerHeight),
  };
};

// Check if device has safe area insets (iPhone X and newer)
export const hasSafeAreaInsets = (): boolean => {
  const css = window.getComputedStyle(document.documentElement);
  return css.getPropertyValue('--sat') !== '' || 
         css.getPropertyValue('env(safe-area-inset-top)') !== '';
};

interface SafeAreaInsets {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

// Get safe area insets
export const getSafeAreaInsets = (): SafeAreaInsets => {
  const css = window.getComputedStyle(document.documentElement);
  return {
    top: css.getPropertyValue('env(safe-area-inset-top)') || '0px',
    right: css.getPropertyValue('env(safe-area-inset-right)') || '0px',
    bottom: css.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
    left: css.getPropertyValue('env(safe-area-inset-left)') || '0px',
  };
};

// Prevent zoom on double tap (iOS Safari)
export const preventDoubleTabZoom = (element: HTMLElement) => {
  let lastTouchEnd = 0;
  
  element.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

// Handle viewport height changes (mobile browser address bar)
export const handleViewportHeightChanges = (callback?: () => void) => {
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if (callback) callback();
  };

  // Set initial value
  setViewportHeight();

  // Update on resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100); // Delay to ensure proper calculation
  });

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', setViewportHeight);
    window.removeEventListener('orientationchange', setViewportHeight);
  };
};

// Optimize scroll performance
export const optimizeScrollPerformance = (element: HTMLElement) => {
  (element.style as any).webkitOverflowScrolling = 'touch';
  (element.style as any).overflowScrolling = 'touch';
  
  // Add momentum scrolling for iOS
  if (isMobileDevice()) {
    (element.style as any).webkitOverflowScrolling = 'touch';
  }
};

// Haptic feedback (if supported)
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
  
  interface ExtendedWindow extends Window {
    DeviceMotionEvent?: {
      requestPermission?: () => Promise<string>;
    };
    webkit?: {
      messageHandlers?: {
        haptic?: {
          postMessage: (message: { type: string; style: string }) => void;
        };
      };
    };
  }

  // iOS Haptic Feedback (if available)
  const extendedWindow = window as ExtendedWindow;
  if (extendedWindow.DeviceMotionEvent?.requestPermission) {
    const impacts = {
      light: 'light',
      medium: 'medium',
      heavy: 'heavy',
    };
    
    try {
      if (extendedWindow.webkit?.messageHandlers?.haptic) {
        extendedWindow.webkit.messageHandlers.haptic.postMessage({
          type: 'impact',
          style: impacts[type],
        });
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }
};

// Format file size for mobile display
export const formatFileSizeMobile = (bytes: number): string => {
  if (bytes === 0) return '0B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${size}${sizes[i]}`;
};

// Truncate text for mobile display
export const truncateTextMobile = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

interface ResponsiveImageSizes {
  mobile: number;
  tablet: number;
  desktop: number;
}

// Generate responsive image sizes
export const getResponsiveImageSizes = (baseWidth: number): ResponsiveImageSizes => {
  return {
    mobile: Math.round(baseWidth * 0.5),
    tablet: Math.round(baseWidth * 0.75),
    desktop: baseWidth,
  };
};

// Check if element is in viewport (for lazy loading)
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
};

// Smooth scroll to element (mobile optimized)
export const smoothScrollToElement = (element: HTMLElement, offset: number = 0) => {
  const elementPosition = element.offsetTop - offset;
  
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
};

// Handle pull-to-refresh
export const handlePullToRefresh = (callback: () => void) => {
  let startY = 0;
  let currentY = 0;
  let pullDistance = 0;
  const threshold = 100;
  
  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    currentY = e.touches[0].clientY;
    pullDistance = currentY - startY;
    
    // Only allow pull when at top of page
    if (window.scrollY === 0 && pullDistance > 0) {
      e.preventDefault();
      
      // Add visual feedback here if needed
      if (pullDistance > threshold) {
        // Trigger refresh
        callback();
      }
    }
  };
  
  const handleTouchEnd = () => {
    pullDistance = 0;
  };
  
  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
};

// Optimize images for mobile
export const optimizeImageForMobile = (imageUrl: string, quality: number = 80): string => {
  // This would typically integrate with an image optimization service
  // For now, return the original URL with quality parameter if supported
  const url = new URL(imageUrl);
  url.searchParams.set('quality', quality.toString());
  
  if (isMobileDevice()) {
    url.searchParams.set('format', 'webp');
    url.searchParams.set('width', '800'); // Max width for mobile
  }
  
  return url.toString();
};

// Mobile-specific event listeners
export const addMobileEventListeners = () => {
  // Prevent zoom on input focus (iOS)
  const preventZoom = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        setTimeout(() => {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1');
        }, 500);
      }
    }
  };
  
  document.addEventListener('focusin', preventZoom);
  document.addEventListener('focusout', preventZoom);
  
  // Handle orientation change
  const handleOrientationChange = () => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);
  };
  
  window.addEventListener('orientationchange', handleOrientationChange);
  
  return () => {
    document.removeEventListener('focusin', preventZoom);
    document.removeEventListener('focusout', preventZoom);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

export default {
  isMobileDevice,
  isTouchDevice,
  getDeviceOrientation,
  getViewportDimensions,
  hasSafeAreaInsets,
  getSafeAreaInsets,
  preventDoubleTabZoom,
  handleViewportHeightChanges,
  optimizeScrollPerformance,
  triggerHapticFeedback,
  formatFileSizeMobile,
  truncateTextMobile,
  getResponsiveImageSizes,
  isElementInViewport,
  smoothScrollToElement,
  handlePullToRefresh,
  optimizeImageForMobile,
  addMobileEventListeners,
};
