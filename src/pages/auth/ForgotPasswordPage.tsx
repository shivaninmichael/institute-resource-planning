// =====================================================
// Forgot Password Page Component
// Handles password reset flow
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Stack,
  InputAdornment,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { resetPassword } = useAuth() as any;

  // Form state
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const steps = ['Email Verification', 'Enter Code', 'Reset Password'];

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({
        email,
        verificationCode,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleEmailSubmit}>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary" align="center">
                Enter your email address and we'll send you a verification code
                to reset your password.
              </Typography>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                size="large"
                fullWidth
              >
                Send Verification Code
              </LoadingButton>
            </Stack>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handleCodeVerification}>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary" align="center">
                We've sent a verification code to {email}.<br />
                Please enter the code below.
              </Typography>

              <TextField
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                inputProps={{
                  maxLength: 6,
                  pattern: '[0-9]*',
                }}
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                size="large"
                fullWidth
              >
                Verify Code
              </LoadingButton>

              <Button
                variant="text"
                onClick={handleEmailSubmit}
                disabled={loading}
              >
                Resend Code
              </Button>
            </Stack>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handlePasswordReset}>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary" align="center">
                Enter your new password
              </Typography>

              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                error={newPassword !== confirmPassword}
                helperText={
                  newPassword !== confirmPassword ? "Passwords don't match" : ''
                }
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                size="large"
                fullWidth
              >
                Reset Password
              </LoadingButton>
            </Stack>
          </form>
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
              Reset Password
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert severity="success">
              Password reset successful! Redirecting to login...
            </Alert>
          ) : (
            renderStepContent(activeStep)
          )}

          <Box
            display="flex"
            justifyContent="center"
            gap={1}
            mt={4}
          >
            <Typography variant="body2" color="text.secondary">
              Remember your password?
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

export default ForgotPasswordPage;
