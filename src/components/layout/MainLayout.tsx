// =====================================================
// OpenEducat ERP Frontend - Main Layout
// Complete layout with navigation and content area
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryIcon from '@mui/icons-material/LibraryBooks';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import FacultyIcon from '@mui/icons-material/Group';
import StudentIcon from '@mui/icons-material/School';
import ParentIcon from '@mui/icons-material/FamilyRestroom';
import BookIcon from '@mui/icons-material/Book';
import Group from '@mui/icons-material/Group';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import NavigationDrawer from './NavigationDrawer';
import { Toaster } from 'react-hot-toast';

// =====================================================
// Component Props
// =====================================================

interface MainLayoutProps {
  children: React.ReactNode;
}

// =====================================================
// Breadcrumb Configuration
// =====================================================

const getBreadcrumbs = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', path: '/', icon: DashboardIcon },
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Map path segments to readable labels
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    let icon = DashboardIcon;

    // Customize labels and icons for specific routes
    switch (segment) {
      case 'dashboard':
        label = 'Dashboard';
        icon = DashboardIcon;
        break;
      case 'students':
        label = 'Students';
        icon = PeopleIcon;
        break;
      case 'faculty':
        label = 'Faculty';
        icon = FacultyIcon;
        break;
      case 'courses':
        label = 'Courses';
        icon = SchoolIcon;
        break;
      case 'subjects':
        label = 'Subjects';
        icon = BookIcon;
        break;
      case 'batches':
        label = 'Batches';
        icon = Group;
        break;
      case 'attendance':
        label = 'Attendance';
        icon = ScheduleIcon;
        break;
      case 'exams':
        label = 'Examinations';
        icon = AssessmentIcon;
        break;
      case 'assignments':
        label = 'Assignments';
        icon = AssignmentIcon;
        break;
      case 'library':
        label = 'Library';
        icon = LibraryIcon;
        break;
      case 'fees':
        label = 'Fees';
        icon = PaymentIcon;
        break;
      case 'reports':
        label = 'Reports';
        icon = AssessmentIcon;
        break;
      case 'admin':
        label = 'Administration';
        icon = AdminIcon;
        break;
      case 'academics':
        label = 'Academics';
        icon = SchoolIcon;
        break;
      case 'activities':
        label = 'Activities';
        icon = AssignmentIcon;
        break;
      case 'facilities':
        label = 'Facilities';
        icon = SchoolIcon;
        break;
      default:
        // Try to make it more readable
        label = segment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    breadcrumbs.push({
      label,
      path: currentPath,
      icon,
    });
  });

  return breadcrumbs;
};

// =====================================================
// Component
// =====================================================

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useSupabaseAuth();

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  // =====================================================
  // Effects
  // =====================================================

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  // =====================================================
  // Event Handlers
  // =====================================================

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleUserMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleUserMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleUserMenuClose();
  };

  // =====================================================
  // Helper Functions
  // =====================================================

  const getRoleIcon = () => {
    if (user?.is_admin) return <AdminIcon />;
    if (user?.is_faculty) return <FacultyIcon />;
    if (user?.is_student) return <StudentIcon />;
    if (user?.is_parent) return <ParentIcon />;
    return <AccountCircleIcon />;
  };

  const getRoleLabel = () => {
    if (user?.is_admin) return 'Administrator';
    if (user?.is_faculty) return 'Faculty';
    if (user?.is_student) return 'Student';
    if (user?.is_parent) return 'Parent';
    return 'User';
  };

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'User';
  };

  // =====================================================
  // Render Functions
  // =====================================================

  const renderBreadcrumbs = () => {
    const breadcrumbs = getBreadcrumbs(location.pathname);
    
    return (
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          color: 'inherit',
          '& .MuiBreadcrumbs-separator': {
            color: 'inherit',
          },
        }}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          if (isLast) {
            return (
              <Typography
                key={breadcrumb.path}
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <breadcrumb.icon fontSize="small" />
                {breadcrumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.path}
              color="inherit"
              href={breadcrumb.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(breadcrumb.path);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <breadcrumb.icon fontSize="small" />
              {breadcrumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  const renderUserMenu = () => (
    <Menu
      anchorEl={userMenuAnchor}
      open={Boolean(userMenuAnchor)}
      onClose={handleUserMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
        },
      }}
    >
      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {user?.first_name?.[0] || user?.email?.[0] || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {getDisplayName()}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Chip
          icon={getRoleIcon()}
          label={getRoleLabel()}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Menu Items */}
      <MenuItem onClick={handleProfileClick}>
        <AccountCircleIcon sx={{ mr: 2 }} />
        Profile
      </MenuItem>
      
      <MenuItem onClick={handleSettingsClick}>
        <SettingsIcon sx={{ mr: 2 }} />
        Settings
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = () => (
    <Menu
      anchorEl={notificationsAnchor}
      open={Boolean(notificationsAnchor)}
      onClose={handleNotificationsClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 300,
          maxHeight: 400,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6">Notifications</Typography>
      </Box>
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No new notifications
        </Typography>
      </Box>
    </Menu>
  );

  // =====================================================
  // Render
  // =====================================================

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant={isMobile ? 'temporary' : 'persistent'}
      />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            {/* Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Breadcrumbs */}
            <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
              {renderBreadcrumbs()}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationsOpen}
                >
                  <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              <Tooltip title="User menu">
                <IconButton
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: theme.palette.background.default,
            p: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>

      {/* User Menu */}
      {renderUserMenu()}

      {/* Notifications Menu */}
      {renderNotificationsMenu()}
    </Box>
  );
};

export default MainLayout;
