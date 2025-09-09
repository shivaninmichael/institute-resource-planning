// =====================================================
// Parent Form Component
// Form for creating and editing parent/guardian information
// =====================================================

import React, { useState, useEffect } from 'react';
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
  Grid,
  Autocomplete,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  dateOfBirth: Date | null;
  gender: string;
  relationship: string;
  occupation: string;
  employer: string;
  workPhone: string;
  workAddress: string;
  homeAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContact: boolean;
  primaryGuardian: boolean;
  studentIds: string[];
  qualifications: string;
  annualIncome: number;
  maritalStatus: string;
  notes: string;
}

interface ParentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ParentFormData) => void;
  parent?: ParentFormData;
  title?: string;
}

const ParentForm: React.FC<ParentFormProps> = ({
  open,
  onClose,
  onSubmit,
  parent,
  title = 'Parent/Guardian'
}) => {
  const [formData, setFormData] = useState<ParentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: null,
    gender: '',
    relationship: '',
    occupation: '',
    employer: '',
    workPhone: '',
    workAddress: '',
    homeAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContact: false,
    primaryGuardian: false,
    studentIds: [],
    qualifications: '',
    annualIncome: 0,
    maritalStatus: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<ParentFormData>>({});

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const relationshipOptions = [
    'Father',
    'Mother',
    'Guardian',
    'Grandfather',
    'Grandmother',
    'Uncle',
    'Aunt',
    'Brother',
    'Sister',
    'Step-father',
    'Step-mother',
    'Foster Parent',
    'Other Relative'
  ];

  const maritalStatusOptions = [
    'Single',
    'Married',
    'Divorced',
    'Widowed',
    'Separated'
  ];

  const occupations = [
    'Doctor',
    'Engineer',
    'Teacher',
    'Lawyer',
    'Business Owner',
    'Government Employee',
    'Private Employee',
    'Self-employed',
    'Retired',
    'Homemaker',
    'Student',
    'Unemployed',
    'Other'
  ];

  // Mock student data - in real app, this would come from API
  const students = [
    { id: '1', name: 'John Smith', class: 'Grade 10' },
    { id: '2', name: 'Jane Smith', class: 'Grade 8' },
    { id: '3', name: 'Bob Johnson', class: 'Grade 12' },
    { id: '4', name: 'Alice Brown', class: 'Grade 9' }
  ];

  useEffect(() => {
    if (parent) {
      setFormData(parent);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        dateOfBirth: null,
        gender: '',
        relationship: '',
        occupation: '',
        employer: '',
        workPhone: '',
        workAddress: '',
        homeAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        emergencyContact: false,
        primaryGuardian: false,
        studentIds: [],
        qualifications: '',
        annualIncome: 0,
        maritalStatus: '',
        notes: ''
      });
    }
    setErrors({});
  }, [parent, open]);

  const handleInputChange = (field: keyof ParentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ParentFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required';
    }
    if (!formData.homeAddress.trim()) {
      newErrors.homeAddress = 'Home address is required';
    }
    if (formData.studentIds.length === 0) {
      newErrors.studentIds = 'At least one student must be selected' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const getSelectedStudents = () => {
    return students.filter(student => formData.studentIds.includes(student.id));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name *"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name *"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone *"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Alternate Phone"
              value={formData.alternatePhone}
              onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(date) => handleInputChange('dateOfBirth', date)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('gender', e.target.value)
                }
                label="Gender"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.relationship}>
              <InputLabel>Relationship *</InputLabel>
              <Select
                value={formData.relationship}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('relationship', e.target.value)
                }
                label="Relationship *"
              >
                {relationshipOptions.map((relationship) => (
                  <MenuItem key={relationship} value={relationship}>
                    {relationship}
                  </MenuItem>
                ))}
              </Select>
              {errors.relationship && (
                <FormHelperText>{errors.relationship}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Marital Status</InputLabel>
              <Select
                value={formData.maritalStatus}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('maritalStatus', e.target.value)
                }
                label="Marital Status"
              >
                {maritalStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={occupations}
              value={formData.occupation}
              onChange={(_, value) => handleInputChange('occupation', value || '')}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Occupation"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Employer"
              value={formData.employer}
              onChange={(e) => handleInputChange('employer', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Work Phone"
              value={formData.workPhone}
              onChange={(e) => handleInputChange('workPhone', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Annual Income"
              type="number"
              value={formData.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Work Address"
              value={formData.workAddress}
              onChange={(e) => handleInputChange('workAddress', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Qualifications"
              multiline
              rows={2}
              value={formData.qualifications}
              onChange={(e) => handleInputChange('qualifications', e.target.value)}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Home Address *"
              value={formData.homeAddress}
              onChange={(e) => handleInputChange('homeAddress', e.target.value)}
              error={!!errors.homeAddress}
              helperText={errors.homeAddress}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Zip Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </Grid>

          {/* Student Association */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Student Association
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={students}
              getOptionLabel={(option) => `${option.name} (${option.class})`}
              value={getSelectedStudents()}
              onChange={(_, value) => 
                handleInputChange('studentIds', value.map(student => student.id))
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={`${option.name} (${option.class})`}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Associated Students *"
                  error={!!errors.studentIds}
                  helperText={errors.studentIds}
                />
              )}
            />
          </Grid>

          {/* Guardian Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Guardian Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Primary Guardian
              </Typography>
              <Select
                fullWidth
                value={formData.primaryGuardian ? 'yes' : 'no'}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('primaryGuardian', e.target.value === 'yes')
                }
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Emergency Contact
              </Typography>
              <Select
                fullWidth
                value={formData.emergencyContact ? 'yes' : 'no'}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('emergencyContact', e.target.value === 'yes')
                }
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {parent ? 'Update' : 'Create'} Parent/Guardian
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentForm;
