// =====================================================
// OpenEducat ERP Frontend - KPI Section Component
// Displays a group of related KPI cards
// =====================================================

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  useTheme,
  Paper
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryIcon from '@mui/icons-material/LocalLibrary';
import PaymentIcon from '@mui/icons-material/Payment';
import KPICard from './KPICard';
import { DashboardData } from '../../types/dashboard';

interface KPISectionProps {
  title: string;
  kpis: DashboardData['kpis'];
  isLoading?: boolean;
  error?: string | null;
}

const KPISection: React.FC<KPISectionProps> = ({
  title,
  kpis,
  isLoading = false,
  error = null,
}) => {
  const theme = useTheme();

  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((key) => (
        <Grid item xs={12} sm={6} md={3} key={key} component="div">
          <Skeleton
            variant="rectangular"
            height={160}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderKPIs = () => (
    <Grid container spacing={3}>
      {/* Student KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Total Students"
          value={kpis.students.total}
          trend={((kpis.students.newThisMonth / kpis.students.total) * 100)}
          trendLabel={`+${kpis.students.newThisMonth} this month`}
          icon={<SchoolIcon />}
          color="primary"
        />
      </Grid>

      {/* Faculty KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Total Faculty"
          value={kpis.faculty.total}
          trend={kpis.faculty.onLeave > 0 ? -((kpis.faculty.onLeave / kpis.faculty.total) * 100) : ((kpis.faculty.active / kpis.faculty.total) * 100)}
          trendLabel={kpis.faculty.onLeave > 0 ? `${kpis.faculty.onLeave} on leave` : `${kpis.faculty.active} active`}
          icon={<PersonIcon />}
          color="secondary"
        />
      </Grid>

      {/* Course KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Active Courses"
          value={kpis.courses.active}
          trend={((kpis.courses.upcomingStart / kpis.courses.total) * 100)}
          trendLabel={`${kpis.courses.upcomingStart} starting soon`}
          icon={<BookIcon />}
          color="info"
        />
      </Grid>

      {/* Attendance KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Attendance Rate"
          value={`${kpis.attendance.averageRate}%`}
          trend={kpis.attendance.todayLate > 0 ? -((kpis.attendance.todayLate / kpis.attendance.todayPresent) * 100) : ((kpis.attendance.todayPresent - kpis.attendance.todayAbsent) / kpis.attendance.todayPresent * 100)}
          trendLabel={kpis.attendance.todayLate > 0 ? `${kpis.attendance.todayLate} late today` : `${kpis.attendance.todayPresent} present today`}
          icon={<EventNoteIcon />}
          color="success"
        />
      </Grid>

      {/* Exam KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Exam Statistics"
          value={kpis.exams.scheduled}
          trend={((kpis.exams.completed / kpis.exams.scheduled) * 100)}
          trendLabel={`${kpis.exams.completed} completed`}
          icon={<AssignmentIcon />}
          color="warning"
        />
      </Grid>

      {/* Library KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Library Statistics"
          value={kpis.library.booksIssued}
          trend={kpis.library.booksOverdue > 0 ? -((kpis.library.booksOverdue / kpis.library.booksIssued) * 100) : ((kpis.library.booksIssued / kpis.library.totalBooks) * 100)}
          trendLabel={kpis.library.booksOverdue > 0 ? `${kpis.library.booksOverdue} overdue` : `${kpis.library.booksIssued} issued`}
          icon={<LibraryIcon />}
          color="error"
        />
      </Grid>

      {/* Fees KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Fees Collected"
          value={`$${(kpis.fees.totalCollected / 1000).toFixed(1)}k`}
          trend={kpis.fees.overdue > 0 ? -((kpis.fees.overdue / kpis.fees.totalCollected) * 100) : ((kpis.fees.thisMonth / kpis.fees.totalCollected) * 100)}
          trendLabel={kpis.fees.overdue > 0 ? `$${kpis.fees.overdue} overdue` : `$${kpis.fees.thisMonth} this month`}
          icon={<PaymentIcon />}
          color="info"
        />
      </Grid>

      {/* Department KPIs */}
      <Grid item xs={12} sm={6} md={3} component="div">
        <KPICard
          title="Departments"
          value={kpis.faculty.departments}
          icon={<SchoolIcon />}
          color="secondary"
        />
      </Grid>
    </Grid>
  );

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

      {isLoading ? renderSkeleton() : renderKPIs()}
    </Box>
  );
};

export default KPISection;

