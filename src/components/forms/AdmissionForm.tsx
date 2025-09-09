// =====================================================
// Admission Form Component
// Form for creating and editing admission applications
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
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface AdmissionFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: string;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Academic Information
  appliedProgram: string;
  appliedLevel: string;
  previousSchool: string;
  previousGrade: string;
  previousGPA: number;
  graduationYear: number;
  
  // Application Details
  applicationDate: Date | null;
  applicationId: string;
  status: string;
  priority: string;
  source: string;
  
  // Parent/Guardian Information
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentOccupation: string;
  
  // Additional Information
  medicalConditions: string;
  specialNeeds: string;
  extracurricularActivities: string;
  languages: string[];
  documents: string[];
  
  // Financial Information
  feesPaid: number;
  scholarshipApplied: boolean;
  scholarshipType: string;
  
  notes: string;
}

interface AdmissionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AdmissionFormData) => void;
  admission?: AdmissionFormData;
  title?: string;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({
  open,
  onClose,
  onSubmit,
  admission,
  title = 'Admission Application'
}) => {
  const [formData, setFormData] = useState<AdmissionFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    appliedProgram: '',
    appliedLevel: '',
    previousSchool: '',
    previousGrade: '',
    previousGPA: 0,
    graduationYear: new Date().getFullYear(),
    applicationDate: new Date(),
    applicationId: '',
    status: 'pending',
    priority: 'normal',
    source: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentOccupation: '',
    medicalConditions: '',
    specialNeeds: '',
    extracurricularActivities: '',
    languages: [],
    documents: [],
    feesPaid: 0,
    scholarshipApplied: false,
    scholarshipType: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<AdmissionFormData>>({});
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Personal Information',
    'Academic Background',
    'Application Details',
    'Parent/Guardian Info',
    'Additional Information'
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const programs = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Literature',
    'History',
    'Economics',
    'Business Administration',
    'Engineering'
  ];

  const levels = [
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
    'Undergraduate',
    'Graduate',
    'Postgraduate'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'waitlisted', label: 'Waitlisted' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const sources = [
    'Online Application',
    'Walk-in',
    'Referral',
    'Advertisement',
    'Social Media',
    'Education Fair',
    'School Visit',
    'Other'
  ];

  const availableLanguages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Arabic',
    'Hindi',
    'Portuguese',
    'Russian'
  ];

  const documentTypes = [
    'Birth Certificate',
    'Previous School Transcripts',
    'Passport Copy',
    'Medical Certificate',
    'Recommendation Letters',
    'Portfolio',
    'Test Scores',
    'Financial Documents'
  ];

  const scholarshipTypes = [
    'Academic Merit',
    'Athletic',
    'Need-based',
    'Minority',
    'International Student',
    'Alumni Legacy'
  ];

  useEffect(() => {
    if (admission) {
      setFormData(admission);
    } else {
      const applicationId = `APP${Date.now()}`;
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        gender: '',
        nationality: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        appliedProgram: '',
        appliedLevel: '',
        previousSchool: '',
        previousGrade: '',
        previousGPA: 0,
        graduationYear: new Date().getFullYear(),
        applicationDate: new Date(),
        applicationId,
        status: 'pending',
        priority: 'normal',
        source: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        parentOccupation: '',
        medicalConditions: '',
        specialNeeds: '',
        extracurricularActivities: '',
        languages: [],
        documents: [],
        feesPaid: 0,
        scholarshipApplied: false,
        scholarshipType: '',
        notes: ''
      });
    }
    setErrors({});
    setActiveStep(0);
  }, [admission, open]);

  const handleInputChange = (field: keyof AdmissionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<AdmissionFormData> = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required' as any;
        break;
      
      case 1: // Academic Background
        if (!formData.appliedProgram) newErrors.appliedProgram = 'Program is required';
        if (!formData.appliedLevel) newErrors.appliedLevel = 'Level is required';
        if (!formData.previousSchool.trim()) newErrors.previousSchool = 'Previous school is required';
        break;
      
      case 2: // Application Details
        if (!formData.applicationDate) newErrors.applicationDate = 'Application date is required' as any;
        if (!formData.source) newErrors.source = 'Application source is required';
        break;
      
      case 3: // Parent/Guardian Info
        if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
        if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Parent phone is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      onSubmit(formData);
      onClose();
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
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
              <DatePicker
                label="Date of Birth *"
                value={formData.dateOfBirth}
                onChange={(date) => handleInputChange('dateOfBirth', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth ? String(errors.dateOfBirth) : undefined
                  }
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
                label="Nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
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
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.appliedProgram}>
                <InputLabel>Applied Program *</InputLabel>
                <Select
                  value={formData.appliedProgram}
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange('appliedProgram', e.target.value)
                  }
                  label="Applied Program *"
                >
                  {programs.map((program) => (
                    <MenuItem key={program} value={program}>
                      {program}
                    </MenuItem>
                  ))}
                </Select>
                {errors.appliedProgram && (
                  <FormHelperText>{errors.appliedProgram}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.appliedLevel}>
                <InputLabel>Applied Level *</InputLabel>
                <Select
                  value={formData.appliedLevel}
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange('appliedLevel', e.target.value)
                  }
                  label="Applied Level *"
                >
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
                {errors.appliedLevel && (
                  <FormHelperText>{errors.appliedLevel}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Previous School *"
                value={formData.previousSchool}
                onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                error={!!errors.previousSchool}
                helperText={errors.previousSchool}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Previous Grade"
                value={formData.previousGrade}
                onChange={(e) => handleInputChange('previousGrade', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Previous GPA"
                type="number"
                inputProps={{ min: 0, max: 4, step: 0.1 }}
                value={formData.previousGPA}
                onChange={(e) => handleInputChange('previousGPA', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Graduation Year"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value) || new Date().getFullYear())}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application ID"
                value={formData.applicationId}
                onChange={(e) => handleInputChange('applicationId', e.target.value)}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Application Date *"
                value={formData.applicationDate}
                onChange={(date) => handleInputChange('applicationDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.applicationDate,
                    helperText: errors.applicationDate ? String(errors.applicationDate) : undefined
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange('status', e.target.value)
                  }
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange('priority', e.target.value)
                  }
                  label="Priority"
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.source}>
                <InputLabel>Application Source *</InputLabel>
                <Select
                  value={formData.source}
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange('source', e.target.value)
                  }
                  label="Application Source *"
                >
                  {sources.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
                {errors.source && (
                  <FormHelperText>{errors.source}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent/Guardian Name *"
                value={formData.parentName}
                onChange={(e) => handleInputChange('parentName', e.target.value)}
                error={!!errors.parentName}
                helperText={errors.parentName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent Email"
                type="email"
                value={formData.parentEmail}
                onChange={(e) => handleInputChange('parentEmail', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent Phone *"
                value={formData.parentPhone}
                onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                error={!!errors.parentPhone}
                helperText={errors.parentPhone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent Occupation"
                value={formData.parentOccupation}
                onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical Conditions"
                multiline
                rows={2}
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Needs"
                multiline
                rows={2}
                value={formData.specialNeeds}
                onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Extracurricular Activities"
                multiline
                rows={3}
                value={formData.extracurricularActivities}
                onChange={(e) => handleInputChange('extracurricularActivities', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Fee Paid"
                type="number"
                value={formData.feesPaid}
                onChange={(e) => handleInputChange('feesPaid', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Scholarship Applied
                </Typography>
                <Select
                  fullWidth
                  value={formData.scholarshipApplied ? 'yes' : 'no'}
                  onChange={(e: SelectChangeEvent) => 
                    handleInputChange('scholarshipApplied', e.target.value === 'yes')
                  }
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </Box>
            </Grid>
            {formData.scholarshipApplied && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Scholarship Type</InputLabel>
                  <Select
                    value={formData.scholarshipType}
                    onChange={(e: SelectChangeEvent) => 
                      handleInputChange('scholarshipType', e.target.value)
                    }
                    label="Scholarship Type"
                  >
                    {scholarshipTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
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
        );

      default:
        return 'Unknown step';
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
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {admission ? 'Update' : 'Submit'} Application
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained" color="primary">
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AdmissionForm;
