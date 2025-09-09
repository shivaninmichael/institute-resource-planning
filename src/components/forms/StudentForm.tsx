import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi, commonApi } from '../../services/api';
import { Student, StudentCreateRequest, Country, State, Category } from '../../types';

interface StudentFormData extends Omit<StudentCreateRequest, 'birth_date'> {
  birth_date: Date | null;
  active: boolean;
}

export const StudentForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [student, setStudent] = useState<Student | null>(null);

  const isEditMode = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<StudentFormData>({
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      birth_date: null,
      blood_group: '',
      gender: 'm',
      nationality_id: undefined,
      emergency_contact_id: undefined,
      visa_info: '',
      id_number: '',
      gr_no: '',
      category_id: undefined,
      certificate_number: '',
      email: '',
      phone: '',
      active: true,
    },
  });

  const selectedCountry = watch('nationality_id');

  useEffect(() => {
    loadFormData();
  }, [id]);

  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load common data
      const [countriesRes, categoriesRes] = await Promise.all([
        commonApi.getCountries(),
        commonApi.getCategories(),
      ]);

      setCountries(countriesRes.data || []);
      setCategories(categoriesRes.data || []);

      // Load student data if editing
      if (isEditMode && id) {
        const studentRes = await studentApi.getStudent(parseInt(id));
        const studentData = studentRes.data;
        setStudent(studentData);

        // Set form values
        reset({
          first_name: studentData.first_name || '',
          middle_name: studentData.middle_name || '',
          last_name: studentData.last_name || '',
          birth_date: studentData.birth_date ? new Date(studentData.birth_date) : null,
          blood_group: studentData.blood_group || '',
          gender: studentData.gender || 'm',
          nationality_id: studentData.nationality_id || undefined,
          emergency_contact_id: studentData.emergency_contact_id || undefined,
          visa_info: studentData.visa_info || '',
          id_number: studentData.id_number || '',
          gr_no: studentData.gr_no || '',
          category_id: studentData.category_id || undefined,
          certificate_number: studentData.certificate_number || '',
          email: studentData.user?.email || '',
          phone: studentData.user?.phone || '',
          active: studentData.active ?? true,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load form data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async (countryId: number) => {
    try {
      const response = await commonApi.getStates(countryId);
      setStates(response.data || []);
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  };

  const onSubmit = async (data: StudentFormData): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      const studentData = {
        ...data,
        birth_date: data.birth_date ? data.birth_date.toISOString() : undefined,
      };

      if (isEditMode && id) {
        await studentApi.updateStudent(parseInt(id), studentData);
      } else {
        await studentApi.createStudent(studentData);
      }

      navigate('/students');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save student';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Student' : 'Add New Student'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                        required
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="middle_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Middle Name"
                        error={!!errors.middle_name}
                        helperText={errors.middle_name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                        required
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Birth Date"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.birth_date,
                            helperText: errors.birth_date?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth required error={!!errors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select {...field} label="Gender">
                          <MenuItem value="m">Male</MenuItem>
                          <MenuItem value="f">Female</MenuItem>
                          <MenuItem value="o">Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="blood_group"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Blood Group"
                        error={!!errors.blood_group}
                        helperText={errors.blood_group?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        required
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
                    name="nationality_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.nationality_id}>
                        <InputLabel>Nationality</InputLabel>
                        <Select {...field} label="Nationality">
                          <MenuItem value="">Select Nationality</MenuItem>
                          {countries.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category_id}>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          <MenuItem value="">Select Category</MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Academic Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="gr_no"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="GR Number"
                        error={!!errors.gr_no}
                        helperText={errors.gr_no?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="id_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="ID Number"
                        error={!!errors.id_number}
                        helperText={errors.id_number?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="certificate_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Certificate Number"
                        error={!!errors.certificate_number}
                        helperText={errors.certificate_number?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="visa_info"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Visa Information"
                        error={!!errors.visa_info}
                        helperText={errors.visa_info?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Status
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(field.value)}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Active Student"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Saving...' : (isEditMode ? 'Update Student' : 'Create Student')}
            </Button>

            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default StudentForm;
