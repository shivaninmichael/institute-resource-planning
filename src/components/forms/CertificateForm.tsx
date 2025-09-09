import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { toast } from 'react-hot-toast';
import { api, courseApi } from '../../services/api';

interface Certificate {
  id?: number;
  certificate_type_id: number;
  template_id: number;
  student_id: number;
  course_id?: number;
  batch_id?: number;
  issued_date: string;
  expiry_date?: string;
  status: 'issued' | 'expired' | 'revoked' | 'pending';
  data?: any;
}

interface CertificateType {
  id: number;
  name: string;
  code: string;
}

interface CertificateTemplate {
  id: number;
  name: string;
  certificate_type_id: number;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  gr_no: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
}

interface Batch {
  id: number;
  name: string;
}

interface CertificateFormProps {
  certificate?: Certificate | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ certificate, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Certificate>({
    certificate_type_id: 0,
    template_id: 0,
    student_id: 0,
    course_id: 0,
    batch_id: 0,
    issued_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    status: 'issued',
    data: {}
  });
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
    if (certificate) {
      setFormData(certificate);
    }
  }, [certificate]);

  useEffect(() => {
    if (formData.certificate_type_id) {
      loadTemplatesForType(formData.certificate_type_id);
    }
  }, [formData.certificate_type_id]);

  const loadInitialData = async () => {
    try {
      const [typesData, studentsData, coursesData, batchesData] = await Promise.all([
        (api as any).certificate.getAllCertificateTypes(),
        api.students.getStudents(),
        courseApi.getCourses(),
        (api as any).course.getAllBatches()
      ]);
      
      setCertificateTypes(typesData);
      setStudents(studentsData);
      setCourses(coursesData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadTemplatesForType = async (typeId: number) => {
    try {
      const data = await (api as any).certificate.getAllCertificateTemplates({ certificate_type_id: typeId });
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (certificate?.id) {
        await (api as any).certificate.updateCertificate(certificate.id, formData);
        toast.success('Certificate updated successfully');
      } else {
        await (api as any).certificate.createCertificate(formData);
        toast.success('Certificate created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error('Failed to save certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Certificate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedStudent = () => {
    return students.find(s => s.id === formData.student_id);
  };

  const getSelectedCourse = () => {
    return courses.find(c => c.id === formData.course_id);
  };

  const getSelectedBatch = () => {
    return batches.find(b => b.id === formData.batch_id);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        p: 2
      }}
    >
      <Card sx={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
        <CardHeader
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2
          }}
        >
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon />
            {certificate?.id ? 'Edit Certificate' : 'Create New Certificate'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </CardHeader>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 3 } }}>
            {/* Certificate Type and Template */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Certificate Details</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Certificate Type *</InputLabel>
                    <Select 
                      value={formData.certificate_type_id} 
                      onChange={(e) => handleChange('certificate_type_id', e.target.value as number)}
                      label="Certificate Type *"
                    >
                      {certificateTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name} ({type.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Template *</InputLabel>
                    <Select 
                      value={formData.template_id} 
                      onChange={(e) => handleChange('template_id', e.target.value as number)}
                      label="Template *"
                      disabled={!formData.certificate_type_id}
                    >
                      {templates.map((template) => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status *</InputLabel>
                    <Select 
                      value={formData.status} 
                      onChange={(e) => handleChange('status', e.target.value as Certificate['status'])}
                      label="Status *"
                    >
                      <MenuItem value="issued">Issued</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                      <MenuItem value="revoked">Revoked</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Student Information */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Student Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Student *</InputLabel>
                    <Select 
                      value={formData.student_id} 
                      onChange={(e) => handleChange('student_id', e.target.value as number)}
                      label="Student *"
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} ({student.gr_no})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {getSelectedStudent() && (
                    <Paper sx={{ mt: 1, p: 1, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" color="text.secondary">
                        Selected: {getSelectedStudent()?.first_name} {getSelectedStudent()?.last_name} 
                        (GR No: {getSelectedStudent()?.gr_no})
                      </Typography>
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Course (Optional)</InputLabel>
                    <Select 
                      value={formData.course_id || ''} 
                      onChange={(e) => handleChange('course_id', e.target.value ? Number(e.target.value) : 0)}
                      label="Course (Optional)"
                    >
                      <MenuItem value="">No Course</MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Batch (Optional)</InputLabel>
                    <Select 
                      value={formData.batch_id || ''} 
                      onChange={(e) => handleChange('batch_id', e.target.value ? Number(e.target.value) : 0)}
                      label="Batch (Optional)"
                    >
                      <MenuItem value="">No Batch</MenuItem>
                      {batches.map((batch) => (
                        <MenuItem key={batch.id} value={batch.id}>
                          {batch.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Dates */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon />
                Dates
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Issued Date *"
                    type="date"
                    value={formData.issued_date}
                    onChange={(e) => handleChange('issued_date', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date (Optional)"
                    type="date"
                    value={formData.expiry_date || ''}
                    onChange={(e) => handleChange('expiry_date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="Leave empty for certificates that never expire"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Additional Data */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Additional Information</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Additional certificate data can be added here. This information will be included in the certificate.
              </Typography>
              {/* You can add more fields here for custom certificate data */}
            </Box>

            {/* Form Actions */}
            <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {loading ? 'Saving...' : 'Save Certificate'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CertificateForm;
