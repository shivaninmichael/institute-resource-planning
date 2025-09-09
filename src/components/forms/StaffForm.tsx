// =====================================================
// Staff Form Component
// Form for creating and editing staff members
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
  Avatar,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | null;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: Date | null;
  employmentType: string;
  salary: number;
  bankAccount: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  qualifications: string;
  experience: string;
  skills: string[];
  isActive: boolean;
  photo?: File;
  notes: string;
}

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
  staff?: StaffFormData;
  title?: string;
}

const StaffForm: React.FC<StaffFormProps> = ({
  open,
  onClose,
  onSubmit,
  staff,
  title = 'Staff Member'
}) => {
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    employeeId: '',
    position: '',
    department: '',
    hireDate: new Date(),
    employmentType: '',
    salary: 0,
    bankAccount: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    qualifications: '',
    experience: '',
    skills: [],
    isActive: true,
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<StaffFormData>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const positions = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Administrator',
    'Librarian',
    'IT Support',
    'Accountant',
    'HR Manager',
    'Security Guard',
    'Maintenance Staff',
    'Counselor'
  ];

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Administration',
    'Library',
    'IT Department',
    'Finance',
    'Human Resources'
  ];

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Intern'
  ];

  const availableSkills = [
    'Teaching',
    'Research',
    'Administration',
    'Communication',
    'Leadership',
    'Technology',
    'Project Management',
    'Data Analysis',
    'Customer Service',
    'Problem Solving'
  ];

  useEffect(() => {
    if (staff) {
      setFormData(staff);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: null,
        gender: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        employeeId: '',
        position: '',
        department: '',
        hireDate: new Date(),
        employmentType: '',
        salary: 0,
        bankAccount: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        qualifications: '',
        experience: '',
        skills: [],
        isActive: true,
        notes: ''
      });
    }
    setErrors({});
    setPhotoPreview('');
  }, [staff, open]);

  const handleInputChange = (field: keyof StaffFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSkillsChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StaffFormData> = {};

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
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required' as any;
    }
    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }
    if (!formData.salary || formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0' as any;
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
          {/* Photo Upload */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={photoPreview}
                sx={{ width: 80, height: 80 }}
              >
                <PhotoCamera />
              </Avatar>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </Button>
            </Box>
          </Grid>

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

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
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

          {/* Employment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Employment Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Employee ID *"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              error={!!errors.employeeId}
              helperText={errors.employeeId}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.position}>
              <InputLabel>Position *</InputLabel>
              <Select
                value={formData.position}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('position', e.target.value)
                }
                label="Position *"
              >
                {positions.map((position) => (
                  <MenuItem key={position} value={position}>
                    {position}
                  </MenuItem>
                ))}
              </Select>
              {errors.position && (
                <FormHelperText>{errors.position}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.department}>
              <InputLabel>Department *</InputLabel>
              <Select
                value={formData.department}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('department', e.target.value)
                }
                label="Department *"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
              {errors.department && (
                <FormHelperText>{errors.department}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Hire Date *"
              value={formData.hireDate}
              onChange={(date) => handleInputChange('hireDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.hireDate,
                  helperText: errors.hireDate?.toString()
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.employmentType}>
              <InputLabel>Employment Type *</InputLabel>
              <Select
                value={formData.employmentType}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('employmentType', e.target.value)
                }
                label="Employment Type *"
              >
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.employmentType && (
                <FormHelperText>{errors.employmentType}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Salary *"
              type="number"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
              error={!!errors.salary}
              helperText={errors.salary}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              }
              label="Active Employee"
            />
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bank Account"
              value={formData.bankAccount}
              onChange={(e) => handleInputChange('bankAccount', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Qualifications"
              multiline
              rows={3}
              value={formData.qualifications}
              onChange={(e) => handleInputChange('qualifications', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Experience"
              multiline
              rows={3}
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {availableSkills.map((skill) => (
                <FormControlLabel
                  key={skill}
                  control={
                    <Checkbox
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillsChange(skill)}
                    />
                  }
                  label={skill}
                />
              ))}
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
          {staff ? 'Update' : 'Create'} Staff Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffForm;
