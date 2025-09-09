// =====================================================
// OpenEducat ERP Frontend - Navigation Drawer
// Hierarchical menu system with role-based access
// =====================================================

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryIcon from '@mui/icons-material/LibraryBooks';
import PaymentIcon from '@mui/icons-material/Payment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import FacultyIcon from '@mui/icons-material/Group';
import StudentIcon from '@mui/icons-material/School';
import ParentIcon from '@mui/icons-material/FamilyRestroom';
import UploadIcon from '@mui/icons-material/Upload';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { MenuItem } from '../../types';
import { PermissionAction, ResourceType } from '../../types/auth';

// =====================================================
// Navigation Menu Configuration
// =====================================================

// Student-specific menu items
const createStudentMenuItems = (): MenuItem[] => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    permission: 'view_dashboard',
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: SchoolIcon,
    children: [
      {
        id: 'courses',
        label: 'My Courses',
        icon: BookIcon,
        path: '/courses',
        permission: 'view_courses',
      },
      {
        id: 'timetable',
        label: 'My Timetable',
        icon: ScheduleIcon,
        path: '/academics/timetable',
        permission: 'view_timetable',
      },
      {
        id: 'grades',
        label: 'My Grades',
        icon: AssessmentIcon,
        path: '/academics/grades',
        permission: 'view_grades',
      },
    ],
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: AssignmentIcon,
    children: [
      {
        id: 'my-assignments',
        label: 'My Assignments',
        icon: AssignmentIcon,
        path: '/assignments',
        permission: 'view_assignments',
      },
      {
        id: 'submissions',
        label: 'Submissions',
        icon: UploadIcon,
        path: '/assignments/submissions',
        permission: 'view_assignments',
      },
    ],
  },
  {
    id: 'examinations',
    label: 'Examinations',
    icon: AssessmentIcon,
    children: [
      {
        id: 'exams',
        label: 'My Exams',
        icon: AssessmentIcon,
        path: '/exams',
        permission: 'view_exams',
      },
      {
        id: 'results',
        label: 'My Results',
        icon: AssessmentIcon,
        path: '/exams/results',
        permission: 'view_grades',
      },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: ScheduleIcon,
    children: [
      {
        id: 'my-attendance',
        label: 'My Attendance',
        icon: ScheduleIcon,
        path: '/attendance',
        permission: 'view_attendance',
      },
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        icon: AssessmentIcon,
        path: '/attendance/reports',
        permission: 'view_attendance',
      },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    icon: LibraryIcon,
    children: [
      {
        id: 'catalog',
        label: 'Library Catalog',
        icon: BookIcon,
        path: '/library/catalog',
        permission: 'view_library',
      },
      {
        id: 'my-books',
        label: 'My Books',
        icon: AssignmentIcon,
        path: '/library/my-books',
        permission: 'view_library',
      },
      {
        id: 'reservations',
        label: 'Reservations',
        icon: ScheduleIcon,
        path: '/library/reservations',
        permission: 'view_library',
      },
    ],
  },
  {
    id: 'fees',
    label: 'Fees',
    icon: PaymentIcon,
    children: [
      {
        id: 'my-fees',
        label: 'My Fees',
        icon: PaymentIcon,
        path: '/fees/my-fees',
        permission: 'view_fees',
      },
      {
        id: 'payment-history',
        label: 'Payment History',
        icon: HistoryIcon,
        path: '/fees/history',
        permission: 'view_fees',
      },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: AssignmentIcon,
    children: [
      {
        id: 'my-activities',
        label: 'My Activities',
        icon: PeopleIcon,
        path: '/activities/my-activities',
        permission: 'view_activities',
      },
      {
        id: 'events',
        label: 'Events',
        icon: ScheduleIcon,
        path: '/activities/events',
        permission: 'view_activities',
      },
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: SchoolIcon,
    children: [
      {
        id: 'classrooms',
        label: 'Classrooms',
        icon: SchoolIcon,
        path: '/facilities/classrooms',
        permission: 'view_facilities',
      },
      {
        id: 'venues',
        label: 'Venues',
        icon: SchoolIcon,
        path: '/facilities/venues',
        permission: 'view_facilities',
      },
    ],
  },
];

// Admin/Faculty menu items (original)
const createAdminMenuItems = (hasPermission: (action: string, resource: string, conditions?: Record<string, any>) => boolean): MenuItem[] => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    permission: 'view_dashboard',
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: SchoolIcon,
    children: [
      {
        id: 'courses',
        label: 'Courses',
        icon: BookIcon,
        path: '/courses',
        permission: 'manage_courses',
      },
      {
        id: 'departments',
        label: 'Departments',
        icon: SchoolIcon,
        path: '/departments',
        permission: 'manage_departments',
      },
      {
        id: 'timetable',
        label: 'Timetable',
        icon: ScheduleIcon,
        path: '/academics/timetable',
        permission: 'view_timetable',
      },
    ],
  },
  {
    id: 'student-management',
    label: 'Student Management',
    icon: PeopleIcon,
    children: [
      {
        id: 'students',
        label: 'Students',
        icon: PersonIcon,
        path: '/students',
        permission: 'manage_students',
      },
      {
        id: 'enrollments',
        label: 'Enrollments',
        icon: AssignmentIcon,
        path: '/students/enrollments',
        permission: 'manage_students',
      },
      {
        id: 'attendance',
        label: 'Attendance',
        icon: ScheduleIcon,
        path: '/attendance',
        permission: 'mark_attendance',
      },
      {
        id: 'admissions',
        label: 'Admissions',
        icon: PersonIcon,
        path: '/admissions',
        permission: 'manage_admissions',
      },
    ],
  },
  {
    id: 'faculty-management',
    label: 'Faculty Management',
    icon: FacultyIcon,
    children: [
      {
        id: 'faculty',
        label: 'Faculty',
        icon: PersonIcon,
        path: '/faculty',
        permission: 'manage_faculty',
      },
    ],
  },
  {
    id: 'examinations',
    label: 'Examinations',
    icon: AssessmentIcon,
    children: [
      {
        id: 'exams',
        label: 'Exams',
        icon: AssessmentIcon,
        path: '/exams',
        permission: 'manage_exams',
      },
      {
        id: 'assignments',
        label: 'Assignments',
        icon: AssignmentIcon,
        path: '/assignments',
        permission: 'create_assignments',
      },
      {
        id: 'results',
        label: 'Results',
        icon: AssessmentIcon,
        path: '/exams/results',
        permission: 'enter_grades',
      },
      {
        id: 'grade-reports',
        label: 'Grade Reports',
        icon: AssessmentIcon,
        path: '/exams/reports',
        permission: 'view_reports',
      },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    icon: LibraryIcon,
    children: [
      {
        id: 'media',
        label: 'Media',
        icon: BookIcon,
        path: '/library/media',
        permission: 'manage_library',
      },
      {
        id: 'issues',
        label: 'Issues',
        icon: AssignmentIcon,
        path: '/library/issues',
        permission: 'manage_library',
      },
      {
        id: 'overdue',
        label: 'Overdue',
        icon: ScheduleIcon,
        path: '/library/overdue',
        permission: 'manage_library',
      },
    ],
  },
  {
    id: 'fees',
    label: 'Fees Management',
    icon: PaymentIcon,
    children: [
      {
        id: 'fee-terms',
        label: 'Fee Terms',
        icon: SettingsIcon,
        path: '/fees/terms',
        permission: 'manage_fees',
      },
      {
        id: 'fee-details',
        label: 'Fee Details',
        icon: PaymentIcon,
        path: '/fees/details',
        permission: 'manage_fees',
      },
      {
        id: 'fee-reports',
        label: 'Fee Reports',
        icon: AssessmentIcon,
        path: '/fees/reports',
        permission: 'view_reports',
      },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: AssignmentIcon,
    children: [
      {
        id: 'student-activities',
        label: 'Student Activities',
        icon: PeopleIcon,
        path: '/activities/students',
        permission: 'manage_activities',
      },
      {
        id: 'events',
        label: 'Events',
        icon: ScheduleIcon,
        path: '/activities/events',
        permission: 'manage_activities',
      },
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: SchoolIcon,
    children: [
      {
        id: 'classrooms',
        label: 'Classrooms',
        icon: SchoolIcon,
        path: '/facilities/classrooms',
        permission: 'manage_facilities',
      },
      {
        id: 'venues',
        label: 'Venues',
        icon: SchoolIcon,
        path: '/facilities/venues',
        permission: 'manage_facilities',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: AssessmentIcon,
    children: [
      {
        id: 'academic-reports',
        label: 'Academic Reports',
        icon: AssessmentIcon,
        path: '/reports/academic',
        permission: 'view_reports',
      },
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        icon: ScheduleIcon,
        path: '/reports/attendance',
        permission: 'view_reports',
      },
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        icon: PaymentIcon,
        path: '/reports/financial',
        permission: 'view_reports',
      },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: AdminIcon,
    children: [
      {
        id: 'users',
        label: 'Users',
        icon: PeopleIcon,
        path: '/admin/users',
        permission: 'manage_users',
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        icon: SettingsIcon,
        path: '/admin/roles',
        permission: 'manage_users',
      },
      {
        id: 'system-settings',
        label: 'System Settings',
        icon: SettingsIcon,
        path: '/admin/settings',
        permission: 'manage_system',
      },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        icon: AssessmentIcon,
        path: '/admin/audit-logs',
        permission: 'manage_system',
      },
    ],
  },
];

// =====================================================
// Component Props
// =====================================================

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  width?: number;
}

// =====================================================
// Component
// =====================================================

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  variant = 'persistent',
  width = 280,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission, logout } = useSupabaseAuth();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);

  // =====================================================
  // Menu Items
  // =====================================================

  // Filter menu items based on user permissions
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      // Check if user has permission for this item
      if (item.permission) {
        // Map permission strings to action/resource pairs
        const permissionMap: Record<string, { action: string; resource: string }> = {
          'view_dashboard': { action: 'view', resource: 'dashboard' },
          'manage_courses': { action: 'manage', resource: 'courses' },
          'view_courses': { action: 'view', resource: 'courses' },
          'manage_departments': { action: 'manage', resource: 'departments' },
          'view_timetable': { action: 'view', resource: 'timetable' },
          'manage_students': { action: 'manage', resource: 'students' },
          'view_students': { action: 'view', resource: 'students' },
          'mark_attendance': { action: 'mark', resource: 'attendance' },
          'view_attendance': { action: 'view', resource: 'attendance' },
          'manage_admissions': { action: 'manage', resource: 'admissions' },
          'manage_faculty': { action: 'manage', resource: 'faculty' },
          'view_faculty': { action: 'view', resource: 'faculty' },
          'manage_exams': { action: 'manage', resource: 'exams' },
          'view_exams': { action: 'view', resource: 'exams' },
          'view_reports': { action: 'view', resource: 'reports' },
          'manage_library': { action: 'manage', resource: 'library' },
          'view_library': { action: 'view', resource: 'library' },
          'manage_fees': { action: 'manage', resource: 'fees' },
          'manage_activities': { action: 'manage', resource: 'activities' },
          'view_activities': { action: 'view', resource: 'activities' },
          'manage_facilities': { action: 'manage', resource: 'facilities' },
          'view_facilities': { action: 'view', resource: 'facilities' },
          'manage_users': { action: 'manage', resource: 'users' },
          'manage_system': { action: 'manage', resource: 'system' },
        };
        
        const permission = permissionMap[item.permission as keyof typeof permissionMap];
        if (permission) {
          // Check if user has the required permission
          if (!hasPermission(permission.action as any, permission.resource as any)) {
            // For students, also check if they have view permission for the same resource
            if (permission.action === 'manage' && hasPermission('view' as any, permission.resource as any)) {
              // Allow students to see manage items if they have view permission
            } else {
              return false;
            }
          }
        } else {
          // If no permission mapping found, allow access (for items without specific permissions)
          return true;
        }
      }
      
      // Filter children recursively
      if (item.children) {
        const filteredChildren = filterMenuItems(item.children);
        if (filteredChildren.length === 0) {
          return false; // Hide parent if no children are visible
        }
        item.children = filteredChildren;
      }
      
      // If item has no permission and no children, show it (for parent items)
      if (!item.permission && !item.children) {
        return true;
      }
      
      return true;
    });
  };

  // Create role-based menu items
  const menuItems = user?.is_student 
    ? createStudentMenuItems()
    : createAdminMenuItems((action: any, resource: any, conditions?: any) => hasPermission(action, resource, conditions));

  // =====================================================
  // Event Handlers
  // =====================================================

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onClose();
      }
    } else if (item.children) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    }
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // =====================================================
  // Helper Functions
  // =====================================================

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const hasActiveChild = (item: MenuItem): boolean => {
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const canAccessItem = (item: MenuItem): boolean => {
    if (item.permission) {
      if (typeof item.permission === 'string') {
        // Handle legacy string permissions by mapping to valid actions/resources
        const permissionMap: Record<string, { action: PermissionAction; resource: ResourceType }> = {
          'view_dashboard': { action: 'read', resource: 'user' },
          'manage_courses': { action: 'manage', resource: 'course' },
          'manage_departments': { action: 'manage', resource: 'department' },
          'view_timetable': { action: 'read', resource: 'course' },
          'manage_students': { action: 'manage', resource: 'student' },
          'mark_attendance': { action: 'create', resource: 'attendance' },
          'manage_admissions': { action: 'manage', resource: 'student' },
          'manage_faculty': { action: 'manage', resource: 'faculty' },
          'manage_exams': { action: 'manage', resource: 'exam' },
          'create_assignments': { action: 'create', resource: 'assignment' },
          'enter_grades': { action: 'update', resource: 'grade' },
          'view_reports': { action: 'read', resource: 'report' },
          'manage_library': { action: 'manage', resource: 'library' },
          'manage_fees': { action: 'manage', resource: 'fee' },
          'manage_activities': { action: 'manage', resource: 'setting' },
          'view_activities': { action: 'read', resource: 'setting' },
          'manage_facilities': { action: 'manage', resource: 'setting' },
          'view_facilities': { action: 'read', resource: 'setting' },
          'manage_users': { action: 'manage', resource: 'user' },
          'manage_system': { action: 'manage', resource: 'setting' },
          // Student-specific permissions
          'view_courses': { action: 'read', resource: 'course' },
          'view_grades': { action: 'read', resource: 'grade' },
          'view_assignments': { action: 'read', resource: 'assignment' },
          'view_exams': { action: 'read', resource: 'exam' },
          'view_attendance': { action: 'read', resource: 'attendance' },
          'view_library': { action: 'read', resource: 'library' },
          'view_fees': { action: 'read', resource: 'fee' },
        };
        const mapped = permissionMap[item.permission];
        if (mapped) {
          return hasPermission(mapped.action, mapped.resource);
        }
        return true; // Allow access if permission not found
      } else {
        // Handle new permission object format
        return hasPermission(item.permission.action as any, item.permission.resource as any);
      }
    }
    if (item.children) {
      return item.children.some(child => canAccessItem(child));
    }
    return true;
  };

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

  // =====================================================
  // Render Functions
  // =====================================================

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!canAccessItem(item)) return null;

    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const hasActiveChildren = hasActiveChild(item);

    return (
      <Box key={item.id}>
        <ListItem
          disablePadding
          sx={{
            pl: level * 2 + 2,
            '& .MuiListItemButton-root': {
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            },
          }}
        >
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={isActive || hasActiveChildren}
            sx={{
              minHeight: 48,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light + '20',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '30',
                },
              },
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 40 : 48,
                  color: isActive ? theme.palette.primary.main : 'inherit',
                }}
              >
                <item.icon />
              </ListItemIcon>
            )}
            
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? theme.palette.primary.main : 'inherit',
                  }}
                />
                
                {hasChildren && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && isExpanded && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const renderUserSection = () => (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mr: 2,
            backgroundColor: theme.palette.primary.main,
          }}
        >
          {user?.first_name?.[0] || user?.email?.[0] || 'U'}
        </Avatar>
        
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.email || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
            <Chip
              icon={getRoleIcon()}
              label={getRoleLabel()}
              size="small"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        )}
      </Box>

      {!collapsed && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => navigate('/profile')}
            sx={{ flex: 1 }}
          >
            <AccountCircleIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate('/settings')}
            sx={{ flex: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );

  // =====================================================
  // Render
  // =====================================================

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: collapsed ? 80 : width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 80 : width,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        {!collapsed && (
          <Typography variant="h6" noWrap>
            OpenEducat ERP
          </Typography>
        )}
        
        <IconButton
          onClick={handleToggleCollapse}
          sx={{ color: 'inherit' }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* User Section */}
      {renderUserSection()}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List component="nav" sx={{ py: 1 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default NavigationDrawer;
