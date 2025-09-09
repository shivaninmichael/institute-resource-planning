// =====================================================
// Reports Page Component
// Main page for all reports and analytics
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import AcademicPerformanceReport from '../../components/reports/AcademicPerformanceReport';
import AttendanceReport from '../../components/reports/AttendanceReport';
import FinancialReport from '../../components/reports/FinancialReport';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState('This Month');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateRangeClose = (range?: string) => {
    if (range) {
      setDateRange(range);
    }
    setAnchorEl(null);
  };

  const handleExport = () => {
    console.log('Exporting report...');
  };

  const handlePrint = () => {
    console.log('Printing report...');
  };

  const handleShare = () => {
    console.log('Sharing report...');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
        <Box display="flex" gap={1}>
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
            <MenuItem onClick={() => handleDateRangeClose('Custom Range')}>Custom Range</MenuItem>
          </Menu>
          <Tooltip title="Export">
            <IconButton onClick={handleExport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      {user?.roles?.some((role: any) => role.name === 'admin') && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Student</InputLabel>
              <Select
                value={selectedStudent}
                label="Student"
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <MenuItem value="">All Students</MenuItem>
                <MenuItem value="1">John Doe</MenuItem>
                <MenuItem value="2">Jane Smith</MenuItem>
                <MenuItem value="3">Mike Johnson</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <MenuItem value="">All Courses</MenuItem>
                <MenuItem value="cs101">Computer Science 101</MenuItem>
                <MenuItem value="math101">Mathematics 101</MenuItem>
                <MenuItem value="phy101">Physics 101</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {/* Report Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Academic Performance" />
          <Tab label="Attendance" />
          <Tab label="Financial" />
        </Tabs>
      </Paper>

      {/* Report Content */}
      <TabPanel value={currentTab} index={0}>
        <AcademicPerformanceReport
          studentId={selectedStudent}
          courseId={selectedCourse}
          onExport={handleExport}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <AttendanceReport
          studentId={selectedStudent}
          courseId={selectedCourse}
          onExport={handleExport}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <FinancialReport
          studentId={selectedStudent}
          courseId={selectedCourse}
          onExport={handleExport}
        />
      </TabPanel>
    </Box>
  );
};

export default ReportsPage;
