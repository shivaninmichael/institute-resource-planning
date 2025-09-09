// =====================================================
// OpenEducat ERP Frontend - Student Attendance
// Student view of attendance records
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import PresentIcon from '@mui/icons-material/CheckCircle';
import AbsentIcon from '@mui/icons-material/Cancel';
import LateIcon from '@mui/icons-material/AccessTime';
import ExcusedIcon from '@mui/icons-material/EventAvailable';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../services/api';

interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  courseName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  timeOut?: string;
  remarks?: string;
}

interface AttendanceData {
  records: AttendanceRecord[];
  summary: {
    totalClasses: number;
    presentClasses: number;
    absentClasses: number;
    lateClasses: number;
    excusedClasses: number;
    attendanceRate: number;
    courseWiseAttendance: {
      [courseCode: string]: {
        courseName: string;
        total: number;
        present: number;
        rate: number;
      };
    };
  };
}

const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    loadAttendance();
  }, [selectedCourse, selectedMonth]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAttendanceSummary(Number(user?.id) || 0, {
        course: selectedCourse !== 'all' ? selectedCourse : undefined,
        month: selectedMonth.toISOString().substring(0, 7), // YYYY-MM format
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <PresentIcon color="success" />;
      case 'absent':
        return <AbsentIcon color="error" />;
      case 'late':
        return <LateIcon color="warning" />;
      case 'excused':
        return <ExcusedIcon color="info" />;
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'excused':
        return 'info';
    }
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 85) return 'success.main';
    if (rate >= 75) return 'warning.main';
    return 'error.main';
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

  const courses = Object.keys(data.summary.courseWiseAttendance);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Attendance
        </Typography>

        {/* Overall Summary */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {data.summary.totalClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Classes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PresentIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h4" color="success.main">
                  {data.summary.presentClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AbsentIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h4" color="error.main">
                  {data.summary.absentClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <LateIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h4" color="warning.main">
                  {data.summary.lateClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ color: getAttendanceColor(data.summary.attendanceRate) }}
                >
                  {data.summary.attendanceRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attendance Rate
                </Typography>
                {data.summary.attendanceRate < 75 && (
                  <Alert severity="warning" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    Below minimum requirement (75%)
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Course-wise Attendance */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Course-wise Attendance
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(data.summary.courseWiseAttendance).map(([courseCode, courseData]) => (
                <Grid item xs={12} sm={6} md={4} key={courseCode}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {courseCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {courseData.courseName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={courseData.rate}
                          sx={{ 
                            flexGrow: 1, 
                            mr: 1,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getAttendanceColor(courseData.rate)
                            }
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ color: getAttendanceColor(courseData.rate) }}
                        >
                          {courseData.rate.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {courseData.present}/{courseData.total} classes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Filters and Records */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  label="Course"
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <MenuItem value="all">All Courses</MenuItem>
                  {courses.map((courseCode) => (
                    <MenuItem key={courseCode} value={courseCode}>
                      {courseCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <DatePicker
                label="Month"
                views={['year', 'month']}
                value={selectedMonth}
                onChange={(date) => date && setSelectedMonth(date)}
                slotProps={{
                  textField: { size: 'small' },
                }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Attendance Records
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time In</TableCell>
                    <TableCell>Time Out</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.records.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {record.courseCode}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.courseName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(record.status)}
                          label={record.status.toUpperCase()}
                          color={getStatusColor(record.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {record.timeIn || '-'}
                      </TableCell>
                      <TableCell>
                        {record.timeOut || '-'}
                      </TableCell>
                      <TableCell>
                        {record.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default StudentAttendance;

