// =====================================================
// OpenEducat ERP Frontend - Chart Section Component
// Displays a group of related charts
// =====================================================

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Paper,
} from '@mui/material';
import ChartCard from './ChartCard';
import { DashboardData } from '../../types/dashboard';

interface ChartSectionProps {
  title: string;
  charts: DashboardData['charts'];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onDownload?: (chartId: string) => void;
  onFullscreen?: (chartId: string) => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  charts,
  isLoading = false,
  error = null,
  onRefresh,
  onDownload,
  onFullscreen,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'medium',
          color: theme.palette.text.primary,
          mb: 3,
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={3} component={Paper} elevation={0}>
        {/* Student Enrollment Trends */}
        <Grid item xs={12} md={6} component="div">
          <ChartCard
            title="Student Enrollment Trends"
            chart={<div>Chart placeholder</div>}
            loading={isLoading}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('student-enrollment')}
          />
        </Grid>

        {/* Attendance Overview */}
        <Grid item xs={12} md={6} component="div">
          <ChartCard
            title="Attendance Overview"
            chart={<div>Chart placeholder</div>}
            loading={isLoading}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('attendance-overview')}
          />
        </Grid>

        {/* Exam Performance */}
        <Grid item xs={12} md={6} component="div">
          <ChartCard
            title="Exam Performance Analysis"
            chart={<div>Chart placeholder</div>}
            loading={isLoading}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('exam-performance')}
          />
        </Grid>

        {/* Revenue Analysis */}
        <Grid item xs={12} md={6} component="div">
          <ChartCard
            title="Revenue Analysis"
            chart={<div>Chart placeholder</div>}
            loading={isLoading}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('revenue-analysis')}
          />
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} md={6} component="div">
          <ChartCard
            title="Department Distribution"
            chart={<div>Chart placeholder</div>}
            loading={isLoading}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('department-distribution')}
          />
        </Grid>

        {/* Course Completion */}
        <Grid item xs={12} md={6} component="div">
          <ChartCard
            title="Course Completion Rates"
            chart={<div>Chart placeholder</div>}
            loading={isLoading}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('course-completion')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartSection;

