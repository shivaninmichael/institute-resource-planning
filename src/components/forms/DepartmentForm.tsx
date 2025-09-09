import React, { useState, useEffect } from 'react';
import { Department, Faculty } from '../../types';
import { DepartmentStatus } from '../../types/enums';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { departmentApi, facultyApi } from '../../services/api';
// import { DepartmentStatus } from '../../types';

interface DepartmentFormData {
  code: string;
  name: string;
  description: string;
  head_id: string;
  status: DepartmentStatus;
  established_date: Date | null;
  budget: number;
  location: string;
  phone: string;
  email: string;
  vision: string;
  mission: string;
  objectives: string;
}

const DepartmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<DepartmentFormData>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      head_id: '',
      status: 'active',
      established_date: null,
      budget: 0,
      location: '',
      phone: '',
      email: '',
      vision: '',
      mission: '',
      objectives: '',
    },
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load faculty for head selection
      const facultyResponse = await facultyApi.getFaculty();
      setFaculty(facultyResponse.data);

      // Load department data if editing
      if (id && id !== 'new') {
        const departmentResponse = await departmentApi.getDepartment(parseInt(id));
        const departmentData = departmentResponse.data;
        setDepartment(departmentData);
        
        // Set form values
        reset({
          code: departmentData.code,
          name: departmentData.name,
          description: departmentData.description,
          head_id: departmentData.head_id || '',
          status: departmentData.status,
          established_date: departmentData.established_date ? new Date(departmentData.established_date) : null,
          budget: departmentData.budget || 0,
          location: departmentData.location || '',
          phone: departmentData.phone || '',
          email: departmentData.email || '',
          vision: departmentData.vision || '',
          mission: departmentData.mission || '',
          objectives: departmentData.objectives || '',
        });
      }
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<DepartmentFormData> = async (data) => {
    try {
      setSaving(true);
      setError(null);

      const departmentData = {
        ...data,
        established_date: data.established_date?.toISOString(),
      };

      if (id && id !== 'new') {
        await departmentApi.updateDepartment(parseInt(id), departmentData);
      } else {
        await departmentApi.createDepartment(departmentData);
      }

      navigate('/departments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save department');
      console.error('Error saving department:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {id === 'new' ? 'Add New Department' : 'Edit Department'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/departments')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving || !isDirty}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<BusinessIcon />}
                  title="Basic Information"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="code"
                        control={control}
                        rules={{ required: 'Department code is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Department Code"
                            error={!!errors.code}
                            helperText={errors.code?.message}
                            placeholder="e.g., CSE, EEE, MECH"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Department name is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Department Name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="head_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.head_id}>
                            <InputLabel>Head of Department</InputLabel>
                            <Select {...field} label="Head of Department">
                              <MenuItem value="">No Head Assigned</MenuItem>
                              {faculty.map((facultyMember) => (
                                <MenuItem key={facultyMember.id} value={facultyMember.id}>
                                  {facultyMember.first_name} {facultyMember.last_name} - {facultyMember.position || ""}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>Status</InputLabel>
                            <Select {...field} label="Status">
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact & Location */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<PersonIcon />}
                  title="Contact & Location"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Location"
                            error={!!errors.location}
                            helperText={errors.location?.message}
                            placeholder="Building, Floor, Room"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Phone Number"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="established_date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Established Date"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.established_date,
                                helperText: errors.established_date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="budget"
                        control={control}
                        rules={{ min: { value: 0, message: 'Budget must be positive' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Annual Budget"
                            type="number"
                            error={!!errors.budget}
                            helperText={errors.budget?.message}
                            InputProps={{
                              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Vision, Mission & Objectives */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<SchoolIcon />}
                  title="Vision, Mission & Objectives"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="vision"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Vision"
                            multiline
                            rows={3}
                            error={!!errors.vision}
                            helperText={errors.vision?.message}
                            placeholder="Department's vision statement..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="mission"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Mission"
                            multiline
                            rows={4}
                            error={!!errors.mission}
                            helperText={errors.mission?.message}
                            placeholder="Department's mission statement..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="objectives"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Objectives"
                            multiline
                            rows={5}
                            error={!!errors.objectives}
                            helperText={errors.objectives?.message}
                            placeholder="List the main objectives and goals of the department..."
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default DepartmentForm;

