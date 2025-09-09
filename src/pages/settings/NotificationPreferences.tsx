// =====================================================
// Notification Preferences Component
// Manages user notification settings
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Alert,
  Divider,
  FormGroup,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';

interface NotificationChannel {
  id: string;
  name: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  channels: {
    [key: string]: boolean;
  };
  importance: 'high' | 'medium' | 'low';
  frequency: 'immediate' | 'daily' | 'weekly';
}

const NotificationPreferences: React.FC = () => {
  const theme = useTheme();

  // Available notification channels
  const channels: NotificationChannel[] = [
    { id: 'inApp', name: 'In-App Notifications', enabled: true, icon: <NotificationsIcon /> },
    { id: 'email', name: 'Email Notifications', enabled: true, icon: <EmailIcon /> },
    { id: 'sms', name: 'SMS Notifications', enabled: false, icon: <SmsIcon /> },
  ];

  // Notification categories with their settings
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'academic',
      name: 'Academic Updates',
      description: 'Grades, assignments, and course announcements',
      enabled: true,
      channels: { inApp: true, email: true, sms: false },
      importance: 'high',
      frequency: 'immediate',
    },
    {
      id: 'attendance',
      name: 'Attendance',
      description: 'Class attendance and absence notifications',
      enabled: true,
      channels: { inApp: true, email: true, sms: true },
      importance: 'high',
      frequency: 'immediate',
    },
    {
      id: 'events',
      name: 'Events & Activities',
      description: 'Campus events, workshops, and activities',
      enabled: true,
      channels: { inApp: true, email: false, sms: false },
      importance: 'medium',
      frequency: 'daily',
    },
    {
      id: 'fees',
      name: 'Fee Reminders',
      description: 'Payment due dates and receipts',
      enabled: true,
      channels: { inApp: true, email: true, sms: true },
      importance: 'high',
      frequency: 'immediate',
    },
    {
      id: 'library',
      name: 'Library Updates',
      description: 'Due dates, reservations, and new arrivals',
      enabled: true,
      channels: { inApp: true, email: false, sms: false },
      importance: 'medium',
      frequency: 'daily',
    },
    {
      id: 'system',
      name: 'System Updates',
      description: 'Maintenance and system announcements',
      enabled: true,
      channels: { inApp: true, email: true, sms: false },
      importance: 'low',
      frequency: 'weekly',
    },
  ]);

  const [masterSwitch, setMasterSwitch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quietHours, setQuietHours] = useState<number[]>([22, 7]); // 10 PM to 7 AM

  const handleMasterSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setMasterSwitch(enabled);
    setCategories(prev => prev.map(category => ({
      ...category,
      enabled: enabled,
    })));
  };

  const handleCategoryToggle = (categoryId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, enabled: event.target.checked } : category
    ));
  };

  const handleChannelToggle = (categoryId: string, channelId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? {
            ...category,
            channels: {
              ...category.channels,
              [channelId]: event.target.checked,
            },
          }
        : category
    ));
  };

  const handleImportanceChange = (categoryId: string) => (event: any) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? { ...category, importance: event.target.value as 'high' | 'medium' | 'low' }
        : category
    ));
  };

  const handleFrequencyChange = (categoryId: string) => (event: any) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? { ...category, frequency: event.target.value as 'immediate' | 'daily' | 'weekly' }
        : category
    ));
  };

  const handleQuietHoursChange = (event: Event, newValue: number | number[]) => {
    setQuietHours(newValue as number[]);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMasterSwitch(true);
    setQuietHours([22, 7]);
    setCategories(prev => prev.map(category => ({
      ...category,
      enabled: true,
      channels: { inApp: true, email: true, sms: false },
      importance: 'medium',
      frequency: 'immediate',
    })));
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Notification Preferences</Typography>
          <Box>
            <Tooltip title="Reset to defaults">
              <IconButton onClick={handleReset} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSave}
            >
              Save Changes
            </LoadingButton>
          </Box>
        </Box>

        {success && (
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Notification preferences saved successfully
          </Alert>
        )}

        {/* Master Switch */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              {masterSwitch ? (
                <NotificationsActiveIcon color="primary" sx={{ fontSize: 32 }} />
              ) : (
                <NotificationsOffIcon color="disabled" sx={{ fontSize: 32 }} />
              )}
              <Box flex={1}>
                <Typography variant="h6">
                  All Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toggle all notification settings
                </Typography>
              </Box>
              <Switch
                checked={masterSwitch}
                onChange={handleMasterSwitch}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quiet Hours
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Only high-priority notifications will be delivered during quiet hours
            </Typography>
            <Box sx={{ px: 3, py: 2 }}>
              <Slider
                value={quietHours}
                onChange={handleQuietHoursChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatHour}
                min={0}
                max={24}
                marks={[
                  { value: 0, label: '12 AM' },
                  { value: 6, label: '6 AM' },
                  { value: 12, label: '12 PM' },
                  { value: 18, label: '6 PM' },
                  { value: 24, label: '12 AM' },
                ]}
              />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Quiet hours: {formatHour(quietHours[0])} - {formatHour(quietHours[1])}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Categories
            </Typography>
            <Stack spacing={2}>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <Box>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Switch
                        checked={category.enabled && masterSwitch}
                        onChange={handleCategoryToggle(category.id)}
                        disabled={!masterSwitch}
                      />
                      <Box flex={1}>
                        <Typography variant="subtitle1">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {category.description}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {channels.map((channel) => (
                            <FormControlLabel
                              key={channel.id}
                              control={
                                <Switch
                                  size="small"
                                  checked={category.channels[channel.id] && category.enabled && masterSwitch}
                                  onChange={handleChannelToggle(category.id, channel.id)}
                                  disabled={!category.enabled || !masterSwitch}
                                 />
                              }
                              label={
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  {channel.icon}
                                  <Typography variant="body2">
                                    {channel.name}
                                  </Typography>
                                </Box>
                              }
                                 />
                          ))}
                        </Stack>
                      </Box>
                      <Stack spacing={1} minWidth={120}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Importance</InputLabel>
                          <Select
                            value={category.importance}
                            label="Importance"
                            onChange={handleImportanceChange(category.id)}
                            disabled={!category.enabled || !masterSwitch}
                          >
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Frequency</InputLabel>
                          <Select
                            value={category.frequency}
                            label="Frequency"
                            onChange={handleFrequencyChange(category.id)}
                            disabled={!category.enabled || !masterSwitch}
                          >
                            <MenuItem value="immediate">Immediate</MenuItem>
                            <MenuItem value="daily">Daily Digest</MenuItem>
                            <MenuItem value="weekly">Weekly Digest</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Box>
                  </Box>
                  <Divider />
                </React.Fragment>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default NotificationPreferences;
