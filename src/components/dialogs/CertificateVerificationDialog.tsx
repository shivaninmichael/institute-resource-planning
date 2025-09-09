import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import apiClient from '../../services/api';

interface CertificateVerificationDialogProps {
  onClose: () => void;
}

interface VerificationResult {
  is_valid: boolean;
  certificate?: {
    id: number;
    certificate_number: string;
    certificate_type_name: string;
    student_first_name: string;
    student_last_name: string;
    student_gr_no: string;
    issued_date: string;
    expiry_date?: string;
    status: string;
    verification_code: string;
    course_name?: string;
    batch_name?: string;
    issued_by_first_name: string;
    issued_by_last_name: string;
  };
  status: 'valid' | 'invalid' | 'expired' | 'revoked' | 'not_found';
  message: string;
}

const CertificateVerificationDialog: React.FC<CertificateVerificationDialogProps> = ({ onClose }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`/certificate/verify/${verificationCode}`);
      setResult(response.data);
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setResult({
        is_valid: false,
        status: 'not_found',
        message: 'Certificate not found or verification failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid': return 'success';
      case 'expired': return 'error';
      case 'revoked': return 'default';
      case 'invalid': return 'error';
      case 'not_found': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid': return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'expired':
      case 'revoked':
      case 'invalid':
      case 'not_found': return <ErrorIcon sx={{ color: 'error.main' }} />;
      default: return <ErrorIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon />
          <Typography variant="h6">Certificate Verification</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
          {/* Verification Form */}
        <Box component="form" onSubmit={handleVerify} sx={{ mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
              Verification Code
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="Enter certificate verification code"
                disabled={loading}
                size="small"
              />
              <Button 
                type="submit" 
                disabled={loading} 
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
              >
                {loading ? 'Verifying...' : 'Verify'}
                </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
                Enter the 16-character verification code found on the certificate
            </Typography>
          </Box>
        </Box>

          {/* Verification Result */}
          {result && (
          <Box sx={{ mb: 3 }}>
              {/* Status Header */}
            <Alert 
              severity={result.is_valid ? 'success' : 'error'} 
              icon={getStatusIcon(result.status)}
              sx={{ mb: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {result.is_valid ? 'Certificate Valid' : 'Certificate Invalid'}
                </Typography>
                <Chip 
                  label={result.status.toUpperCase()} 
                  color={getStatusColor(result.status) as any} 
                  size="small" 
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {result.message}
              </Typography>
            </Alert>

              {/* Certificate Details */}
              {result.certificate && (
              <Box sx={{ mt: 2 }}>
                  <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Certificate Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Certificate Number:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {result.certificate.certificate_number}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Type:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {result.certificate.certificate_type_name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Status:
                          </Typography>
                          <Chip 
                            label={result.certificate.status} 
                            color={getStatusColor(result.certificate.status) as any}
                            size="small"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateVerificationDialog;