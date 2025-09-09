// =====================================================
// Dashboard Page Component
// Main dashboard with analytics and activity feed
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DateRangeIcon from '@mui/icons-material/DateRange';
import KPICard from '../components/dashboard/KPICard';
import ChartCard from '../components/dashboard/ChartCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

interface KPIData {
  students: {
    total: number;
    trend: number;
    trendLabel: string;
  };
  attendance: {
    value: string;
    trend: number;
    trendLabel: string;
    progress: number;
  };
  assignments: {
    total: number;
    completed: number;
    progress: number;
  };
  fees: {
    collected: string;
    trend: number;
    trendLabel: string;
    progress: number;
  };
}

interface Activity {
  id: string;
  type: 'assignment' | 'payment' | 'exam' | 'attendance' | 'event';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
  };
  status: 'pending' | 'completed' | 'upcoming';
}

// Mock data - replace with actual API calls
const mockKPIData: KPIData = {
  students: {
    total: 1250,
    trend: 5.2,
    trendLabel: 'vs last month',
  },
  attendance: {
    value: '85%',
    trend: -2.1,
    trendLabel: 'vs last week',
    progress: 85,
  },
  assignments: {
    total: 45,
    completed: 38,
    progress: 84,
  },
  fees: {
    collected: '$125,000',
    trend: 12.5,
    trendLabel: 'vs last month',
    progress: 75,
  },
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'assignment',
    title: 'New Assignment Posted',
    description: 'Mathematics Assignment 3 has been posted',
    timestamp: '2024-01-15T10:30:00Z',
    user: {
      name: 'Prof. Smith',
    },
    status: 'pending',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Fee Payment Received',
    description: 'Semester fee payment processed successfully',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'exam',
    title: 'Exam Results Published',
    description: 'Mid-term examination results are now available',
    timestamp: '2024-01-14T15:45:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'attendance',
    title: 'Attendance Updated',
    description: 'Your attendance for today has been marked',
    timestamp: '2024-01-14T08:30:00Z',
    status: 'completed',
  },
  {
    id: '5',
    type: 'event',
    title: 'New Event Scheduled',
    description: 'Annual Sports Day scheduled for next month',
    timestamp: '2024-01-13T11:20:00Z',
    status: 'upcoming',
  },
];

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useSupabaseAuth();
  const [dateRange, setDateRange] = useState('This Month');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateRangeClose = (range?: string) => {
    if (range) {
      setDateRange(range);
    }
    setAnchorEl(null);
  };

  return (
      <Box sx={{ p: 3 }}>
        {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.first_name || 'User'}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            startIcon={<DateRangeIcon />}
            onClick={handleDateRangeClick}
          >
            {dateRange}
            </Button>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleDateRangeClose()}
          >
            <MenuItem onClick={() => handleDateRangeClose('Today')}>Today</MenuItem>
            <MenuItem onClick={() => handleDateRangeClose('This Week')}>This Week</MenuItem>
            <MenuItem onClick={() => handleDateRangeClose('This Month')}>This Month</MenuItem>
            <MenuItem onClick={() => handleDateRangeClose('This Year')}>This Year</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Students"
            value={mockKPIData.students.total}
            trend={mockKPIData.students.trend}
            trendLabel={mockKPIData.students.trendLabel}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Attendance Rate"
            value={mockKPIData.attendance.value}
            trend={mockKPIData.attendance.trend}
            trendLabel={mockKPIData.attendance.trendLabel}
            progress={mockKPIData.attendance.progress}
            icon={<EventIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Assignments"
            value={`${mockKPIData.assignments.completed}/${mockKPIData.assignments.total}`}
            description="Completed assignments"
            progress={mockKPIData.assignments.progress}
            icon={<AssignmentIcon />}
            color="success"
                />
              </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Fees Collected"
            value={mockKPIData.fees.collected}
            trend={mockKPIData.fees.trend}
            trendLabel={mockKPIData.fees.trendLabel}
            progress={mockKPIData.fees.progress}
            icon={<PaymentIcon />}
            color="info"
                />
              </Grid>
            </Grid>

      {/* Charts and Activity Feed */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
          <Grid item xs={12}>
              <ChartCard
                title="Academic Performance"
                subtitle="Student performance across subjects"
                chart={<div style={{ height: 300 }}>Chart placeholder</div>}
                onRefresh={() => console.log('Refreshing chart...')}
                onDownload={() => console.log('Downloading chart...')}
            />
          </Grid>
          <Grid item xs={12}>
              <ChartCard
                title="Attendance Trends"
                subtitle="Daily attendance statistics"
                chart={<div style={{ height: 300 }}>Chart placeholder</div>}
                onRefresh={() => console.log('Refreshing chart...')}
                onDownload={() => console.log('Downloading chart...')}
            />
          </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
            <ActivityFeed
            activities={mockActivities}
            title="Recent Activities"
            onSeeAll={() => console.log('Viewing all activities...')}
            />
          </Grid>
        </Grid>
      </Box>
  );
};

export default DashboardPage;