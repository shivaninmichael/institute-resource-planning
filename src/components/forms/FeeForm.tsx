// =====================================================
// Fee Form Component
// Form for creating and editing fees
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Fee name is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  amount: yup.number()
    .min(0, 'Amount cannot be negative')
    .required('Amount is required'),
  dueDate: yup.date().required('Due date is required'),
  studentId: yup.string().required('Student is required'),
  courseId: yup.string().required('Course is required'),
  allowInstallments: yup.boolean(),
  numberOfInstallments: yup.number()
    .min(2, 'Must have at least 2 installments')
    .when('allowInstallments', (allowInstallments, schema) => {
      return allowInstallments ? 
        schema.required('Number of installments is required when installments are allowed') :
        schema;
    }),
  installmentInterval: yup.number()
    .min(1, 'Interval must be at least 1 day')
    .when('allowInstallments', (allowInstallments, schema) => {
      return allowInstallments ? 
        schema.required('Installment interval is required when installments are allowed') :
        schema;
    }),
  lateFee: yup.number()
    .min(0, 'Late fee cannot be negative')
    .required('Late fee is required'),
  notes: yup.string(),
});

interface FeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  fee?: any;
  title?: string;
}

const FeeForm: React.FC<FeeFormProps> = ({
  open,
  onClose,
  onSubmit,
  fee,
  title = 'New Fee'
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
      category: '',
      amount: 0,
      dueDate: undefined,
      studentId: '',
      courseId: '',
      allowInstallments: false,
      numberOfInstallments: 2,
      installmentInterval: 30,
      lateFee: 0,
      notes: '',
    }
  });

  const allowInstallments = watch('allowInstallments');

  // Load fee data when editing
  useEffect(() => {
    if (fee) {
      reset({
        name: fee.name,
        description: fee.description,
        category: fee.category,
        amount: fee.amount,
        dueDate: fee.dueDate,
        studentId: fee.studentId,
        courseId: fee.courseId,
        allowInstallments: fee.allowInstallments,
        numberOfInstallments: fee.numberOfInstallments,
        installmentInterval: fee.installmentInterval,
        lateFee: fee.lateFee,
        notes: fee.notes,
      });
    }
  }, [fee, reset]);

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
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fee Name"
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

            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      <MenuItem value="tuition">Tuition Fee</MenuItem>
                      <MenuItem value="lab">Laboratory Fee</MenuItem>
                      <MenuItem value="library">Library Fee</MenuItem>
                      <MenuItem value="exam">Examination Fee</MenuItem>
                      <MenuItem value="transport">Transportation Fee</MenuItem>
                      <MenuItem value="hostel">Hostel Fee</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    <FormHelperText>{errors.category?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    type="number"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
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

            <Grid item xs={12} md={6}>
              <Controller
                name="lateFee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Late Fee"
                    type="number"
                    fullWidth
                    error={!!errors.lateFee}
                    helperText={errors.lateFee?.message}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="studentId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.studentId}>
                    <InputLabel>Student</InputLabel>
                    <Select {...field} label="Student">
                      <MenuItem value="std1">John Doe</MenuItem>
                      <MenuItem value="std2">Jane Smith</MenuItem>
                      <MenuItem value="std3">Mike Johnson</MenuItem>
                    </Select>
                    <FormHelperText>{errors.studentId?.message}</FormHelperText>
                  </FormControl>
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

            <Grid item xs={12}>
              <Controller
                name="allowInstallments"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                      />
                    }
                    label="Allow Installments"
                  />
                )}
              />
            </Grid>

            {allowInstallments && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="numberOfInstallments"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number of Installments"
                        type="number"
                        fullWidth
                        error={!!errors.numberOfInstallments}
                        helperText={errors.numberOfInstallments?.message}
                        InputProps={{ inputProps: { min: 2 } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="installmentInterval"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Installment Interval (days)"
                        type="number"
                        fullWidth
                        error={!!errors.installmentInterval}
                        helperText={errors.installmentInterval?.message}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {fee ? 'Update' : 'Create'} Fee
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FeeForm;
