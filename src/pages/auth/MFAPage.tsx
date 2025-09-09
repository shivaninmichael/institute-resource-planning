// =====================================================
// OpenEducat ERP Frontend - MFA Verification Page
// Handles multi-factor authentication verification
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MFAMethod } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mfa-tabpanel-${index}`}
      aria-labelledby={`mfa-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MFAPage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyMFA, setupMFA, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    // If user has no MFA methods, show setup tab
    if (user?.mfa_methods && user.mfa_methods.length === 0) {
      setActiveTab(1);
    }
  }, [user]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);

      const method = user?.mfa_methods?.find(m => m.isEnabled)?.type || 'authenticator';
      await verifyMFA(code, method);
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (method: MFAMethod['type']) => {
    try {
      setLoading(true);
      setError(null);

      const response = await setupMFA(method) as any;
      
      if (response?.qrCode) {
        setQrCode(response.qrCode);
      }
      if (response?.secret) {
        setSecret(response.secret);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SecurityIcon
            color="primary"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <Typography component="h1" variant="h5" gutterBottom>
            Two-Factor Authentication
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3, width: '100%' }}
          >
            <Tab label="Verify" disabled={!user?.mfa_methods || user.mfa_methods.length === 0} />
            <Tab label="Setup" />
            <Tab label="Help" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1" gutterBottom>
                Enter the verification code from your authenticator app or device.
              </Typography>

              <TextField
                fullWidth
                label="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                margin="normal"
                autoFocus
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Choose a verification method:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<QrCodeIcon />}
                  onClick={() => handleSetup('authenticator')}
                  disabled={loading}
                >
                  Authenticator App
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  onClick={() => handleSetup('sms')}
                  disabled={loading}
                >
                  SMS Verification
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={() => handleSetup('email')}
                  disabled={loading}
                >
                  Email Verification
                </Button>
              </Box>

              {qrCode && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Scan this QR code with your authenticator app:
                  </Typography>
                  <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200 }} />
                  {secret && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Manual entry code: <code>{secret}</code>
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Need Help?
              </Typography>

              <Typography variant="body1" paragraph>
                Two-factor authentication adds an extra layer of security to your account.
                After entering your password, you'll need to provide a verification code
                from your chosen authentication method.
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Recommended authenticator apps:
              </Typography>

              <ul>
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
              </ul>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Lost access to your authentication method?{' '}
                <Link href="/help/mfa" underline="hover">
                  Contact support
                </Link>
              </Typography>
            </Box>
          </TabPanel>

          <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MFAPage;

