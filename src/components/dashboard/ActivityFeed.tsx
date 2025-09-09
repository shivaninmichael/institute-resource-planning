// =====================================================
// Activity Feed Component
// Displays recent activities and updates
// =====================================================

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Activity {
  id: string;
  type: 'assignment' | 'payment' | 'exam' | 'event' | 'attendance' | 'grade' | 'profile';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: string;
  link?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  showHeader?: boolean;
  maxItems?: number;
  onSeeAll?: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Recent Activities',
  showHeader = true,
  maxItems = 5,
  onSeeAll,
}) => {
  const theme = useTheme();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'assignment':
        return <AssignmentIcon />;
      case 'payment':
        return <PaymentIcon />;
      case 'exam':
        return <SchoolIcon />;
      case 'event':
        return <EventIcon />;
      case 'attendance':
        return <ScheduleIcon />;
      case 'grade':
        return <GradeIcon />;
      case 'profile':
        return <PersonIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'assignment':
        return theme.palette.primary.main;
      case 'payment':
        return theme.palette.success.main;
      case 'exam':
        return theme.palette.error.main;
      case 'event':
        return theme.palette.info.main;
      case 'attendance':
        return theme.palette.warning.main;
      case 'grade':
        return theme.palette.secondary.main;
      case 'profile':
        return theme.palette.grey[500];
      default:
        return theme.palette.primary.main;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <Card>
      {showHeader && (
        <>
          <CardHeader
            title={title}
            action={
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            }
          />
          <Divider />
        </>
      )}
      <CardContent sx={{ p: 0 }}>
        <List disablePadding>
          {displayedActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
                <ListItemAvatar>
                  {activity.user?.avatar ? (
                    <Avatar src={activity.user.avatar} />
                  ) : (
                    <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">
                        {activity.title}
                      </Typography>
                      {activity.status && (
                        <Chip
                          label={activity.status}
                          size="small"
                          color={getStatusColor(activity.status)}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {activity.user?.name && `${activity.user.name} - `}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {activity.description}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(activity.timestamp)}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
              {index < displayedActivities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
        {onSeeAll && activities.length > maxItems && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button onClick={onSeeAll} size="small">
              See All Activities
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;