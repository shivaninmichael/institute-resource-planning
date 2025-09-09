// =====================================================
// Activity Form Component
// Form for creating and editing activities
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
  Box,
  Typography,
  FormHelperText,
  IconButton,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { ActivityFormData } from '../../types/activity';

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ActivityFormData) => void;
  activity?: ActivityFormData;
  title?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  open,
  onClose,
  onSubmit,
  activity,
  title = 'New Activity'
}) => {
  const [formData, setFormData] = React.useState<ActivityFormData>({
    name: '',
    description: '',
    type: '',
    startDate: undefined,
    endDate: undefined,
    startTime: undefined,
    endTime: undefined,
    location: '',
    maxParticipants: 1,
    courseId: '',
    facultyId: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof ActivityFormData, string>>>({});

  // Load activity data when editing
  useEffect(() => {
    if (activity) {
      setFormData(activity);
    }
  }, [activity]);

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
      location: '',
      maxParticipants: 1,
      courseId: '',
      facultyId: '',
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field: keyof ActivityFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleNumberChange = (field: keyof ActivityFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(value) ? 1 : value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleDateChange = (field: keyof ActivityFormData) => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ActivityFormData, string>> = {};

    if (!formData.name) newErrors.name = 'Activity name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Activity type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.maxParticipants < 1) newErrors.maxParticipants = 'Must have at least 1 participant';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.facultyId) newErrors.facultyId = 'Faculty is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
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
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Activity Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Activity Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="cultural">Cultural</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                </Select>
                <FormHelperText>{errors.type}</FormHelperText>
              </FormControl>

              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                error={!!errors.location}
                helperText={errors.location}
              />

              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                onChange={event => handleDateChange('startDate')(new Date(event.target.value))}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                onChange={event => handleDateChange('endDate')(new Date(event.target.value))}
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Start Time"
                type="time"
                fullWidth
                value={formData.startTime || ''}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                error={!!errors.startTime}
                helperText={errors.startTime}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="End Time"
                type="time"
                fullWidth
                value={formData.endTime || ''}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                error={!!errors.endTime}
                helperText={errors.endTime}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Maximum Participants"
                type="number"
                fullWidth
                value={formData.maxParticipants}
                onChange={handleNumberChange('maxParticipants')}
                error={!!errors.maxParticipants}
                helperText={errors.maxParticipants}
                InputProps={{ inputProps: { min: 1 } }}
              />

              <FormControl fullWidth error={!!errors.courseId}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={formData.courseId}
                  label="Course"
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  <MenuItem value="cs101">Computer Science 101</MenuItem>
                  <MenuItem value="math101">Mathematics 101</MenuItem>
                  <MenuItem value="phy101">Physics 101</MenuItem>
                </Select>
                <FormHelperText>{errors.courseId}</FormHelperText>
              </FormControl>

              <FormControl fullWidth error={!!errors.facultyId}>
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={formData.facultyId}
                  label="Faculty"
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                >
                  <MenuItem value="fac1">Dr. John Smith</MenuItem>
                  <MenuItem value="fac2">Prof. Jane Doe</MenuItem>
                  <MenuItem value="fac3">Dr. Mike Johnson</MenuItem>
                </Select>
                <FormHelperText>{errors.facultyId}</FormHelperText>
              </FormControl>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {activity ? 'Update' : 'Create'} Activity
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ActivityForm;