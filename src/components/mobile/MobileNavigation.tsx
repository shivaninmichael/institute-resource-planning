// =====================================================
// Mobile Navigation Component
// Responsive navigation optimized for mobile devices
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Badge,
  Avatar,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AcademicIcon from '@mui/icons-material/School';
import StudentsIcon from '@mui/icons-material/People';
import StudentIcon from '@mui/icons-material/Person';
import FacultyIcon from '@mui/icons-material/Group';
import AccountBalance from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import TimetableIcon from '@mui/icons-material/Schedule';
import CalendarIcon from '@mui/icons-material/Event';
import CommunicationIcon from '@mui/icons-material/Message';
import DocumentIcon from '@mui/icons-material/Folder';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  children?: NavigationItem[];
}

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  open,
  onClose,
  user
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      id: 'academic',
      label: 'Academic',
      icon: <AcademicIcon />,
      children: [
        { id: 'students', label: 'Students', icon: <StudentsIcon />, path: '/students' },
        { id: 'faculty', label: 'Faculty', icon: <FacultyIcon />, path: '/faculty' },
        { id: 'courses', label: 'Courses', icon: <AcademicIcon />, path: '/courses' },
        { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon />, path: '/assignments', badge: 3 },
        { id: 'grades', label: 'Grades', icon: <GradeIcon />, path: '/grades' },
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <AccountBalance />,
      children: [
        { id: 'accounting', label: 'Accounting', icon: <AccountBalance />, path: '/accounting' },
        { id: 'payroll', label: 'Payroll', icon: <AccountBalance />, path: '/payroll' },
        { id: 'fees', label: 'Fees', icon: <AccountBalance />, path: '/fees' },
      ]
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon />,
      path: '/calendar'
    },
    {
      id: 'communication',
      label: 'Messages',
      icon: <CommunicationIcon />,
      path: '/communication',
      badge: 5
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <DocumentIcon />,
      path: '/documents'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings'
    }
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      // Toggle expansion for items with children
      setExpandedItems(prev => 
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else if (item.path) {
      // Navigate to path for leaf items
      navigate(item.path);
      onClose();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = item.path ? isActive(item.path) : false;

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={active}
            sx={{
              minHeight: 48,
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.contrastText,
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => 
                renderNavigationItem(child, level + 1)
              )}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            OpenEducat ERP
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ color: theme.palette.primary.contrastText }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              src={user.avatar} 
              sx={{ width: 40, height: 40 }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="600">
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>
          {navigationItems.map(item => renderNavigationItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="textSecondary" align="center" display="block">
          Version 18.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default MobileNavigation;
