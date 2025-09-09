// =====================================================
// OpenEducat ERP Frontend - Admin Dashboard
// Administrative portal dashboard with system overview
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import AttendanceIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import LibraryIcon from '@mui/icons-material/LibraryBooks';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ExamIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../services/api';

interface AdminDashboardData {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
    department: string;
    status: string;
  };
  systemStats: {
    totalStudents: number;
    totalFaculty: number;
    totalCourses: number;
    totalDepartments: number;
    activeUsers: number;
    systemHealth: number;
  };
  academicStats: {
    currentSemesterEnrollments: number;
    completedAssignments: number;
    pendingGrades: number;
    averageAttendance: number;
    upcomingExams: number;
  };
  financialStats: {
    totalFeesCollected: number;
    pendingFees: number;
    scholarshipsAwarded: number;
    monthlyRevenue: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    date: string;
    severity: 'info' | 'warning' | 'error' | 'success';
  }>;
  systemAlerts: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    date: string;
  }>;
  quickStats: {
    newStudentsThisMonth: number;
    newFacultyThisMonth: number;
    systemUptime: number;
    storageUsed: number;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminDashboard(user?.id?.toString() || '0');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <SuccessIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <WarningIcon color="error" />;
      default: return <AnnouncementIcon color="info" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={data.profile.avatar}
                alt={data.profile.name}
                sx={{ width: 80, height: 80 }}
              >
                {data.profile.name.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" color="white" gutterBottom>
                Welcome, {data.profile.name}
              </Typography>
              <Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
                System Administrator | {data.profile.department}
              </Typography>
              <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                System Health: {data.systemStats.systemHealth}% | Active Users: {data.systemStats.activeUsers}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={data.profile.status}
                  color={getStatusColor(data.profile.status) as any}
                  sx={{ color: 'white' }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* System Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {data.systemStats.totalStudents.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +{data.quickStats.newStudentsThisMonth} this month
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Faculty
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {data.systemStats.totalFaculty.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +{data.quickStats.newFacultyThisMonth} this month
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Courses
                    </Typography>
                    <Typography variant="h5">
                      {data.systemStats.totalCourses}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Departments
                    </Typography>
                    <Typography variant="h5">
                      {data.systemStats.totalDepartments}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/admin/users')}
                  >
                    Manage Users
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate('/admin/academic')}
                  >
                    Academic
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PaymentIcon />}
                    onClick={() => navigate('/admin/fees')}
                  >
                    Fees
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnnouncementIcon />}
                    onClick={() => navigate('/admin/announcements')}
                  >
                    Announce
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate('/admin/settings')}
                  >
                    Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Academic Stats */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.academicStats.currentSemesterEnrollments}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Enrollments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssignmentIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.academicStats.completedAssignments}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Assignments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <GradeIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.academicStats.pendingGrades}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Grades
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttendanceIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.academicStats.averageAttendance}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Attendance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ExamIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.academicStats.upcomingExams}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Exams
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Financial Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fees Collected
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    ${data.financialStats.totalFeesCollected.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pending Fees
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    ${data.financialStats.pendingFees.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Scholarships
                  </Typography>
                  <Typography variant="h5" color="info.main">
                    ${data.financialStats.scholarshipsAwarded.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h5" color="primary.main">
                    ${data.financialStats.monthlyRevenue.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  System Uptime
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.quickStats.systemUptime}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption">
                  {data.quickStats.systemUptime}% uptime
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Storage Usage
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.quickStats.storageUsed}
                  color={data.quickStats.storageUsed > 80 ? 'warning' : 'primary'}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption">
                  {data.quickStats.storageUsed}% used
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Alerts
              </Typography>
              <List dense>
                {data.systemAlerts.slice(0, 5).map((alert) => (
                  <ListItem key={alert.id}>
                    <ListItemIcon>
                      {getAlertIcon(alert.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {data.systemAlerts.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No system alerts"
                      secondary="All systems are running normally"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List dense>
                {data.recentActivities.slice(0, 5).map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemIcon>
                      {getAlertIcon(activity.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(activity.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {data.recentActivities.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent activities"
                      secondary="System activity will appear here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
