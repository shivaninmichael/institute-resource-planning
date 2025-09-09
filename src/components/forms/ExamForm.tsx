import React, { useState, useEffect } from 'react';
import { Exam, Course, Faculty } from '../../types';
import { ExamType, ExamStatus } from '../../types/enums';
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
import ExamIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GradeIcon from '@mui/icons-material/Grade';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { examApi, courseApi, facultyApi } from '../../services/api';
// import { ExamStatus } from '../../types';

interface ExamFormData {
  name: string;
  code: string;
  description: string;
  course_id: string;
  type: ExamType;
  status: ExamStatus;
  exam_date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
  duration: number;
  total_marks: number;
  passing_marks: number;
  instructions: string;
  venue: string;
  supervisor_id: string;
  is_online: boolean;
  online_platform: string;
  online_link: string;
  allow_calculator: boolean;
  allow_notes: boolean;
  negative_marking: boolean;
  negative_marks_per_question: number;
}

const ExamForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ExamFormData>({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      course_id: '',
      type: 'midterm',
      status: 'draft',
      exam_date: null,
      start_time: null,
      end_time: null,
      duration: 60,
      total_marks: 100,
      passing_marks: 40,
      instructions: '',
      venue: '',
      supervisor_id: '',
      is_online: false,
      online_platform: '',
      online_link: '',
      allow_calculator: false,
      allow_notes: false,
      negative_marking: false,
      negative_marks_per_question: 0,
    },
  });

  const watchedIsOnline = watch('is_online');
  const watchedNegativeMarking = watch('negative_marking');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [coursesResponse, facultyResponse] = await Promise.all([
        courseApi.getCourses(),
        facultyApi.getFaculty()
      ]);
      
      setCourses(coursesResponse.data);
      setFaculty(facultyResponse.data);

      // Load exam data if editing
      if (id && id !== 'new') {
        const examResponse = await examApi.getExam(parseInt(id));
        const examData = examResponse.data;
        setExam(examData);
        
        // Set form values
        reset({
          name: examData.name,
          code: examData.code,
          description: examData.description,
          course_id: examData.course_id,
          type: examData.type,
          status: examData.status,
          exam_date: examData.exam_date ? new Date(examData.exam_date) : null,
          start_time: examData.start_time ? new Date(`2000-01-01T${examData.start_time}`) : null,
          end_time: examData.end_time ? new Date(`2000-01-01T${examData.end_time}`) : null,
          duration: examData.duration,
          total_marks: examData.total_marks,
          passing_marks: examData.passing_marks,
          instructions: examData.instructions || '',
          venue: examData.venue || '',
          supervisor_id: examData.supervisor_id || '',
          is_online: examData.is_online || false,
          online_platform: examData.online_platform || '',
          online_link: examData.online_link || '',
          allow_calculator: examData.allow_calculator || false,
          allow_notes: examData.allow_notes || false,
          negative_marking: examData.negative_marking || false,
          negative_marks_per_question: examData.negative_marks_per_question || 0,
        });
      }
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ExamFormData> = async (data) => {
    try {
      setSaving(true);
      setError(null);

      const examData = {
        ...data,
        exam_date: data.exam_date?.toISOString().split('T')[0],
        start_time: data.start_time?.toTimeString().split(' ')[0].substring(0, 5),
        end_time: data.end_time?.toTimeString().split(' ')[0].substring(0, 5),
      };

      if (id && id !== 'new') {
        await examApi.updateExam(parseInt(id), examData);
      } else {
        await examApi.createExam(examData);
      }

      navigate('/exams');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save exam');
      console.error('Error saving exam:', err);
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
            {id === 'new' ? 'Schedule New Exam' : 'Edit Exam'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/exams')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving || !isDirty}
            >
              {saving ? 'Saving...' : 'Save Exam'}
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
                  avatar={<ExamIcon />}
                  title="Basic Information"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Exam name is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Exam Name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="code"
                        control={control}
                        rules={{ required: 'Exam code is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Exam Code"
                            error={!!errors.code}
                            helperText={errors.code?.message}
                            placeholder="e.g., MID-CS101-2024"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="description"
                        control={control}
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
                    <Grid item xs={12} md={4}>
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
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'Exam type is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.type}>
                            <InputLabel>Exam Type</InputLabel>
                            <Select {...field} label="Exam Type">
                              <MenuItem value="midterm">Midterm</MenuItem>
                              <MenuItem value="final">Final</MenuItem>
                              <MenuItem value="quiz">Quiz</MenuItem>
                              <MenuItem value="assignment">Assignment</MenuItem>
                              <MenuItem value="practical">Practical</MenuItem>
                              <MenuItem value="viva">Viva</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>Status</InputLabel>
                            <Select {...field} label="Status">
                              <MenuItem value="draft">Draft</MenuItem>
                              <MenuItem value="scheduled">Scheduled</MenuItem>
                              <MenuItem value="ongoing">Ongoing</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Schedule & Timing */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<ScheduleIcon />}
                  title="Schedule & Timing"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="exam_date"
                        control={control}
                        rules={{ required: 'Exam date is required' }}
                        render={({ field }) => (
                          <DatePicker
                            label="Exam Date"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.exam_date,
                                helperText: errors.exam_date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="start_time"
                        control={control}
                        rules={{ required: 'Start time is required' }}
                        render={({ field }) => (
                          <TimePicker
                            label="Start Time"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.start_time,
                                helperText: errors.start_time?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="end_time"
                        control={control}
                        rules={{ required: 'End time is required' }}
                        render={({ field }) => (
                          <TimePicker
                            label="End Time"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.end_time,
                                helperText: errors.end_time?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="duration"
                        control={control}
                        rules={{ required: 'Duration is required', min: { value: 1, message: 'Minimum 1 minute' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Duration (minutes)"
                            type="number"
                            error={!!errors.duration}
                            helperText={errors.duration?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="supervisor_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.supervisor_id}>
                            <InputLabel>Supervisor</InputLabel>
                            <Select {...field} label="Supervisor">
                              <MenuItem value="">No Supervisor Assigned</MenuItem>
                              {faculty.map((facultyMember) => (
                                <MenuItem key={facultyMember.id} value={facultyMember.id}>
                                  {facultyMember.first_name} {facultyMember.last_name}
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

            {/* Grading & Marks */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<GradeIcon />}
                  title="Grading & Marks"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="total_marks"
                        control={control}
                        rules={{ required: 'Total marks is required', min: { value: 1, message: 'Minimum 1 mark' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Total Marks"
                            type="number"
                            error={!!errors.total_marks}
                            helperText={errors.total_marks?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="passing_marks"
                        control={control}
                        rules={{ required: 'Passing marks is required', min: { value: 0, message: 'Cannot be negative' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Passing Marks"
                            type="number"
                            error={!!errors.passing_marks}
                            helperText={errors.passing_marks?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="negative_marking"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Negative Marking"
                          />
                        )}
                      />
                    </Grid>
                    {watchedNegativeMarking && (
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="negative_marks_per_question"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Negative Marks per Wrong Answer"
                              type="number"
                              error={!!errors.negative_marks_per_question}
                              helperText={errors.negative_marks_per_question?.message}
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Venue & Platform */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<GroupIcon />}
                  title="Venue & Platform"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="is_online"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Online Exam"
                          />
                        )}
                      />
                    </Grid>
                    {!watchedIsOnline ? (
                      <Grid item xs={12}>
                        <Controller
                          name="venue"
                          control={control}
                          rules={{ required: 'Venue is required for offline exams' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Venue"
                              error={!!errors.venue}
                              helperText={errors.venue?.message}
                              placeholder="Room number, building, etc."
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="online_platform"
                            control={control}
                            rules={{ required: 'Online platform is required for online exams' }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Online Platform"
                                error={!!errors.online_platform}
                                helperText={errors.online_platform?.message}
                                placeholder="Zoom, Google Meet, Teams, etc."
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="online_link"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Online Link"
                                error={!!errors.online_link}
                                helperText={errors.online_link?.message}
                                placeholder="Meeting/exam link"
                              />
                            )}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Rules & Instructions */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Rules & Instructions"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="allow_calculator"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Allow Calculator"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="allow_notes"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Allow Notes/Books"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="instructions"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Exam Instructions"
                            multiline
                            rows={5}
                            error={!!errors.instructions}
                            helperText={errors.instructions?.message}
                            placeholder="Detailed instructions for students..."
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

export default ExamForm;

