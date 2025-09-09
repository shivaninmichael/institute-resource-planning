// =====================================================
// Register Page Component
// Handles user registration with email verification
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Stack,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  FormHelperText,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RegistrationData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  studentId?: string;
  department?: string;
  course?: string;
  semester?: string;
  teacherId?: string;
  subject?: string;
}

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({
    role: 'student',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const steps = ['Account Type', 'Personal Information', 'Credentials', 'Verification'];

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return !!formData.role;
      case 1:
        return (
          !!formData.firstName &&
          !!formData.lastName &&
          !!formData.phone &&
          (formData.role === 'student' ? !!formData.studentId : true) &&
          (formData.role === 'teacher' ? !!formData.teacherId : true)
        );
      case 2:
        return (
          !!formData.email &&
          !!formData.password &&
          !!formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 8
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      setVerificationSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => handleChange('role')(e as any)}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
              </Select>
              <FormHelperText>
                Select your role in the institution
              </FormHelperText>
            </FormControl>

            {formData.role === 'student' && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={formData.studentId || ''}
                  onChange={handleChange('studentId')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department || ''}
                    label="Department"
                    onChange={(e) => handleChange('department')(e as any)}
                  >
                    <MenuItem value="cs">Computer Science</MenuItem>
                    <MenuItem value="eng">Engineering</MenuItem>
                    <MenuItem value="bus">Business</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={formData.course || ''}
                    label="Course"
                    onChange={(e) => handleChange('course')(e as any)}
                  >
                    <MenuItem value="btech">B.Tech</MenuItem>
                    <MenuItem value="bsc">B.Sc</MenuItem>
                    <MenuItem value="bba">BBA</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={formData.semester || ''}
                    label="Semester"
                    onChange={(e) => handleChange('semester')(e as any)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <MenuItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}

            {formData.role === 'teacher' && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Teacher ID"
                  value={formData.teacherId || ''}
                  onChange={handleChange('teacherId')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department || ''}
                    label="Department"
                    onChange={(e) => handleChange('department')(e as any)}
                  >
                    <MenuItem value="cs">Computer Science</MenuItem>
                    <MenuItem value="eng">Engineering</MenuItem>
                    <MenuItem value="bus">Business</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={formData.subject || ''}
                    label="Subject"
                    onChange={(e) => handleChange('subject')(e as any)}
                  >
                    <MenuItem value="math">Mathematics</MenuItem>
                    <MenuItem value="physics">Physics</MenuItem>
                    <MenuItem value="programming">Programming</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 8 characters long"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={formData.password !== formData.confirmPassword}
              helperText={
                formData.password !== formData.confirmPassword
                  ? "Passwords don't match"
                  : ''
              }
            />
          </Stack>
        );

      case 3:
        return verificationSent ? (
          <Stack spacing={3} alignItems="center">
            <Alert severity="success">
              Verification email sent! Please check your inbox.
            </Alert>
            <Typography variant="body1" align="center">
              We've sent a verification link to {formData.email}.<br />
              Please click the link to complete your registration.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/auth/login')}
            >
              Go to Login
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3} alignItems="center">
            <Typography variant="h6" align="center">
              Review Your Information
            </Typography>
            <Box>
              <Typography><strong>Role:</strong> {formData.role}</Typography>
              <Typography><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
              <Typography><strong>Email:</strong> {formData.email}</Typography>
              <Typography><strong>Phone:</strong> {formData.phone}</Typography>
              {formData.role === 'student' && (
                <>
                  <Typography><strong>Student ID:</strong> {formData.studentId}</Typography>
                  <Typography><strong>Department:</strong> {formData.department}</Typography>
                  <Typography><strong>Course:</strong> {formData.course}</Typography>
                  <Typography><strong>Semester:</strong> {formData.semester}</Typography>
                </>
              )}
              {formData.role === 'teacher' && (
                <>
                  <Typography><strong>Teacher ID:</strong> {formData.teacherId}</Typography>
                  <Typography><strong>Department:</strong> {formData.department}</Typography>
                  <Typography><strong>Subject:</strong> {formData.subject}</Typography>
                </>
              )}
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          boxShadow: theme.shadows[20],
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={4}
          >
            <SchoolIcon
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Join S-ERP to access your educational portal
            </Typography>
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{ mb: 4 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {renderStepContent(activeStep)}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    type="submit"
                    disabled={!validateStep() || verificationSent}
                  >
                    Complete Registration
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!validateStep()}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Stack>
          </form>

          <Box
            display="flex"
            justifyContent="center"
            gap={1}
            mt={4}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
              variant="body2"
            >
              Sign in
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
