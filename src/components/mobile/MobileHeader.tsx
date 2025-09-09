// =====================================================
// Mobile Header Component
// Responsive header optimized for mobile devices
// =====================================================

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import AccountIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/Brightness7';

interface MobileHeaderProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notificationCount?: number;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  currentPage?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  user,
  notificationCount = 0,
  onThemeToggle,
  isDarkMode = false,
  currentPage = 'Dashboard'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    // Implement logout logic
    console.log('Logging out...');
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'error';
      case 'faculty':
      case 'teacher':
        return 'primary';
      case 'student':
        return 'success';
      case 'staff':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {/* Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h1"
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            {currentPage}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button (Mobile) */}
          {isMobile && (
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
          )}

          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={notificationCount} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>

          {/* Theme Toggle */}
          {onThemeToggle && (
            <IconButton color="inherit" onClick={onThemeToggle}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          )}

          {/* User Menu */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <Box sx={{ mr: 2, textAlign: 'right' }}>
                  <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                    {user.name}
                  </Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    color={getRoleColor(user.role)}
                    sx={{ 
                      height: 18, 
                      fontSize: '0.7rem',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              )}
              
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ p: 0.5 }}
              >
                <Avatar 
                  src={user.avatar} 
                  sx={{ 
                    width: { xs: 32, sm: 36 }, 
                    height: { xs: 32, sm: 36 } 
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            }
          }
        }}
      >
        {isMobile && user && (
          <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight="600">
              {user.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user.role}
            </Typography>
          </Box>
        )}
        
        <MenuItem onClick={handleMenuClose}>
          <AccountIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default MobileHeader;
