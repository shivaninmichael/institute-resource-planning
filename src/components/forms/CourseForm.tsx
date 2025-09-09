import React, { useState, useEffect } from 'react';
import { Course, Department, Faculty } from '../../types';
import { CourseLevel, CourseStatus } from '../../types/enums';
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
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { courseApi, departmentApi, facultyApi } from '../../services/api';
// import { CourseStatus } from '../../types';

interface CourseFormData {
  code: string;
  name: string;
  description: string;
  department_id: string;
  level: CourseLevel;
  credits: number;
  duration_hours: number;
  max_students: number;
  min_students: number;
  prerequisites: string;
  syllabus: string;
  objectives: string;
  status: CourseStatus;
  start_date: Date | null;
  end_date: Date | null;
  instructor_id: string;
  is_elective: boolean;
  is_practical: boolean;
  practical_hours: number;
  theory_hours: number;
  fee: number;
}

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CourseFormData>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      department_id: '',
      level: 'beginner',
      credits: 1,
      duration_hours: 0,
      max_students: 50,
      min_students: 5,
      prerequisites: '',
      syllabus: '',
      objectives: '',
      status: 'draft',
      start_date: null,
      end_date: null,
      instructor_id: '',
      is_elective: false,
      is_practical: false,
      practical_hours: 0,
      theory_hours: 0,
      fee: 0,
    },
  });

  const watchedIsPractical = watch('is_practical');
  const watchedDepartment = watch('department_id');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (watchedDepartment) {
      loadDepartmentFaculty(watchedDepartment);
    }
  }, [watchedDepartment]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load departments
      const departmentsResponse = await departmentApi.getDepartments();
      setDepartments(departmentsResponse.data);

      // Load all faculty
      const facultyResponse = await facultyApi.getCourses();
      setFaculty(facultyResponse.data);

      // Load course data if editing
      if (id && id !== 'new') {
        const courseResponse = await courseApi.getCourse(parseInt(id));
        const courseData = courseResponse.data;
        setCourse(courseData);
        
        // Set form values
        reset({
          code: courseData.code,
          name: courseData.name,
          description: courseData.description,
          department_id: courseData.department_id,
          level: courseData.level,
          credits: courseData.credits,
          duration_hours: courseData.duration_hours,
          max_students: courseData.max_students,
          min_students: courseData.min_students,
          prerequisites: courseData.prerequisites || '',
          syllabus: courseData.syllabus || '',
          objectives: courseData.objectives || '',
          status: courseData.status,
          start_date: courseData.start_date ? new Date(courseData.start_date) : null,
          end_date: courseData.end_date ? new Date(courseData.end_date) : null,
          instructor_id: courseData.instructor_id || '',
          is_elective: courseData.is_elective || false,
          is_practical: courseData.is_practical || false,
          practical_hours: courseData.practical_hours || 0,
          theory_hours: courseData.theory_hours || 0,
          fee: courseData.fee || 0,
        });
      }
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartmentFaculty = async (departmentId: string) => {
    try {
      const facultyResponse = await facultyApi.getFacultyByDepartment(parseInt(departmentId));
      setFaculty(facultyResponse.data);
    } catch (err) {
      console.error('Error loading department faculty:', err);
    }
  };

  const onSubmit: SubmitHandler<CourseFormData> = async (data) => {
    try {
      setSaving(true);
      setError(null);

      const courseData = {
        ...data,
        start_date: data.start_date?.toISOString(),
        end_date: data.end_date?.toISOString(),
      };

      if (id && id !== 'new') {
        await courseApi.updateCourse(parseInt(id), courseData);
      } else {
        await courseApi.createCourse(courseData);
      }

      navigate('/courses');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course');
      console.error('Error saving course:', err);
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
            {id === 'new' ? 'Add New Course' : 'Edit Course'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/courses')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving || !isDirty}
            >
              {saving ? 'Saving...' : 'Save'}
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
                  avatar={<SchoolIcon />}
                  title="Basic Information"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="code"
                        control={control}
                        rules={{ required: 'Course code is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Course Code"
                            error={!!errors.code}
                            helperText={errors.code?.message}
                            placeholder="e.g., CS101"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Course name is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Course Name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="department_id"
                        control={control}
                        rules={{ required: 'Department is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.department_id}>
                            <InputLabel>Department</InputLabel>
                            <Select {...field} label="Department">
                              {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="level"
                        control={control}
                        rules={{ required: 'Level is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.level}>
                            <InputLabel>Level</InputLabel>
                            <Select {...field} label="Level">
                              <MenuItem value="beginner">Beginner</MenuItem>
                              <MenuItem value="intermediate">Intermediate</MenuItem>
                              <MenuItem value="advanced">Advanced</MenuItem>
                              <MenuItem value="expert">Expert</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Course Configuration */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<AssignmentIcon />}
                  title="Course Configuration"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="credits"
                        control={control}
                        rules={{ required: 'Credits is required', min: { value: 1, message: 'Minimum 1 credit' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Credits"
                            type="number"
                            error={!!errors.credits}
                            helperText={errors.credits?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="duration_hours"
                        control={control}
                        rules={{ required: 'Duration is required', min: { value: 1, message: 'Minimum 1 hour' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Total Duration (Hours)"
                            type="number"
                            error={!!errors.duration_hours}
                            helperText={errors.duration_hours?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="theory_hours"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Theory Hours"
                            type="number"
                            error={!!errors.theory_hours}
                            helperText={errors.theory_hours?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="practical_hours"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Practical Hours"
                            type="number"
                            error={!!errors.practical_hours}
                            helperText={errors.practical_hours?.message}
                            disabled={!watchedIsPractical}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="min_students"
                        control={control}
                        rules={{ required: 'Minimum students is required', min: { value: 1, message: 'Minimum 1 student' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Minimum Students"
                            type="number"
                            error={!!errors.min_students}
                            helperText={errors.min_students?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="max_students"
                        control={control}
                        rules={{ required: 'Maximum students is required', min: { value: 1, message: 'Minimum 1 student' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Maximum Students"
                            type="number"
                            error={!!errors.max_students}
                            helperText={errors.max_students?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="fee"
                        control={control}
                        rules={{ min: { value: 0, message: 'Fee must be positive' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Course Fee"
                            type="number"
                            error={!!errors.fee}
                            helperText={errors.fee?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>Status</InputLabel>
                            <Select {...field} label="Status">
                              <MenuItem value="draft">Draft</MenuItem>
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="inactive">Inactive</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="is_elective"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Elective Course"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="is_practical"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Has Practical Component"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Schedule & Instructor */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<ScheduleIcon />}
                  title="Schedule & Instructor"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Start Date"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.start_date,
                                helperText: errors.start_date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="end_date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="End Date"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.end_date,
                                helperText: errors.end_date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="instructor_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.instructor_id}>
                            <InputLabel>Instructor</InputLabel>
                            <Select {...field} label="Instructor">
                              <MenuItem value="">No Instructor Assigned</MenuItem>
                              {faculty.map((instructor) => (
                                <MenuItem key={instructor.id} value={instructor.id}>
                                  {instructor.first_name} {instructor.last_name} - {instructor.departments?.[0]?.name || 'No department'}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Course Content */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<GroupIcon />}
                  title="Course Content"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="objectives"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Course Objectives"
                            multiline
                            rows={4}
                            error={!!errors.objectives}
                            helperText={errors.objectives?.message}
                            placeholder="List the main learning objectives for this course..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="syllabus"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Syllabus"
                            multiline
                            rows={6}
                            error={!!errors.syllabus}
                            helperText={errors.syllabus?.message}
                            placeholder="Provide detailed syllabus content..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="prerequisites"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Prerequisites"
                            multiline
                            rows={3}
                            error={!!errors.prerequisites}
                            helperText={errors.prerequisites?.message}
                            placeholder="List any prerequisite courses or knowledge required..."
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default CourseForm;

