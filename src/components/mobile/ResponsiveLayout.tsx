// =====================================================
// Responsive Layout Component
// Adaptive layout that switches between desktop and mobile views
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Container,
  Fab,
  Zoom,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import MobileBottomNavigation from './MobileBottomNavigation';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notificationCount?: number;
  messageCount?: number;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  showFab?: boolean;
  onFabClick?: () => void;
  fabIcon?: React.ReactNode;
  fabLabel?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  currentPage = 'Dashboard',
  user,
  notificationCount = 0,
  messageCount = 0,
  onThemeToggle,
  isDarkMode = false,
  showFab = false,
  onFabClick,
  fabIcon = <AddIcon />,
  fabLabel = 'Add'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMobileNavToggle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const handleMobileNavClose = () => {
    setMobileNavOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          onMenuClick={handleMobileNavToggle}
          user={user}
          notificationCount={notificationCount}
          onThemeToggle={onThemeToggle}
          isDarkMode={isDarkMode}
          currentPage={currentPage}
        />
      )}

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <MobileNavigation
          open={mobileNavOpen}
          onClose={handleMobileNavClose}
          user={user}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          pb: isMobile ? 8 : 0, // Add padding for bottom navigation on mobile
          pt: isMobile ? 0 : 2,
        }}
      >
        {isMobile ? (
          // Mobile: Full width content
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {children}
          </Box>
        ) : (
          // Desktop: Container with max width
          <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
            {children}
          </Container>
        )}
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNavigation messageCount={messageCount} />
      )}

      {/* Floating Action Button */}
      {showFab && onFabClick && (
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label={fabLabel}
            onClick={onFabClick}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 80 : 16, // Above bottom nav on mobile
              right: 16,
              zIndex: theme.zIndex.fab,
            }}
          >
            {fabIcon}
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

export default ResponsiveLayout;
