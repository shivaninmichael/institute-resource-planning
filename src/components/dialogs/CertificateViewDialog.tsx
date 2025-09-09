import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-hot-toast';

interface Certificate {
  id: number;
  certificate_number: string;
  certificate_type_id: number;
  template_id: number;
  student_id: number;
  course_id?: number;
  batch_id?: number;
  issued_date: string;
  expiry_date?: string;
  status: 'issued' | 'expired' | 'revoked' | 'pending';
  verification_code: string;
  created_at: string;
  certificate_type_name: string;
  template_name: string;
  student_first_name: string;
  student_last_name: string;
  student_gr_no: string;
  course_name?: string;
  batch_name?: string;
  issued_by_first_name: string;
  issued_by_last_name: string;
}

interface CertificateViewDialogProps {
  certificate: Certificate;
  onClose: () => void;
}

const CertificateViewDialog: React.FC<CertificateViewDialogProps> = ({ certificate, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'issued': return 'success';
      case 'expired': return 'error';
      case 'revoked': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDownload = () => {
    // This would implement PDF download functionality
    toast.success('Certificate download started');
  };

  const isExpired = certificate.expiry_date && new Date(certificate.expiry_date) < new Date();
  const isExpiringSoon = certificate.expiry_date && 
    new Date(certificate.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon />
            <Typography variant="h6">Certificate Details</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          {/* Certificate Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {certificate.certificate_number}
              </Typography>
              <Typography color="text.secondary">
                {certificate.certificate_type_name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                label={certificate.status.toUpperCase()} 
                color={getStatusColor(certificate.status) as any}
                size="small"
              />
              {isExpired && (
                <Chip 
                  label="EXPIRED" 
                  color="error" 
                  size="small"
                />
              )}
              {isExpiringSoon && !isExpired && (
                <Chip 
                  label="EXPIRING SOON" 
                  color="warning" 
                  size="small"
                />
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button 
              onClick={handleDownload} 
              variant="contained" 
              startIcon={<DownloadIcon />}
            >
              Download PDF
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => copyToClipboard(certificate.verification_code, 'Verification code')}
              startIcon={<ContentCopyIcon />}
            >
              Copy Verification Code
            </Button>
          </Box>

          {/* Certificate Information Grid */}
          <Grid container spacing={3} mb={3}>
            {/* Student Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    <PersonIcon />
                    Student Information
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography color="text.secondary">Name:</Typography>
                    <Typography fontWeight="medium">
                      {certificate.student_first_name} {certificate.student_last_name}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography color="text.secondary">GR Number:</Typography>
                    <Typography fontWeight="medium">{certificate.student_gr_no}</Typography>
                  </Box>
                  {certificate.course_name && (
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography color="text.secondary">Course:</Typography>
                      <Typography fontWeight="medium">{certificate.course_name}</Typography>
                    </Box>
                  )}
                  {certificate.batch_name && (
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography color="text.secondary">Batch:</Typography>
                      <Typography fontWeight="medium">{certificate.batch_name}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Certificate Details */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    <DescriptionIcon />
                    Certificate Details
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography color="text.secondary">Type:</Typography>
                    <Typography fontWeight="medium">{certificate.certificate_type_name}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography color="text.secondary">Template:</Typography>
                    <Typography fontWeight="medium">{certificate.template_name}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography color="text.secondary">Status:</Typography>
                    <Chip 
                      label={certificate.status} 
                      color={getStatusColor(certificate.status) as any}
                      size="small"
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography color="text.secondary">Issued By:</Typography>
                    <Typography fontWeight="medium">
                      {certificate.issued_by_first_name} {certificate.issued_by_last_name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Dates Information */}
          <Card sx={{ mb: 3 }}>
            <CardHeader>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon />
                Important Dates
              </Typography>
            </CardHeader>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Issued Date
                    </Typography>
                    <Typography variant="h6" fontWeight="semibold">
                      {new Date(certificate.issued_date).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
                {certificate.expiry_date && (
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Expiry Date
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight="semibold"
                        color={isExpired ? 'error' : isExpiringSoon ? 'warning.main' : 'text.primary'}
                      >
                        {new Date(certificate.expiry_date).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Created
                    </Typography>
                    <Typography variant="h6" fontWeight="semibold">
                      {new Date(certificate.created_at).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Verification Information */}
          <Card sx={{ mb: 3 }}>
            <CardHeader>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <CheckCircleIcon />
                Verification Information
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography fontWeight="medium" gutterBottom>
                      Verification Code
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use this code to verify the certificate online
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Paper 
                      component="code" 
                      sx={{ 
                        p: 1, 
                        bgcolor: 'white', 
                        border: 1, 
                        borderColor: 'grey.300',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem'
                      }}
                    >
                      {certificate.verification_code}
                    </Paper>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => copyToClipboard(certificate.verification_code, 'Verification code')}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                  </Box>
                </Paper>
              </Box>
              <Typography variant="body2" color="text.secondary">
                This certificate can be verified online using the verification code above. 
                The certificate is digitally signed and tamper-proof.
              </Typography>
            </CardContent>
          </Card>

          {/* Certificate Preview */}
          <Card sx={{ mb: 3 }}>
            <CardHeader>
              <Typography variant="h6">Certificate Preview</Typography>
            </CardHeader>
            <CardContent>
              <Paper 
                sx={{ 
                  border: 2, 
                  borderStyle: 'dashed', 
                  borderColor: 'grey.300', 
                  borderRadius: 2, 
                  p: 4, 
                  textAlign: 'center' 
                }}
              >
                <Box sx={{ '& > *': { mb: 1 } }}>
                  <Typography variant="h4" fontWeight="bold">
                    CERTIFICATE
                  </Typography>
                  <Typography variant="h6">
                    This is to certify that
                  </Typography>
                  <Typography variant="h5" fontWeight="semibold">
                    {certificate.student_first_name} {certificate.student_last_name}
                  </Typography>
                  <Typography variant="body1">
                    has successfully completed the requirements for
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {certificate.certificate_type_name}
                  </Typography>
                  {certificate.course_name && (
                    <Typography variant="body1">
                      in {certificate.course_name}
                    </Typography>
                  )}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Certificate Number: {certificate.certificate_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Issued on: {new Date(certificate.issued_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </CardContent>
          </Card>

          {/* Close Button */}
          <Box display="flex" justifyContent="flex-end" pt={2} borderTop={1} borderColor="divider">
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateViewDialog;
