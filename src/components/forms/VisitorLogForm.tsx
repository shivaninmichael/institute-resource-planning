import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface VisitorLog {
  id?: number;
  hostel_id: number;
  student_id: number;
  visitor_name: string;
  visitor_phone: string;
  visitor_id_type?: string;
  visitor_id_number?: string;
  purpose: string;
  check_in_time: string;
  check_out_time?: string;
  status: string;
  notes?: string;
}

interface Hostel {
  id: number;
  name: string;
  code: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  gr_no: string;
}

interface VisitorLogFormProps {
  visitorLog?: VisitorLog | null;
  onClose: () => void;
  onSuccess: () => void;
}

const VisitorLogForm: React.FC<VisitorLogFormProps> = ({ visitorLog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<VisitorLog>({
    hostel_id: 0,
    student_id: 0,
    visitor_name: '',
    visitor_phone: '',
    visitor_id_type: 'national_id',
    visitor_id_number: '',
    purpose: '',
    check_in_time: new Date().toISOString().slice(0, 16),
    check_out_time: '',
    status: 'checked_in',
    notes: ''
  });
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHostels();
    loadStudents();
    if (visitorLog) {
      setFormData(visitorLog);
    }
  }, [visitorLog]);

  const loadHostels = async () => {
    try {
      const data = await api.hostel.getAllHostels();
      setHostels(data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await api.students.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (visitorLog?.id) {
        await api.hostel.updateVisitorLog(visitorLog.id, formData);
        toast.success('Visitor log updated successfully');
      } else {
        await api.hostel.createVisitorLog(formData);
        toast.success('Visitor logged successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving visitor log:', error);
      toast.error('Failed to save visitor log');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof VisitorLog, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckOut = async () => {
    if (!visitorLog?.id) return;
    
    setLoading(true);
    try {
      await api.hostel.checkOutVisitor(visitorLog.id);
      toast.success('Visitor checked out successfully');
      onSuccess();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast.error('Failed to check out visitor');
    } finally {
      setLoading(false);
    }
  };

  const selectedHostel = hostels.find(hostel => hostel.id === formData.hostel_id);
  const selectedStudent = students.find(student => student.id === formData.student_id);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAddIcon />
            <Typography variant="h6">
              {visitorLog?.id ? 'Edit Visitor Log' : 'Log Visitor'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Hostel and Student Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Hostel & Student Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Hostel</InputLabel>
                  <Select 
                    value={formData.hostel_id} 
                    onChange={(e) => handleChange('hostel_id', String(e.target.value))}
                    label="Hostel"
                  >
                    {hostels.map((hostel) => (
                      <MenuItem key={hostel.id} value={hostel.id}>
                        {hostel.name} ({hostel.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Student</InputLabel>
                  <Select 
                    value={formData.student_id} 
                    onChange={(e) => handleChange('student_id', String(e.target.value))}
                    label="Student"
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.gr_no})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Visitor Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Visitor Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Visitor Name"
                  value={formData.visitor_name}
                  onChange={(e) => handleChange('visitor_name', e.target.value)}
                  placeholder="Enter visitor name"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Visitor Phone"
                  value={formData.visitor_phone}
                  onChange={(e) => handleChange('visitor_phone', e.target.value)}
                  placeholder="Enter visitor phone"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>ID Type</InputLabel>
                  <Select 
                    value={formData.visitor_id_type || 'national_id'} 
                    onChange={(e) => handleChange('visitor_id_type', e.target.value as string)}
                    label="ID Type"
                  >
                    <MenuItem value="national_id">National ID</MenuItem>
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="driving_license">Driving License</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID Number"
                  value={formData.visitor_id_number || ''}
                  onChange={(e) => handleChange('visitor_id_number', e.target.value)}
                  placeholder="Enter ID number"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose of Visit"
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="Enter purpose of visit"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Visit Timing */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Visit Timing
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Check-in Time"
                  type="datetime-local"
                  value={formData.check_in_time}
                  onChange={(e) => handleChange('check_in_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Check-out Time"
                  type="datetime-local"
                  value={formData.check_out_time || ''}
                  onChange={(e) => handleChange('check_out_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select 
                    value={formData.status} 
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    label="Status"
                  >
                    <MenuItem value="checked_in">Checked In</MenuItem>
                    <MenuItem value="checked_out">Checked Out</MenuItem>
                    <MenuItem value="overstayed">Overstayed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Enter any additional notes"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        {visitorLog?.id && visitorLog.status === 'checked_in' && (
          <Button 
            onClick={handleCheckOut}
            disabled={loading}
            variant="contained"
            color="secondary"
          >
            {loading ? <CircularProgress size={20} /> : 'Check Out'}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={loading} 
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSubmit}
        >
          {loading ? 'Saving...' : 'Save Log'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitorLogForm;
