import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import PresentIcon from '@mui/icons-material/CheckCircle';
import AbsentIcon from '@mui/icons-material/Cancel';
import LateIcon from '@mui/icons-material/Schedule';
import EventIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceApi, courseApi, studentApi } from '../../services/api';
import { Course, Student, Attendance, AttendanceStatus } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState<Attendance | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [page, rowsPerPage, searchTerm, statusFilter, courseFilter, dateFilter, tabValue]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, studentsResponse] = await Promise.all([
        courseApi.getCourses(),
        studentApi.getStudents()
      ]);
      setCourses(coursesResponse.data);
      setStudents(studentsResponse.data);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceApi.getAttendanceRegisters({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        course_id: courseFilter !== 'all' ? courseFilter : undefined,
        date: dateFilter?.toISOString().split('T')[0],
        type: tabValue === 0 ? 'daily' : tabValue === 1 ? 'class' : undefined,
      });
      setAttendance(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!attendanceToDelete) return;

    try {
      await attendanceApi.deleteAttendanceSheet(attendanceToDelete.id);
      setAttendance(attendance.filter(a => a.id !== attendanceToDelete.id));
      setDeleteDialogOpen(false);
      setAttendanceToDelete(null);
    } catch (err) {
      setError('Failed to delete attendance record');
      console.error('Error deleting attendance:', err);
    }
  };

  const openDeleteDialog = (attendance: Attendance) => {
    setAttendanceToDelete(attendance);
    setDeleteDialogOpen(true);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return <PresentIcon />;
      case 'absent': return <AbsentIcon />;
      case 'late': return <LateIcon />;
      case 'excused': return <EventIcon />;
      default: return <PersonIcon />;
    }
  };

  const calculateAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    
    return { total, present, absent, late, excused };
  };

  const stats = calculateAttendanceStats();

  if (loading && attendance.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Attendance Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/attendance/new')}
            disabled={!user?.permissions?.includes('attendance.create' as any)}
          >
            Mark Attendance
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Attendance Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Records
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PresentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.present}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Present
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <AbsentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.absent}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Absent
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <LateIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.late}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Late
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.excused}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Excused
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab 
              label={
                <Badge badgeContent={stats.total} color="primary">
                  Daily Attendance
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={attendance.filter(a => a.class_id).length} color="secondary">
                  Class Attendance
                </Badge>
              } 
            />
            <Tab label="Reports" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {/* Daily Attendance Content */}
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Search Students"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    placeholder="Search by student name or ID..."
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    label="Date"
                    value={dateFilter}
                    onChange={setDateFilter}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | 'all')}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                      <MenuItem value="excused">Excused</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={courseFilter}
                      label="Course"
                      onChange={(e) => setCourseFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Courses</MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={loadAttendance}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time In</TableCell>
                    <TableCell>Time Out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {record.student_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.student_id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {record.course_code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.course_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {record.time_in ? new Date(record.time_in).toLocaleTimeString() : '-'}
                      </TableCell>
                      <TableCell>
                        {record.time_out ? new Date(record.time_out).toLocaleTimeString() : '-'}
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
                        <Typography variant="body2" noWrap>
                          {record.remarks || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/attendance/${record.id}`)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/attendance/${record.id}/edit`)}
                            color="primary"
                            disabled={!user?.permissions?.includes('attendance.update' as any)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(record)}
                            color="error"
                            disabled={!user?.permissions?.includes('attendance.delete' as any)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={attendance.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Class Attendance Content */}
          <Typography variant="h6" gutterBottom>
            Class-wise Attendance
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Class attendance tracking for specific courses and sessions.
          </Alert>
          {/* Similar table structure but filtered for class attendance */}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Reports Content */}
          <Typography variant="h6" gutterBottom>
            Attendance Reports
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Generate monthly attendance reports for students and courses.
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Student Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Individual student attendance analysis and trends.
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Course Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Course-wise attendance statistics and patterns.
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Attendance Record</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this attendance record for{' '}
              <strong>{attendanceToDelete?.student_name}</strong>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendancePage;

