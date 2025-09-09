// =====================================================
// OpenEducat ERP Frontend - Table Section Component
// Displays a group of related data tables
// =====================================================

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import TableCard from './TableCard';
import { DashboardData } from '../../types/dashboard';

interface TableSectionProps {
  title: string;
  tables: DashboardData['tables'];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onDownload?: (tableId: string) => void;
  onFullscreen?: (tableId: string) => void;
}

const TableSection: React.FC<TableSectionProps> = ({
  title,
  tables,
  isLoading = false,
  error = null,
  onRefresh,
  onDownload,
  onFullscreen,
}) => {
  const theme = useTheme();

  // Common column configurations
  const getStatusChip = (status: string) => {
    let color: 'success' | 'error' | 'warning' | 'default';
    let IconComponent: React.ComponentType;

    switch (status.toLowerCase()) {
      case 'active':
      case 'present':
      case 'paid':
        color = 'success';
        IconComponent = CheckCircleIcon;
        break;
      case 'inactive':
      case 'absent':
      case 'unpaid':
        color = 'error';
        IconComponent = CancelIcon;
        break;
      default:
        color = 'warning';
        IconComponent = WarningIcon;
    }

    return (
      <Chip
        icon={<IconComponent />}
        label={status}
        size="small"
        color={color}
      />
    );
  };

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

      <Grid container spacing={3}>
        {/* Recent Admissions */}
        <Grid item xs={12} md={6} component="div">
          <TableCard
            {...tables.recentAdmissions}
            isLoading={isLoading}
            error={error}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('recent-admissions')}
            onFullscreen={() => onFullscreen?.('recent-admissions')}
            columns={[
              {
                field: 'avatar',
                headerName: '',
                width: 60,
                renderCell: (params) => (
                  <Avatar src={params.value} alt={params.row.name}>
                    {params.row.name.charAt(0)}
                  </Avatar>
                ),
              },
              {
                field: 'name',
                headerName: 'Student Name',
                flex: 1,
                renderCell: (params) => (
                  <Box>
                    <Typography variant="body2" noWrap>
                      {params.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {params.row.studentId}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: 'course',
                headerName: 'Course',
                flex: 1,
              },
              {
                field: 'admissionDate',
                headerName: 'Date',
                width: 120,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {new Date(params.value).toLocaleDateString()}
                  </Typography>
                ),
              },
              {
                field: 'status',
                headerName: 'Status',
                width: 120,
                renderCell: (params) => getStatusChip(params.value),
              },
            ]}
          />
        </Grid>

        {/* Upcoming Exams */}
        <Grid item xs={12} md={6} component="div">
          <TableCard
            {...tables.upcomingExams}
            isLoading={isLoading}
            error={error}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('upcoming-exams')}
            onFullscreen={() => onFullscreen?.('upcoming-exams')}
            columns={[
              {
                field: 'examName',
                headerName: 'Exam',
                flex: 1,
                renderCell: (params) => (
                  <Box>
                    <Typography variant="body2" noWrap>
                      {params.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {params.row.course}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: 'date',
                headerName: 'Date',
                width: 120,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {new Date(params.value).toLocaleDateString()}
                  </Typography>
                ),
              },
              {
                field: 'time',
                headerName: 'Time',
                width: 100,
              },
              {
                field: 'students',
                headerName: 'Students',
                width: 100,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {params.value}
                  </Typography>
                ),
              },
              {
                field: 'status',
                headerName: 'Status',
                width: 120,
                renderCell: (params) => getStatusChip(params.value),
              },
            ]}
          />
        </Grid>

        {/* Pending Fees */}
        <Grid item xs={12} md={6} component="div">
          <TableCard
            {...tables.pendingFees}
            isLoading={isLoading}
            error={error}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('pending-fees')}
            onFullscreen={() => onFullscreen?.('pending-fees')}
            columns={[
              {
                field: 'studentName',
                headerName: 'Student',
                flex: 1,
                renderCell: (params) => (
                  <Box>
                    <Typography variant="body2" noWrap>
                      {params.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {params.row.studentId}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: 'amount',
                headerName: 'Amount',
                width: 120,
                renderCell: (params) => (
                  <Typography variant="body2">
                    ${params.value.toFixed(2)}
                  </Typography>
                ),
              },
              {
                field: 'dueDate',
                headerName: 'Due Date',
                width: 120,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {new Date(params.value).toLocaleDateString()}
                  </Typography>
                ),
              },
              {
                field: 'status',
                headerName: 'Status',
                width: 120,
                renderCell: (params) => getStatusChip(params.value),
              },
            ]}
          />
        </Grid>

        {/* Faculty Attendance */}
        <Grid item xs={12} md={6} component="div">
          <TableCard
            {...tables.facultyAttendance}
            isLoading={isLoading}
            error={error}
            onRefresh={onRefresh}
            onDownload={() => onDownload?.('faculty-attendance')}
            onFullscreen={() => onFullscreen?.('faculty-attendance')}
            columns={[
              {
                field: 'avatar',
                headerName: '',
                width: 60,
                renderCell: (params) => (
                  <Avatar src={params.value} alt={params.row.name}>
                    {params.row.name.charAt(0)}
                  </Avatar>
                ),
              },
              {
                field: 'name',
                headerName: 'Faculty Name',
                flex: 1,
                renderCell: (params) => (
                  <Box>
                    <Typography variant="body2" noWrap>
                      {params.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {params.row.department}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: 'timeIn',
                headerName: 'Time In',
                width: 100,
              },
              {
                field: 'timeOut',
                headerName: 'Time Out',
                width: 100,
              },
              {
                field: 'status',
                headerName: 'Status',
                width: 120,
                renderCell: (params) => getStatusChip(params.value),
              },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableSection;

