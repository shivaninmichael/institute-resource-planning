import React, { useState, useEffect } from 'react';
import { Faculty, Country, State } from '../../types';
import { FacultyDepartment, FacultyStatus } from '../../types/enums';
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
  Divider,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LocationIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { facultyApi, commonApi } from '../../services/api';
// import { FacultyStatus } from '../../types';

interface FacultyFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: Date | null;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  department: FacultyDepartment;
  position: string;
  qualification: string;
  specialization: string;
  join_date: Date | null;
  salary: number;
  status: FacultyStatus;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  bio: string;
  profile_picture?: string;
}

const FacultyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [departments] = useState<{ value: FacultyDepartment; label: string }[]>([
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'economics', label: 'Economics' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'medicine', label: 'Medicine' },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FacultyFormData>({
    defaultValues: {
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: null,
      gender: 'male',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      department: 'computer_science',
      position: '',
      qualification: '',
      specialization: '',
      join_date: null,
      salary: 0,
      status: 'active',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      bio: '',
    },
  });

  const watchedCountry = watch('country');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (watchedCountry) {
      loadStates(watchedCountry);
    }
  }, [watchedCountry]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load countries
      const countriesResponse = await commonApi.getCountries();
      setCountries(countriesResponse.data);

      // Load faculty data if editing
      if (id && id !== 'new') {
        const facultyResponse = await facultyApi.getFacultyById(parseInt(id, 10));
        const facultyData = facultyResponse.data;
        setFaculty(facultyData);
        
        // Set form values
        reset({
          employee_id: facultyData.employee_id,
          first_name: facultyData.first_name,
          last_name: facultyData.last_name,
          email: facultyData.email,
          phone: facultyData.phone,
          date_of_birth: facultyData.date_of_birth ? new Date(facultyData.date_of_birth) : null,
          gender: facultyData.gender,
          address: facultyData.address,
          city: facultyData.city,
          state: facultyData.state,
          country: facultyData.country,
          postal_code: facultyData.postal_code,
          department: facultyData.department,
          position: facultyData.position,
          qualification: facultyData.qualification,
          specialization: facultyData.specialization,
          join_date: facultyData.join_date ? new Date(facultyData.join_date) : null,
          salary: facultyData.salary,
          status: facultyData.status,
          emergency_contact_name: facultyData.emergency_contact_name,
          emergency_contact_phone: facultyData.emergency_contact_phone,
          emergency_contact_relationship: facultyData.emergency_contact_relationship,
          bio: facultyData.bio,
          profile_picture: facultyData.profile_picture,
        });
      }
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async (countryCode: string) => {
    try {
      const statesResponse = await commonApi.getStates(parseInt(countryCode));
      setStates(statesResponse.data);
    } catch (err) {
      console.error('Error loading states:', err);
    }
  };

  const onSubmit: SubmitHandler<FacultyFormData> = async (data) => {
    try {
      setSaving(true);
      setError(null);

      const facultyData = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        join_date: data.join_date?.toISOString(),
      };

      if (id && id !== 'new') {
        await facultyApi.updateFaculty(parseInt(id, 10), facultyData);
      } else {
        await facultyApi.createFaculty(facultyData);
      }

      navigate('/faculty');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save faculty member';
      setError(errorMessage);
      console.error('Error saving faculty:', err);
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
            {id === 'new' ? 'Add New Faculty Member' : 'Edit Faculty Member'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/faculty')}
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
            {/* Profile Picture Section */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  avatar={<Avatar sx={{ width: 80, height: 80 }}><PersonIcon /></Avatar>}
                  title="Profile Picture"
                  action={
                    <IconButton>
                      <PhotoCameraIcon />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  icon={<PersonIcon />}
                  title="Basic Information"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="employee_id"
                        control={control}
                        rules={{ required: 'Employee ID is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Employee ID"
                            error={!!errors.employee_id}
                            helperText={errors.employee_id?.message}
                            disabled={id !== 'new'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                          />
                        )}
                      />
                    </Grid>
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
                        name="phone"
                        control={control}
                        rules={{ required: 'Phone number is required' }}
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
                        name="date_of_birth"
                        control={control}
                        rules={{ required: 'Date of birth is required' }}
                        render={({ field }) => (
                          <DatePicker
                            label="Date of Birth"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.date_of_birth,
                                helperText: errors.date_of_birth?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="gender"
                        control={control}
                        rules={{ required: 'Gender is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.gender}>
                            <InputLabel>Gender</InputLabel>
                            <Select {...field} label="Gender">
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  icon={<ContactMailIcon />}
                  title="Contact Information"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="address"
                        control={control}
                        rules={{ required: 'Address is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Address"
                            multiline
                            rows={3}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'City is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="City"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="state"
                        control={control}
                        rules={{ required: 'State is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.state}>
                            <InputLabel>State</InputLabel>
                            <Select {...field} label="State">
                              {states.map((state) => (
                                <MenuItem key={state.code} value={state.code}>
                                  {state.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: 'Country is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.country}>
                            <InputLabel>Country</InputLabel>
                            <Select {...field} label="Country">
                              {countries.map((country) => (
                                <MenuItem key={country.code} value={country.code}>
                                  {country.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="postal_code"
                        control={control}
                        rules={{ required: 'Postal code is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Postal Code"
                            error={!!errors.postal_code}
                            helperText={errors.postal_code?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  icon={<WorkIcon />}
                  title="Professional Information"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="department"
                        control={control}
                        rules={{ required: 'Department is required' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.department}>
                            <InputLabel>Department</InputLabel>
                            <Select {...field} label="Department">
                              {departments.map((dept) => (
                                <MenuItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="position"
                        control={control}
                        rules={{ required: 'Position is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Position"
                            error={!!errors.position}
                            helperText={errors.position?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="qualification"
                        control={control}
                        rules={{ required: 'Qualification is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Qualification"
                            error={!!errors.qualification}
                            helperText={errors.qualification?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="specialization"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Specialization"
                            error={!!errors.specialization}
                            helperText={errors.specialization?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="join_date"
                        control={control}
                        rules={{ required: 'Join date is required' }}
                        render={({ field }) => (
                          <DatePicker
                            label="Join Date"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.join_date,
                                helperText: errors.join_date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="salary"
                        control={control}
                        rules={{ required: 'Salary is required', min: { value: 0, message: 'Salary must be positive' } }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Salary"
                            type="number"
                            error={!!errors.salary}
                            helperText={errors.salary?.message}
                          />
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
                              <MenuItem value="on_leave">On Leave</MenuItem>
                              <MenuItem value="terminated">Terminated</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  icon={<ContactMailIcon />}
                  title="Emergency Contact"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="emergency_contact_name"
                        control={control}
                        rules={{ required: 'Emergency contact name is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Emergency Contact Name"
                            error={!!errors.emergency_contact_name}
                            helperText={errors.emergency_contact_name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="emergency_contact_phone"
                        control={control}
                        rules={{ required: 'Emergency contact phone is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Emergency Contact Phone"
                            error={!!errors.emergency_contact_phone}
                            helperText={errors.emergency_contact_phone?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="emergency_contact_relationship"
                        control={control}
                        rules={{ required: 'Relationship is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Relationship"
                            error={!!errors.emergency_contact_relationship}
                            helperText={errors.emergency_contact_relationship?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  icon={<SchoolIcon />}
                  title="Biography"
                />
                <CardContent>
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Biography"
                        multiline
                        rows={4}
                        error={!!errors.bio}
                        helperText={errors.bio?.message}
                        placeholder="Tell us about the faculty member's background, experience, and achievements..."
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default FacultyForm;
