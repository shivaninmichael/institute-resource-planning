// =====================================================
// Attendance Report Component
// Displays attendance statistics and trends
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import ChartCard from '../dashboard/ChartCard';

interface AttendanceData {
  subject: string;
  present: number;
  total: number;
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastAttended?: string;
}

interface AttendanceReportProps {
  studentId?: string;
  courseId?: string;
  onExport?: () => void;
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({
  studentId,
  courseId,
  onExport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('subject');

  // Mock data - replace with actual API data
  const attendanceData: AttendanceData[] = [
    {
      subject: 'Mathematics',
      present: 42,
      total: 45,
      percentage: 93.33,
      status: 'excellent',
      lastAttended: '2024-01-15',
    },
    {
      subject: 'Physics',
      present: 38,
      total: 45,
      percentage: 84.44,
      status: 'good',
      lastAttended: '2024-01-14',
    },
    {
      subject: 'Chemistry',
      present: 35,
      total: 45,
      percentage: 77.77,
      status: 'warning',
      lastAttended: '2024-01-15',
    },
    {
      subject: 'Biology',
      present: 32,
      total: 45,
      percentage: 71.11,
      status: 'critical',
      lastAttended: '2024-01-13',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'primary';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Time Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="semester">This Semester</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>View</InputLabel>
            <Select
              value={selectedView}
              label="View"
              onChange={(e) => setSelectedView(e.target.value)}
            >
              <MenuItem value="subject">By Subject</MenuItem>
              <MenuItem value="daily">Daily View</MenuItem>
              <MenuItem value="weekly">Weekly View</MenuItem>
              <MenuItem value="monthly">Monthly View</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" justifyContent="flex-end">
            <Tooltip title="Export Report">
              <IconButton onClick={onExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      {/* Attendance Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChartCard
            title="Attendance Trends"
            subtitle="Daily attendance patterns"
            chart={<div style={{ height: 300 }}>Chart placeholder</div>}
            height={400}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Attendance
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ py: 3 }}
              >
                <Box position="relative" display="inline-flex" mb={2}>
                  <CircularProgress
                    variant="determinate"
                    value={85}
                    size={120}
                    thickness={4}
                    color="primary"
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" color="text.secondary">
                      85%
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="body1" color="text.secondary">
                    Present: 42 days
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Absent: 8 days
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Above minimum requirement (75%)
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Attendance Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Subject-wise Attendance
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell align="center">Present/Total</TableCell>
                  <TableCell align="center">Percentage</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Last Attended</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((subject) => (
                  <TableRow key={subject.subject}>
                    <TableCell>{subject.subject}</TableCell>
                    <TableCell align="center">
                      {subject.present}/{subject.total}
                    </TableCell>
                    <TableCell align="center">
                      <Box position="relative" display="inline-flex">
                        <CircularProgress
                          variant="determinate"
                          value={subject.percentage}
                          size={40}
                          thickness={4}
                          color={getStatusColor(subject.status) as any}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div">
                            {Math.round(subject.percentage)}%
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={subject.status}
                        size="small"
                        color={getStatusColor(subject.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarIcon fontSize="small" color="action" />
                        {subject.lastAttended ? formatDate(subject.lastAttended) : 'N/A'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceReport;
