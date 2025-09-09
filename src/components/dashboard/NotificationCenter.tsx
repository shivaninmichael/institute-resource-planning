// =====================================================
// OpenEducat ERP Frontend - Notification Center Component
// Displays a list of notifications with actions
// =====================================================

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
  Skeleton,
  useTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Link } from 'react-router-dom';
import { NotificationItem } from '../../types/dashboard';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isLoading = false,
  error = null,
  onRefresh,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const theme = useTheme();

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    }
    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderSkeleton = () => (
    <List>
      {[1, 2, 3, 4, 5].map((key) => (
        <ListItem key={key}>
          <ListItemIcon>
            <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton width="80%" />}
            secondary={<Skeleton width="60%" />}
          />
        </ListItem>
      ))}
    </List>
  );

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        }
        action={
          <Box>
            {onMarkAllAsRead && unreadCount > 0 && (
              <Button
                startIcon={<DoneAllIcon />}
                onClick={onMarkAllAsRead}
                size="small"
                sx={{ mr: 1 }}
              >
                Mark all as read
              </Button>
            )}
            {onRefresh && (
              <IconButton onClick={onRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
        }
      />
      <CardContent>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderLeft: 3,
                  borderColor: getNotificationColor(notification.type),
                  mb: 1,
                  backgroundColor: notification.isRead
                    ? 'transparent'
                    : `${getNotificationColor(notification.type)}08`,
                  borderRadius: 1,
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    notification.link ? (
                      <Link
                        to={notification.link}
                        style={{
                          textDecoration: 'none',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {notification.title}
                      </Link>
                    ) : (
                      notification.title
                    )
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        {formatTimestamp(notification.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
                {!notification.isRead && onMarkAsRead && (
                  <Button
                    size="small"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;

