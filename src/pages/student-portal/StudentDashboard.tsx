// =====================================================
// OpenEducat ERP Frontend - Student Dashboard
// Student self-service portal dashboard
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import AttendanceIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import LibraryIcon from '@mui/icons-material/LibraryBooks';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';

interface StudentDashboardData {
  profile: {
    id: string;
    name: string;
    studentId: string;
    email: string;
    phone: string;
    avatar: string;
    course: string;
    batch: string;
    semester: string;
    status: string;
  };
  academic: {
    currentGPA: number;
    totalCredits: number;
    completedCredits: number;
    coursesEnrolled: number;
    attendanceRate: number;
  };
  quickStats: {
    pendingAssignments: number;
    upcomingExams: number;
    pendingFees: number;
    libraryBooks: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    date: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudentDashboard(Number(user?.id) || 0);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading student dashboard:', err);
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
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
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
                Student ID: {data.profile.studentId} | {data.profile.course}
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
        {/* Academic Progress */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Academic Progress
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current GPA
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {data.academic.currentGPA.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Credits Progress
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(data.academic.completedCredits / data.academic.totalCredits) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {data.academic.completedCredits}/{data.academic.totalCredits}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate
                    </Typography>
                    <Typography variant="h5" color={data.academic.attendanceRate >= 75 ? 'success.main' : 'error.main'}>
                      {data.academic.attendanceRate}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Courses Enrolled
                    </Typography>
                    <Typography variant="h5">
                      {data.academic.coursesEnrolled}
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
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate('/student/assignments')}
                  >
                    Assignments
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GradeIcon />}
                    onClick={() => navigate('/student/grades')}
                  >
                    Grades
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AttendanceIcon />}
                    onClick={() => navigate('/student/attendance')}
                  >
                    Attendance
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    onClick={() => navigate('/student/schedule')}
                  >
                    Schedule
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PaymentIcon />}
                    onClick={() => navigate('/student/fees')}
                  >
                    Fees
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LibraryIcon />}
                    onClick={() => navigate('/student/library')}
                  >
                    Library
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssignmentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.pendingAssignments}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Assignments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.upcomingExams}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Exams
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PaymentIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.pendingFees}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Fees
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LibraryIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.libraryBooks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Library Books
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              {data.recentActivities.map((activity) => (
                <Box key={activity.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle2">{activity.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Announcements
              </Typography>
              {data.announcements.map((announcement) => (
                <Box key={announcement.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="subtitle2">{announcement.title}</Typography>
                    <Chip
                      label={announcement.priority}
                      size="small"
                      color={getPriorityColor(announcement.priority) as any}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {announcement.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(announcement.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;

