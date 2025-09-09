import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { useTransportation } from '../../contexts/TransportationContext';

interface DriverFormProps {
  driver?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const licenseTypes = [
  { value: 'light_motor_vehicle', label: 'Light Motor Vehicle (LMV)' },
  { value: 'heavy_motor_vehicle', label: 'Heavy Motor Vehicle (HMV)' },
  { value: 'transport_vehicle', label: 'Transport Vehicle' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'commercial', label: 'Commercial' },
];

export const DriverForm: React.FC<DriverFormProps> = ({ driver, onSubmit, onCancel }) => {
  const { createDriver, state } = useTransportation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    partner_id: '',
    license_no: '',
    license_type: 'transport_vehicle',
    license_expiry: '',
    experience_years: '',
    joining_date: '',
    medical_expiry: '',
  });

  useEffect(() => {
    // In a real app, you'd fetch partners from an API
    // For now, we'll use mock data
    setPartners([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' },
      { id: 4, name: 'Sarah Wilson' },
    ]);

    if (driver) {
      setFormData({
        partner_id: driver.partner_id?.toString() || '',
        license_no: driver.license_no || '',
        license_type: driver.license_type || 'transport_vehicle',
        license_expiry: driver.license_expiry ? driver.license_expiry.split('T')[0] : '',
        experience_years: driver.experience_years?.toString() || '',
        joining_date: driver.joining_date ? driver.joining_date.split('T')[0] : '',
        medical_expiry: driver.medical_expiry ? driver.medical_expiry.split('T')[0] : '',
      });
    }
  }, [driver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartnerChange = (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      partner_id: newValue ? newValue.id.toString() : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.partner_id || !formData.license_no) {
        throw new Error('Partner and license number are required');
      }

      const submitData = {
        partner_id: parseInt(formData.partner_id),
        license_no: formData.license_no,
        license_type: formData.license_type || undefined,
        license_expiry: formData.license_expiry || undefined,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        joining_date: formData.joining_date || undefined,
        medical_expiry: formData.medical_expiry || undefined,
      };

      await createDriver({ ...submitData, status: 'active' });
      onSubmit();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the driver');
    } finally {
      setLoading(false);
    }
  };

  const selectedPartner = partners.find(p => p.id.toString() === formData.partner_id);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={partners}
            getOptionLabel={(option) => option.name}
            value={selectedPartner || null}
            onChange={handlePartnerChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Partner/Employee"
                required
                variant="outlined"
                placeholder="Search for a partner or employee"
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Typography variant="caption" color="textSecondary">
            Select the partner/employee who will be the driver
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="License Number"
            name="license_no"
            value={formData.license_no}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="e.g., DL-1420110012345"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="License Type"
            name="license_type"
            value={formData.license_type}
            onChange={handleChange}
            variant="outlined"
          >
            {licenseTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="License Expiry Date"
            name="license_expiry"
            type="date"
            value={formData.license_expiry}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Experience (Years)"
            name="experience_years"
            type="number"
            value={formData.experience_years}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Joining Date"
            name="joining_date"
            type="date"
            value={formData.joining_date}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Medical Certificate Expiry"
            name="medical_expiry"
            type="date"
            value={formData.medical_expiry}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Note:</strong> Make sure the selected partner has valid contact information and 
          all required documents. The driver's personal details will be inherited from the partner profile.
        </Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : driver ? 'Update Driver' : 'Create Driver'}
        </Button>
      </Box>
    </Box>
  );
};
