// =====================================================
// OpenEducat ERP Frontend - Faculty Dashboard
// Faculty portal dashboard with teaching tools
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
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import AttendanceIcon from '@mui/icons-material/EventNote';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StudentsIcon from '@mui/icons-material/Group';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ExamIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';

interface FacultyDashboardData {
  profile: {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    phone: string;
    avatar: string;
    department: string;
    position: string;
    qualification: string;
    status: string;
  };
  teaching: {
    coursesAssigned: number;
    totalStudents: number;
    activeClasses: number;
    completedClasses: number;
    averageAttendance: number;
  };
  quickStats: {
    pendingGrades: number;
    upcomingClasses: number;
    assignmentsToReview: number;
    studentsPresent: number;
  };
  todaySchedule: Array<{
    id: string;
    courseCode: string;
    courseName: string;
    startTime: string;
    endTime: string;
    room: string;
    studentsCount: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    date: string;
  }>;
}

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [data, setData] = useState<FacultyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getFacultyDashboard(user?.id || 0);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading faculty dashboard:', err);
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
      case 'on_leave': return 'warning';
      default: return 'default';
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
                {data.profile.position} | {data.profile.department}
              </Typography>
              <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                Employee ID: {data.profile.employeeId}
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
        {/* Teaching Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Teaching Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Courses Assigned
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {data.teaching.coursesAssigned}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {data.teaching.totalStudents}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Classes Completed
                    </Typography>
                    <Typography variant="h5">
                      {data.teaching.completedClasses}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Average Attendance
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color={data.teaching.averageAttendance >= 75 ? 'success.main' : 'error.main'}
                    >
                      {data.teaching.averageAttendance}%
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
                    startIcon={<AttendanceIcon />}
                    onClick={() => navigate('/faculty/mark-attendance')}
                  >
                    Mark Attendance
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate('/faculty/assignments')}
                  >
                    Assignments
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GradeIcon />}
                    onClick={() => navigate('/faculty/grades')}
                  >
                    Grades
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<StudentsIcon />}
                    onClick={() => navigate('/faculty/students')}
                  >
                    My Students
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    onClick={() => navigate('/faculty/schedule')}
                  >
                    Schedule
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
                  <GradeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.pendingGrades}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Grades
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ScheduleIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.upcomingClasses}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Classes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssignmentIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.assignmentsToReview}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assignments to Review
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttendanceIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{data.quickStats.studentsPresent}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students Present Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Schedule
              </Typography>
              <List>
                {data.todaySchedule.map((class_) => (
                  <ListItem key={class_.id} divider>
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${class_.courseCode} - ${class_.courseName}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {class_.startTime} - {class_.endTime} | Room: {class_.room}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {class_.studentsCount} students enrolled
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {data.todaySchedule.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No classes scheduled for today"
                      secondary="Enjoy your free day!"
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
              <List>
                {data.recentActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      <AnnouncementIcon color="info" />
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
                      secondary="Start teaching to see your activities here"
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

export default FacultyDashboard;
