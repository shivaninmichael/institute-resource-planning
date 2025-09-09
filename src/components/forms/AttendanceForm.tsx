import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PresentIcon from '@mui/icons-material/CheckCircle';
import AbsentIcon from '@mui/icons-material/Cancel';
import LateIcon from '@mui/icons-material/Schedule';
import ExcusedIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import TodayIcon from '@mui/icons-material/Today';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceApi, courseApi, studentApi, classApi } from '../../services/api';
import { Attendance, AttendanceStatus, Course, Student, Class } from '../../types';

interface AttendanceFormData {
  date: Date | null;
  course_id: string;
  class_id: string;
  type: 'daily' | 'class';
  remarks: string;
  students: {
    student_id: string;
    status: AttendanceStatus;
    time_in: Date | null;
    time_out: Date | null;
    remarks: string;
  }[];
}

const AttendanceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [bulkAction, setBulkAction] = useState<AttendanceStatus>('present');
  const [bulkMode, setBulkMode] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AttendanceFormData>({
    defaultValues: {
      date: new Date(),
      course_id: '',
      class_id: '',
      type: 'daily',
      remarks: '',
      students: [],
    },
  });

  const watchedCourse = watch('course_id');
  const watchedType = watch('type');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (watchedCourse) {
      loadCourseStudents(watchedCourse);
      if (watchedType === 'class') {
        loadCourseClasses(watchedCourse);
      }
    }
  }, [watchedCourse, watchedType]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [coursesResponse, studentsResponse] = await Promise.all([
        courseApi.getCourses(),
        courseApi.getCourses()
      ]);
      
      setCourses(coursesResponse.data);
      setStudents(studentsResponse.data);

      // Load attendance data if editing
      if (id && id !== 'new') {
        const attendanceResponse = await attendanceApi.getAttendanceSheet(parseInt(id));
        const attendanceData = attendanceResponse.data;
        
        // Set form values
        reset({
          date: attendanceData.date ? new Date(attendanceData.date) : new Date(),
          course_id: attendanceData.course_id || '',
          class_id: attendanceData.class_id || '',
          type: attendanceData.type || 'daily',
          remarks: attendanceData.remarks || '',
          students: attendanceData.students || [],
        });
      }
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseStudents = async (courseId: string) => {
    try {
      const response = await studentApi.getStudentsByCourse(parseInt(courseId));
      const courseStudents = response.data.map((student: Student) => ({
        student_id: student.id,
        student_name: `${student.first_name} ${student.last_name}`,
        student_number: (student as any).student_id || student.id,
        status: 'present' as AttendanceStatus,
        time_in: new Date(),
        time_out: null,
        remarks: '',
      }));
      setSelectedStudents(courseStudents);
      setValue('students', courseStudents);
    } catch (err) {
      console.error('Error loading course students:', err);
    }
  };

  const loadCourseClasses = async (courseId: string) => {
    try {
      const response = await classApi.getByCourse(courseId);
      setClasses(response.data);
    } catch (err) {
      console.error('Error loading course classes:', err);
    }
  };

  const handleStudentStatusChange = (index: number, status: AttendanceStatus) => {
    const updatedStudents = [...selectedStudents];
    updatedStudents[index].status = status;
    
    // Set time_in for present/late status
    if (status === 'present' || status === 'late') {
      updatedStudents[index].time_in = new Date();
    }
    
    setSelectedStudents(updatedStudents);
    setValue('students', updatedStudents);
  };

  const handleBulkStatusChange = () => {
    const updatedStudents = selectedStudents.map(student => ({
      ...student,
      status: bulkAction,
      time_in: (bulkAction === 'present' || bulkAction === 'late') ? new Date() : student.time_in,
    }));
    setSelectedStudents(updatedStudents);
    setValue('students', updatedStudents);
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
      case 'excused': return <ExcusedIcon />;
      default: return null;
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      setSaving(true);
      setError(null);

      const attendanceData = {
        ...data,
        date: data.date?.toISOString().split('T')[0],
        students: data.students.map(student => ({
          ...student,
          time_in: student.time_in?.toISOString(),
          time_out: student.time_out?.toISOString(),
        })),
      };

      if (id && id !== 'new') {
        await (attendanceApi as any).update(parseInt(id), attendanceData);
      } else {
        await attendanceApi.createAttendanceSheet(attendanceData);
      }

      navigate('/attendance');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save attendance');
      console.error('Error saving attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            {id === 'new' ? 'Mark Attendance' : 'Edit Attendance'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/attendance')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving || !isDirty}
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<TodayIcon />}
                  title="Attendance Details"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="date"
                        control={control}
                        rules={{ required: 'Date is required' }}
                        render={({ field }) => (
                          <DatePicker
                            label="Date"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.date,
                                helperText: errors.date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'Type is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.type}>
                            <InputLabel>Attendance Type</InputLabel>
                            <Select {...field} label="Attendance Type">
                              <MenuItem value="daily">Daily Attendance</MenuItem>
                              <MenuItem value="class">Class Attendance</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="course_id"
                        control={control}
                        rules={{ required: 'Course is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.course_id}>
                            <InputLabel>Course</InputLabel>
                            <Select {...field} label="Course">
                              {courses.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                  {course.code} - {course.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    {watchedType === 'class' && (
                      <Grid item xs={12} md={3}>
                        <Controller
                          name="class_id"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.class_id}>
                              <InputLabel>Class Session</InputLabel>
                              <Select {...field} label="Class Session">
                                {classes.map((classSession) => (
                                  <MenuItem key={classSession.id} value={classSession.id}>
                                    {classSession.name} - {classSession.schedule}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Controller
                        name="remarks"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="General Remarks"
                            multiline
                            rows={2}
                            error={!!errors.remarks}
                            helperText={errors.remarks?.message}
                            placeholder="Any general notes about this attendance session..."
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Student Attendance */}
            {selectedStudents.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    avatar={<GroupIcon />}
                    title="Student Attendance"
                    action={
                      <FormControlLabel
                        control={
                          <Switch
                            checked={bulkMode}
                            onChange={(e) => setBulkMode(e.target.checked)}
                          />
                        }
                        label="Bulk Mode"
                      />
                    }
                  />
                  <CardContent>
                    {bulkMode && (
                      <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                              <InputLabel>Bulk Status</InputLabel>
                              <Select
                                value={bulkAction}
                                label="Bulk Status"
                                onChange={(e) => setBulkAction(e.target.value as AttendanceStatus)}
                              >
                                <MenuItem value="present">Present</MenuItem>
                                <MenuItem value="absent">Absent</MenuItem>
                                <MenuItem value="late">Late</MenuItem>
                                <MenuItem value="excused">Excused</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Button
                              variant="outlined"
                              onClick={handleBulkStatusChange}
                              fullWidth
                            >
                              Apply to All Students
                            </Button>
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                      </Box>
                    )}

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Time In</TableCell>
                            <TableCell>Time Out</TableCell>
                            <TableCell>Remarks</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedStudents.map((student, index) => (
                            <TableRow key={student.student_id}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {student.student_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {student.student_number}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                  <Select
                                    value={student.status}
                                    onChange={(e) => handleStudentStatusChange(index, e.target.value as AttendanceStatus)}
                                    renderValue={(value) => (
                                      <Chip
                                        icon={getStatusIcon(value) || undefined}
                                        label={value.toUpperCase()}
                                        color={getStatusColor(value) as any}
                                        size="small"
                                      />
                                    )}
                                  >
                                    <MenuItem value="present">
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PresentIcon color="success" />
                                        Present
                                      </Box>
                                    </MenuItem>
                                    <MenuItem value="absent">
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AbsentIcon color="error" />
                                        Absent
                                      </Box>
                                    </MenuItem>
                                    <MenuItem value="late">
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LateIcon color="warning" />
                                        Late
                                      </Box>
                                    </MenuItem>
                                    <MenuItem value="excused">
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ExcusedIcon color="info" />
                                        Excused
                                      </Box>
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell>
                                <TimePicker
                                  label="Time In"
                                  value={student.time_in}
                                  onChange={(newValue) => {
                                    const updatedStudents = [...selectedStudents];
                                    updatedStudents[index].time_in = newValue;
                                    setSelectedStudents(updatedStudents);
                                    setValue('students', updatedStudents);
                                  }}
                                  slotProps={{
                                    textField: {
                                      size: 'small',
                                      disabled: student.status === 'absent',
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TimePicker
                                  label="Time Out"
                                  value={student.time_out}
                                  onChange={(newValue) => {
                                    const updatedStudents = [...selectedStudents];
                                    updatedStudents[index].time_out = newValue;
                                    setSelectedStudents(updatedStudents);
                                    setValue('students', updatedStudents);
                                  }}
                                  slotProps={{
                                    textField: {
                                      size: 'small',
                                      disabled: student.status === 'absent',
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  placeholder="Remarks..."
                                  value={student.remarks}
                                  onChange={(e) => {
                                    const updatedStudents = [...selectedStudents];
                                    updatedStudents[index].remarks = e.target.value;
                                    setSelectedStudents(updatedStudents);
                                    setValue('students', updatedStudents);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceForm;
