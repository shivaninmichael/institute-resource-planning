// =====================================================
// Assignment Form Component
// Form for creating and editing assignments
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Form validation schema
const schema = yup.object().shape({
  title: yup.string().required('Assignment title is required'),
  description: yup.string().required('Description is required'),
  courseId: yup.string().required('Course is required'),
  dueDate: yup.date().required('Due date is required'),
  maxScore: yup.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Maximum score is 100')
    .required('Maximum score is required'),
  weight: yup.number()
    .min(0, 'Weight cannot be negative')
    .max(1, 'Weight cannot exceed 1')
    .required('Weight is required'),
  allowLateSubmission: yup.boolean(),
  latePenalty: yup.number()
    .min(0, 'Penalty cannot be negative')
    .max(100, 'Penalty cannot exceed 100%')
    .when('allowLateSubmission', (allowLateSubmission, schema) => {
      return allowLateSubmission ? 
        schema.required('Late penalty is required when late submission is allowed') :
        schema;
    }),
  maxDaysLate: yup.number()
    .min(1, 'Must allow at least 1 day')
    .when('allowLateSubmission', (allowLateSubmission, schema) => {
      return allowLateSubmission ? 
        schema.required('Maximum days late is required when late submission is allowed') :
        schema;
    }),
  instructions: yup.string().required('Instructions are required'),
  facultyId: yup.string().required('Faculty is required'),
});

interface AssignmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  assignment?: any;
  title?: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  open,
  onClose,
  onSubmit,
  assignment,
  title = 'New Assignment'
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
      title: '',
      description: '',
      courseId: '',
      dueDate: undefined,
      maxScore: 100,
      weight: 1,
      allowLateSubmission: false,
      latePenalty: 10,
      maxDaysLate: 7,
      instructions: '',
      facultyId: '',
    }
  });

  const allowLateSubmission = watch('allowLateSubmission');

  // Load assignment data when editing
  useEffect(() => {
    if (assignment) {
      reset({
        title: assignment.title,
        description: assignment.description,
        courseId: assignment.courseId,
        dueDate: assignment.dueDate,
        maxScore: assignment.maxScore,
        weight: assignment.weight,
        allowLateSubmission: assignment.allowLateSubmission,
        latePenalty: assignment.latePenalty,
        maxDaysLate: assignment.maxDaysLate,
        instructions: assignment.instructions,
        facultyId: assignment.facultyId,
      });
    }
  }, [assignment, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Assignment Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
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
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Due Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dueDate,
                        helperText: errors.dueDate?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="maxScore"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Maximum Score"
                    type="number"
                    fullWidth
                    error={!!errors.maxScore}
                    helperText={errors.maxScore?.message}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Weight"
                    type="number"
                    fullWidth
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                    InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="allowLateSubmission"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                      />
                    }
                    label="Allow Late Submission"
                  />
                )}
              />
            </Grid>

            {allowLateSubmission && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="latePenalty"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Late Penalty (%)"
                        type="number"
                        fullWidth
                        error={!!errors.latePenalty}
                        helperText={errors.latePenalty?.message}
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="maxDaysLate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Maximum Days Late"
                        type="number"
                        fullWidth
                        error={!!errors.maxDaysLate}
                        helperText={errors.maxDaysLate?.message}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Instructions"
                    fullWidth
                    multiline
                    rows={5}
                    error={!!errors.instructions}
                    helperText={errors.instructions?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {assignment ? 'Update' : 'Create'} Assignment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssignmentForm;
