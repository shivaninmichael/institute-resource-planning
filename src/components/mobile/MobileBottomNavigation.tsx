// =====================================================
// Mobile Bottom Navigation Component
// Bottom navigation bar for mobile devices
// =====================================================

import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AcademicIcon from '@mui/icons-material/School';
import CalendarIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import ProfileIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavigationProps {
  messageCount?: number;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  messageCount = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      label: 'Academic',
      icon: <AcademicIcon />,
      path: '/students'
    },
    {
      label: 'Calendar',
      icon: <CalendarIcon />,
      path: '/calendar'
    },
    {
      label: 'Messages',
      icon: messageCount > 0 ? (
        <Badge badgeContent={messageCount} color="error">
          <MessageIcon />
        </Badge>
      ) : (
        <MessageIcon />
      ),
      path: '/communication'
    },
    {
      label: 'Profile',
      icon: <ProfileIcon />,
      path: '/profile'
    }
  ];

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const currentItem = navigationItems.find(item => 
      currentPath.startsWith(item.path)
    );
    return currentItem ? navigationItems.indexOf(currentItem) : 0;
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const targetPath = navigationItems[newValue]?.path;
    if (targetPath) {
      navigate(targetPath);
    }
  };

  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: theme.zIndex.appBar,
        borderTop: `1px solid ${theme.palette.divider}`,
      }} 
      elevation={8}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            }
          }
        }}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                '&.Mui-selected': {
                  fontSize: '0.75rem',
                }
              }
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNavigation;
