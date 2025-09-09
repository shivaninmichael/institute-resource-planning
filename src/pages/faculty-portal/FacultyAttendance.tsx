// =====================================================
// OpenEducat ERP Frontend - Faculty Attendance Management
// Faculty tools for marking and managing attendance
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import PresentIcon from '@mui/icons-material/CheckCircle';
import AbsentIcon from '@mui/icons-material/Cancel';
import LateIcon from '@mui/icons-material/AccessTime';
import ExcusedIcon from '@mui/icons-material/EventAvailable';
import SaveIcon from '@mui/icons-material/Save';
import ViewIcon from '@mui/icons-material/Visibility';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  students: Student[];
}

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const FacultyAttendance: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [bulkAction, setBulkAction] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [remarksDialog, setRemarksDialog] = useState<{
    open: boolean;
    studentId: string;
    studentName: string;
    remarks: string;
  }>({ open: false, studentId: '', studentName: '', remarks: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      loadExistingAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getFacultyCourses(user?.id?.toString() || '');
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].id);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAttendance = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getAttendanceForDate(
        selectedCourse,
        selectedDate.toISOString().split('T')[0]
      );
      
      if (response.data && response.data.length > 0) {
        setAttendanceRecords(response.data);
      } else {
        // Initialize attendance records for all students in the course
        const course = courses.find(c => c.id === selectedCourse);
        if (course) {
          const initialRecords = course.students.map(student => ({
            studentId: student.id,
            status: 'present' as const,
            remarks: '',
          }));
          setAttendanceRecords(initialRecords);
        }
      }
      setError(null);
    } catch (err) {
      setError('Failed to load existing attendance');
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId
          ? { ...record, status }
          : record
      )
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId
          ? { ...record, remarks }
          : record
      )
    );
  };

  const handleBulkAction = () => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        selectedStudents.includes(record.studentId)
          ? { ...record, status: bulkAction }
          : record
      )
    );
    setSelectedStudents([]);
  };

  const handleSelectAll = (checked: boolean) => {
    const course = courses.find(c => c.id === selectedCourse);
    if (course) {
      setSelectedStudents(checked ? course.students.map(s => s.id) : []);
    }
  };

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    setSelectedStudents(prev =>
      checked
        ? [...prev, studentId]
        : prev.filter(id => id !== studentId)
    );
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);
      await facultyApi.markAttendance({
        courseId: selectedCourse,
        date: selectedDate.toISOString().split('T')[0],
        records: attendanceRecords,
      });
      
      alert('Attendance saved successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to save attendance');
      console.error('Error saving attendance:', err);
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

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const isAllSelected = selectedCourseData ? 
    selectedStudents.length === selectedCourseData.students.length : false;
  const isIndeterminate = selectedStudents.length > 0 && !isAllSelected;

  if (loading && courses.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Attendance Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Selection Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={selectedCourse}
                    label="Course"
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(date) => date && setSelectedDate(date)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveAttendance}
                  disabled={loading || !selectedCourse || attendanceRecords.length === 0}
                >
                  Save Attendance
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Attendance Tabs */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Mark Attendance" />
            <Tab label="View Reports" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {selectedCourseData && (
              <Box sx={{ p: 3 }}>
                {/* Bulk Actions */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography variant="subtitle2">
                        Bulk Actions:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Action</InputLabel>
                        <Select
                          value={bulkAction}
                          label="Action"
                          onChange={(e) => setBulkAction(e.target.value as any)}
                        >
                          <MenuItem value="present">Present</MenuItem>
                          <MenuItem value="absent">Absent</MenuItem>
                          <MenuItem value="late">Late</MenuItem>
                          <MenuItem value="excused">Excused</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={handleBulkAction}
                        disabled={selectedStudents.length === 0}
                      >
                        Apply to Selected ({selectedStudents.length})
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* Students Table */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={isIndeterminate}
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCourseData.students.map((student) => {
                        const record = attendanceRecords.find(r => r.studentId === student.id);
                        const isSelected = selectedStudents.includes(student.id);
                        
                        return (
                          <TableRow key={student.id} hover>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                              />
                            </TableCell>
                            <TableCell>{student.studentId}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                                  <Chip
                                    key={status}
                                    icon={getStatusIcon(status)}
                                    label={status.toUpperCase()}
                                    color={getStatusColor(status) as any}
                                    variant={record?.status === status ? 'filled' : 'outlined'}
                                    clickable
                                    size="small"
                                    onClick={() => handleStatusChange(student.id, status)}
                                  />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                placeholder="Add remarks..."
                                value={record?.remarks || ''}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                sx={{ minWidth: 200 }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Attendance Reports
              </Typography>
              <Alert severity="info">
                Attendance reports and analytics will be displayed here.
              </Alert>
            </Box>
          </TabPanel>
        </Card>

        {/* Remarks Dialog */}
        <Dialog
          open={remarksDialog.open}
          onClose={() => setRemarksDialog({ open: false, studentId: '', studentName: '', remarks: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Add Remarks for {remarksDialog.studentName}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks"
              value={remarksDialog.remarks}
              onChange={(e) => setRemarksDialog(prev => ({ ...prev, remarks: e.target.value }))}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemarksDialog({ open: false, studentId: '', studentName: '', remarks: '' })}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleRemarksChange(remarksDialog.studentId, remarksDialog.remarks);
                setRemarksDialog({ open: false, studentId: '', studentName: '', remarks: '' });
              }}
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default FacultyAttendance;
