// =====================================================
// Timetable Form Component
// Form for creating and editing timetables
// =====================================================

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  FormHelperText,
  IconButton,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller, useFieldArray, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface TimetableSession {
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
  subjectId: string;
  facultyId: string;
  classroomId: string;
}

interface TimetableFormData {
  name: string;
  description: string;
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  courseId: string;
  facultyId: string;
  classroomId: string;
  sessions: TimetableSession[];
}

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Timetable name is required'),
  description: yup.string().required('Description is required'),
  type: yup.string().required('Type is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  courseId: yup.string().required('Course is required'),
  facultyId: yup.string().required('Faculty is required'),
  classroomId: yup.string().required('Classroom is required'),
  sessions: yup.array().of(
    yup.object().shape({
      dayOfWeek: yup.string().required('Day is required'),
      startTime: yup.string().required('Start time is required'),
      endTime: yup.string().required('End time is required'),
      subjectId: yup.string().required('Subject is required'),
      facultyId: yup.string().required('Faculty is required'),
      classroomId: yup.string().required('Classroom is required'),
    })
  ).min(1, 'At least one session is required'),
});

interface TimetableFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TimetableFormData) => void;
  timetable?: TimetableFormData;
  title?: string;
}

const TimetableForm: React.FC<TimetableFormProps> = ({
  open,
  onClose,
  onSubmit,
  timetable,
  title = 'New Timetable'
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      startDate: undefined,
      endDate: undefined,
      courseId: '',
      facultyId: '',
      classroomId: '',
      sessions: [{
        dayOfWeek: '',
        startTime: undefined,
        endTime: undefined,
        subjectId: '',
        facultyId: '',
        classroomId: '',
      }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sessions"
  });

  // Load timetable data when editing
  useEffect(() => {
    if (timetable) {
      reset({
        name: timetable.name,
        description: timetable.description,
        type: timetable.type,
        startDate: timetable.startDate || undefined,
        endDate: timetable.endDate || undefined,
        courseId: timetable.courseId,
        facultyId: timetable.facultyId,
        classroomId: timetable.classroomId,
        sessions: timetable.sessions,
      });
    }
  }, [timetable, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const addSession = () => {
    append({
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      subjectId: '',
      facultyId: '',
      classroomId: '',
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit((data: any) => onSubmit(data))}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Timetable Name"
                    fullWidth
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel>Type</InputLabel>
                    <Select {...field} label="Type">
                      <MenuItem value="regular">Regular</MenuItem>
                      <MenuItem value="exam">Exam</MenuItem>
                      <MenuItem value="special">Special</MenuItem>
                    </Select>
                    <FormHelperText>{errors.type?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Start Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="End Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="courseId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.courseId}>
                    <InputLabel>Course</InputLabel>
                    <Select {...field} label="Course">
                      <MenuItem value="cs101">Computer Science 101</MenuItem>
                      <MenuItem value="math101">Mathematics 101</MenuItem>
                      <MenuItem value="phy101">Physics 101</MenuItem>
                    </Select>
                    <FormHelperText>{errors.courseId?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="facultyId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.facultyId}>
                    <InputLabel>Faculty</InputLabel>
                    <Select {...field} label="Faculty">
                      <MenuItem value="fac1">Dr. John Smith</MenuItem>
                      <MenuItem value="fac2">Prof. Jane Doe</MenuItem>
                      <MenuItem value="fac3">Dr. Mike Johnson</MenuItem>
                    </Select>
                    <FormHelperText>{errors.facultyId?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="classroomId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.classroomId}>
                    <InputLabel>Classroom</InputLabel>
                    <Select {...field} label="Classroom">
                      <MenuItem value="room1">Room 101</MenuItem>
                      <MenuItem value="room2">Room 102</MenuItem>
                      <MenuItem value="room3">Room 103</MenuItem>
                    </Select>
                    <FormHelperText>{errors.classroomId?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Sessions</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addSession}
                  variant="outlined"
                  size="small"
                >
                  Add Session
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Classroom</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`sessions.${index}.dayOfWeek`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.sessions?.[index]?.dayOfWeek}>
                                <Select {...field} size="small">
                                  <MenuItem value="monday">Monday</MenuItem>
                                  <MenuItem value="tuesday">Tuesday</MenuItem>
                                  <MenuItem value="wednesday">Wednesday</MenuItem>
                                  <MenuItem value="thursday">Thursday</MenuItem>
                                  <MenuItem value="friday">Friday</MenuItem>
                                  <MenuItem value="saturday">Saturday</MenuItem>
                                  <MenuItem value="sunday">Sunday</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sessions.${index}.startTime`}
                            control={control}
                            render={({ field }) => (
                              <TimePicker
                                {...field}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    fullWidth: true,
                                    error: !!errors.sessions?.[index]?.startTime
                                  }
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sessions.${index}.endTime`}
                            control={control}
                            render={({ field }) => (
                              <TimePicker
                                {...field}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    fullWidth: true,
                                    error: !!errors.sessions?.[index]?.endTime
                                  }
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sessions.${index}.subjectId`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.sessions?.[index]?.subjectId}>
                                <Select {...field} size="small">
                                  <MenuItem value="sub1">Programming</MenuItem>
                                  <MenuItem value="sub2">Database</MenuItem>
                                  <MenuItem value="sub3">Networking</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sessions.${index}.facultyId`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.sessions?.[index]?.facultyId}>
                                <Select {...field} size="small">
                                  <MenuItem value="fac1">Dr. John Smith</MenuItem>
                                  <MenuItem value="fac2">Prof. Jane Doe</MenuItem>
                                  <MenuItem value="fac3">Dr. Mike Johnson</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sessions.${index}.classroomId`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.sessions?.[index]?.classroomId}>
                                <Select {...field} size="small">
                                  <MenuItem value="room1">Room 101</MenuItem>
                                  <MenuItem value="room2">Room 102</MenuItem>
                                  <MenuItem value="room3">Room 103</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {errors.sessions && (
                <FormHelperText error>
                  {errors.sessions.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {timetable ? 'Update' : 'Create'} Timetable
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TimetableForm;
