// =====================================================
// Login Page Component
// Handles user authentication with role-based access
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
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login } = useSupabaseAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDemoCredentials = () => {
    switch (formData.role) {
      case 'admin':
        return {
          email: 'admin@s-erp.com',
          password: 'admin123',
        };
      case 'teacher':
        return {
          email: 'teacher@s-erp.com',
          password: 'teacher123',
        };
      case 'student':
        return {
          email: 'student@s-erp.com',
          password: 'student123',
        };
      default:
        return {
          email: 'student@s-erp.com',
          password: 'student123',
        };
    }
  };

  const handleDemoLogin = () => {
    const credentials = getDemoCredentials();
    setFormData(prev => ({
      ...prev,
      ...credentials,
    }));
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
              Welcome to S-ERP
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Sign in to access your educational dashboard
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

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
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
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
              />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auth/forgot-password');
                  }}
                  variant="body2"
                >
                  Forgot password?
                </Link>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  type="submit"
                  size="large"
                >
                  Sign In
                </LoadingButton>
              </Box>
            </Stack>
          </form>

          <Box my={3}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Button
              variant="outlined"
              onClick={handleDemoLogin}
              fullWidth
            >
              Try Demo Account
            </Button>

            <Box display="flex" justifyContent="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/auth/register');
                }}
                variant="body2"
              >
                Sign up
              </Link>
            </Box>
          </Box>

          {/* Demo Credentials */}
          <Box mt={4}>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Demo Credentials for {formData.role}:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Email: {getDemoCredentials().email}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Password: {getDemoCredentials().password}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;