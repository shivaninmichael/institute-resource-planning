// =====================================================
// OpenEducat ERP Frontend - Notifications Center
// Email, SMS, and in-app notifications management
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Menu,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationIcon from '@mui/icons-material/Notifications';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import MoreIcon from '@mui/icons-material/MoreVert';
import ReadIcon from '@mui/icons-material/CheckCircle';
import UnreadIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsApi } from '../../services/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: Recipient[];
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  readCount: number;
  totalRecipients: number;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  category: string;
  variables: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  // Dialogs
  const [composeDialog, setComposeDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState<{
    open: boolean;
    template: NotificationTemplate | null;
    mode: 'create' | 'edit';
  }>({ open: false, template: null, mode: 'create' });

  // Form states
  const [composeForm, setComposeForm] = useState({
    title: '',
    message: '',
    type: 'email' as 'email' | 'sms' | 'push',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    recipientType: 'all' as 'all' | 'students' | 'faculty' | 'staff' | 'custom',
    customRecipients: [] as string[],
    scheduleType: 'now' as 'now' | 'later',
    scheduledAt: new Date(),
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'email' as 'email' | 'sms' | 'push',
    category: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notificationsResponse, templatesResponse, recipientsResponse] = await Promise.all([
        notificationsApi.getAll(),
        notificationsApi.getTemplates(),
        notificationsApi.getRecipients(),
      ]);
      setNotifications(notificationsResponse.data);
      setTemplates(templatesResponse.data);
      setRecipients(recipientsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications data');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      await notificationsApi.send({
        ...composeForm,
        scheduledAt: composeForm.scheduleType === 'later' ? composeForm.scheduledAt.toISOString() : undefined,
        createdBy: user?.id || '',
      });
      
      loadData();
      setComposeDialog(false);
      resetComposeForm();
    } catch (err) {
      setError('Failed to send notification');
      console.error('Error sending notification:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      await notificationsApi.createTemplate(templateForm);
      loadData();
      setTemplateDialog({ open: false, template: null, mode: 'create' });
      resetTemplateForm();
    } catch (err) {
      setError('Failed to create template');
      console.error('Error creating template:', err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      await notificationsApi.delete(notificationId);
      loadData();
    } catch (err) {
      setError('Failed to delete notification');
      console.error('Error deleting notification:', err);
    }
  };

  const resetComposeForm = () => {
    setComposeForm({
      title: '',
      message: '',
      type: 'email',
      priority: 'medium',
      recipientType: 'all',
      customRecipients: [],
      scheduleType: 'now',
      scheduledAt: new Date(),
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      subject: '',
      content: '',
      type: 'email',
      category: '',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'push': return <NotificationIcon />;
      default: return <InfoIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'scheduled': return 'info';
      case 'failed': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Notifications Center
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setComposeDialog(true)}
          >
            Compose Notification
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`All Notifications (${notifications.length})`} />
            <Tab label={`Templates (${templates.length})`} />
            <Tab label="Settings" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sent Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {notification.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notification.message.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTypeIcon(notification.type)}
                            label={notification.type.toUpperCase()}
                            variant="outlined"
                            size="small"
                               />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={notification.priority.toUpperCase()}
                            color={getPriorityColor(notification.priority) as any}
                            size="small"
                               />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {notification.totalRecipients}
                            </Typography>
                            {notification.readCount > 0 && (
                              <Chip
                                label={`${notification.readCount} read`}
                                size="small"
                                variant="outlined"
                                color="success"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={notification.status.toUpperCase()}
                            color={getStatusColor(notification.status) as any}
                            size="small"
                               />
                        </TableCell>
                        <TableCell>
                          {notification.sentAt 
                            ? new Date(notification.sentAt).toLocaleDateString()
                            : notification.scheduledAt
                              ? `Scheduled: ${new Date(notification.scheduledAt).toLocaleDateString()}`
                              : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedNotification(notification);
                            }}
                          >
                            <MoreIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Notification Templates
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setTemplateDialog({ open: true, template: null, mode: 'create' })}
                >
                  Create Template
                </Button>
              </Box>

              <Grid container spacing={3}>
                {templates.map((template) => (
                  <Grid item xs={12} md={6} lg={4} key={template.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            {template.name}
                          </Typography>
                          <Chip
                            icon={getTypeIcon(template.type)}
                            label={template.type}
                            size="small"
                            variant="outlined"
                               />
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {template.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {template.content.substring(0, 100)}...
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip label={template.category} size="small" />
                          <Box>
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Alert severity="info">
                Notification settings and preferences will be configured here.
              </Alert>
            </Box>
          </TabPanel>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ViewIcon sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <SendIcon sx={{ mr: 1 }} />
            Resend
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            if (selectedNotification) handleDeleteNotification(selectedNotification.id);
            setAnchorEl(null);
          }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Compose Dialog */}
        <Dialog
          open={composeDialog}
          onClose={() => setComposeDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Compose Notification
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={composeForm.title}
                  onChange={(e) => setComposeForm({ ...composeForm, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={composeForm.type}
                    label="Type"
                    onChange={(e) => setComposeForm({ ...composeForm, type: e.target.value as any })}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="push">Push Notification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={composeForm.priority}
                    label="Priority"
                    onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value as any })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Recipients</InputLabel>
                  <Select
                    value={composeForm.recipientType}
                    label="Recipients"
                    onChange={(e) => setComposeForm({ ...composeForm, recipientType: e.target.value as any })}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="students">Students Only</MenuItem>
                    <MenuItem value="faculty">Faculty Only</MenuItem>
                    <MenuItem value="staff">Staff Only</MenuItem>
                    <MenuItem value="custom">Custom Selection</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={composeForm.scheduleType === 'later'}
                      onChange={(e) => setComposeForm({ 
                        ...composeForm, 
                        scheduleType: e.target.checked ? 'later' : 'now' 
                      })}
                    />
                  }
                  label="Schedule for later"
                />
              </Grid>
              {composeForm.scheduleType === 'later' && (
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Schedule Date & Time"
                    value={composeForm.scheduledAt}
                    onChange={(date) => date && setComposeForm({ ...composeForm, scheduledAt: date })}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComposeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              variant="contained"
              startIcon={composeForm.scheduleType === 'later' ? <ScheduleIcon /> : <SendIcon />}
              disabled={!composeForm.title || !composeForm.message}
            >
              {composeForm.scheduleType === 'later' ? 'Schedule' : 'Send'} Notification
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Dialog */}
        <Dialog
          open={templateDialog.open}
          onClose={() => setTemplateDialog({ open: false, template: null, mode: 'create' })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {templateDialog.mode === 'create' ? 'Create Template' : 'Edit Template'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Template Name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Content"
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  helperText="Use {{variableName}} for dynamic content"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={templateForm.type}
                    label="Type"
                    onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as any })}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="push">Push Notification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTemplateDialog({ open: false, template: null, mode: 'create' })}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              variant="contained"
              disabled={!templateForm.name || !templateForm.content}
            >
              {templateDialog.mode === 'create' ? 'Create' : 'Update'} Template
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default NotificationsPage;
