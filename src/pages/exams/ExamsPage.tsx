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
import ExamIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GradeIcon from '@mui/icons-material/Grade';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';
import { Exam, Course, ExamStatus, ExamType } from '../../types';

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
      id={`exam-tabpanel-${index}`}
      aria-labelledby={`exam-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ExamType | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadExams();
  }, [page, rowsPerPage, searchTerm, statusFilter, typeFilter, courseFilter, dateFilter, tabValue]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('exam_sessions')
        .select(`
          *,
          courses!inner(*)
        `)
        .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

      // Apply filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }
      if (courseFilter !== 'all') {
        query = query.eq('course_id', courseFilter);
      }
      if (dateFilter) {
        query = query.eq('exam_date', dateFilter.toISOString().split('T')[0]);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setExams(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load exams data');
      console.error('Error loading exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!examToDelete) return;

    try {
      const { error } = await supabase
        .from('exam_sessions')
        .delete()
        .eq('id', examToDelete.id);

      if (error) throw error;

      setExams(exams.filter(e => e.id !== examToDelete.id));
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    } catch (err) {
      setError('Failed to delete exam');
      console.error('Error deleting exam:', err);
    }
  };

  const openDeleteDialog = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };

  const getStatusColor = (status: ExamStatus) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'midterm': '#1976d2',
      'final': '#d32f2f',
      'quiz': '#388e3c',
      'assignment': '#f57c00',
      'practical': '#7b1fa2',
      'viva': '#00796b',
    };
    return colors[type] || '#757575';
  };

  const calculateExamStats = () => {
    const total = exams.length;
    const scheduled = exams.filter(e => e.status === 'scheduled').length;
    const ongoing = exams.filter(e => e.status === 'ongoing').length;
    const completed = exams.filter(e => e.status === 'completed').length;
    const cancelled = exams.filter(e => e.status === 'cancelled').length;
    
    return { total, scheduled, ongoing, completed, cancelled };
  };

  const stats = calculateExamStats();

  if (loading && exams.length === 0) {
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
            Exam Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/exams/new')}
            disabled={!user?.permissions?.includes('exam.create' as any)}
          >
            Schedule Exam
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Exam Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ExamIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Exams
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.scheduled}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.ongoing}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ongoing
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <GradeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.completed}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ExamIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.cancelled}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Exam Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab 
              label={
                <Badge badgeContent={stats.total} color="primary">
                  All Exams
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={stats.scheduled} color="info">
                  Scheduled
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={stats.ongoing} color="warning">
                  Ongoing
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={stats.completed} color="success">
                  Completed
                </Badge>
              } 
            />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {/* All Exams Content */}
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2.5}>
                  <TextField
                    fullWidth
                    label="Search Exams"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    placeholder="Search by exam name or code..."
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value as ExamStatus | 'all')}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="ongoing">Ongoing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      label="Type"
                      onChange={(e) => setTypeFilter(e.target.value as ExamType | 'all')}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="midterm">Midterm</MenuItem>
                      <MenuItem value="final">Final</MenuItem>
                      <MenuItem value="quiz">Quiz</MenuItem>
                      <MenuItem value="assignment">Assignment</MenuItem>
                      <MenuItem value="practical">Practical</MenuItem>
                      <MenuItem value="viva">Viva</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2.5}>
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
                <Grid item xs={12} md={1.5}>
                  <DatePicker
                    label="Date"
                    value={dateFilter}
                    onChange={setDateFilter}
                    slotProps={{
                      textField: { fullWidth: true, size: 'small' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={loadExams}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Exams Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Exam</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Total Marks</TableCell>
                    <TableCell>Students</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {exam.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exam.code || ""}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {exam.course_code || ""}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exam.course_name || ""}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                           label={String(exam.type || "midterm").toUpperCase()}
                          size="small"
                          sx={{
                             backgroundColor: getTypeColor(String(exam.type || "midterm")) + '20',
                             color: getTypeColor(String(exam.type || "midterm")),
                            fontWeight: 'medium',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {new Date(exam.exam_date || "").toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exam.start_time} - {exam.end_time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{exam.duration || 0} min</TableCell>
                      <TableCell>{exam.total_marks}</TableCell>
                      <TableCell>
                        <Chip
                          label={exam.enrolled_students || 0 || 0}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={exam.status || "scheduled".toUpperCase()}
                          color={getStatusColor(exam.status || "scheduled") as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/exams/${exam.id}`)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/exams/${exam.id}/edit`)}
                            color="primary"
                            disabled={!user?.permissions?.includes('exam.update' as any)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(exam)}
                            color="error"
                            disabled={!user?.permissions?.includes('exam.delete' as any)}
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
              count={exams.length}
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
          {/* Scheduled Exams */}
          <Typography variant="h6" gutterBottom>
            Scheduled Exams
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Exams that are scheduled but not yet started.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Ongoing Exams */}
          <Typography variant="h6" gutterBottom>
            Ongoing Exams
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Exams currently in progress.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Completed Exams */}
          <Typography variant="h6" gutterBottom>
            Completed Exams
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Exams that have been completed and results are available.
          </Alert>
        </TabPanel>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Exam</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the exam{' '}
              <strong>{examToDelete?.name}</strong>? This action cannot be undone and will
              affect all associated results and data.
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

export default ExamsPage;

