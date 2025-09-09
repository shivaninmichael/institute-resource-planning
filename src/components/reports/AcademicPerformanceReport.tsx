// =====================================================
// Academic Performance Report Component
// Displays student academic performance analytics
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
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import ChartCard from '../dashboard/ChartCard';

interface PerformanceData {
  subject: string;
  currentScore: number;
  maxScore: number;
  previousScore?: number;
  trend?: number;
  grade: string;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface AcademicPerformanceReportProps {
  studentId?: string;
  courseId?: string;
  onExport?: () => void;
}

const AcademicPerformanceReport: React.FC<AcademicPerformanceReportProps> = ({
  studentId,
  courseId,
  onExport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('score');

  // Mock data - replace with actual API data
  const performanceData: PerformanceData[] = [
    {
      subject: 'Mathematics',
      currentScore: 85,
      maxScore: 100,
      previousScore: 78,
      trend: 7,
      grade: 'A',
      status: 'excellent',
    },
    {
      subject: 'Physics',
      currentScore: 75,
      maxScore: 100,
      previousScore: 80,
      trend: -5,
      grade: 'B',
      status: 'good',
    },
    {
      subject: 'Chemistry',
      currentScore: 90,
      maxScore: 100,
      previousScore: 85,
      trend: 5,
      grade: 'A+',
      status: 'excellent',
    },
    {
      subject: 'Biology',
      currentScore: 70,
      maxScore: 100,
      previousScore: 72,
      trend: -2,
      grade: 'B',
      status: 'average',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'primary';
      case 'average':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUpIcon fontSize="small" color="success" />;
    }
    if (trend < 0) {
      return <TrendingDownIcon fontSize="small" color="error" />;
    }
    return null;
  };

  const calculateProgress = (current: number, max: number) => {
    return (current / max) * 100;
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
              <MenuItem value="current">Current Semester</MenuItem>
              <MenuItem value="previous">Previous Semester</MenuItem>
              <MenuItem value="year">Academic Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Metric</InputLabel>
            <Select
              value={selectedMetric}
              label="Metric"
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <MenuItem value="score">Score</MenuItem>
              <MenuItem value="grade">Grade</MenuItem>
              <MenuItem value="percentile">Percentile</MenuItem>
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

      {/* Performance Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChartCard
            title="Performance Trends"
            subtitle="Subject-wise performance comparison"
            chart={<div style={{ height: 300 }}>Chart placeholder</div>}
            height={400}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ChartCard
            title="Grade Distribution"
            subtitle="Overall grade distribution"
            chart={<div style={{ height: 300 }}>Chart placeholder</div>}
            height={400}
          />
        </Grid>
      </Grid>

      {/* Detailed Performance Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Subject-wise Performance
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Grade</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performanceData.map((subject) => (
                  <TableRow key={subject.subject}>
                    <TableCell>{subject.subject}</TableCell>
                    <TableCell align="center">
                      {subject.currentScore}/{subject.maxScore}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={subject.grade}
                        size="small"
                        color={getStatusColor(subject.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(subject.currentScore, subject.maxScore)}
                          color={getStatusColor(subject.status) as any}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={subject.status}
                        size="small"
                        color={getStatusColor(subject.status) as any}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        {subject.trend !== undefined && (
                          <>
                            {getTrendIcon(subject.trend)}
                            <Typography
                              variant="body2"
                              color={subject.trend > 0 ? 'success.main' : 'error.main'}
                            >
                              {subject.trend > 0 ? '+' : ''}{subject.trend}%
                            </Typography>
                          </>
                        )}
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

export default AcademicPerformanceReport;
