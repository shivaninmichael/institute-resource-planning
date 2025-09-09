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
  Paper,
} from '@mui/material';
import { useTransportation } from '../../contexts/TransportationContext';

// Vehicle form types
interface VehicleFormProps {
  vehicle?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

interface VehicleFormData {
  name: string;
  vehicle_no: string;
  type: string;
  registration_number: string;
  make: string;
  model: string;
  year: string;
  capacity: string;
  fuel_type: string;
  fuel_capacity?: string;
  mileage?: string;
  registration_date?: string;
  insurance_expiry?: string;
  fitness_expiry?: string;
  permit_expiry?: string;
  gps_device_id?: string;
  status: string;
}

interface ExtendedVehicleFormProps extends Omit<VehicleFormProps, 'onSubmit'> {
  vehicle?: VehicleFormData & { id: number };
  onSubmit: () => void;
  onCancel: () => void;
}

const vehicleTypes = [
  { value: 'bus', label: 'Bus' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
  { value: 'other', label: 'Other' },
];

const fuelTypes = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const VehicleForm: React.FC<ExtendedVehicleFormProps> = ({ vehicle, onSubmit, onCancel }) => {
  const { createVehicle, updateVehicle, state } = useTransportation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    name: '',
    vehicle_no: '',
    type: 'bus',
    registration_number: '',
    capacity: '0',
    make: '',
    model: '',
    year: '2024',
    registration_date: '',
    insurance_expiry: '',
    fitness_expiry: '',
    permit_expiry: '',
    gps_device_id: '',
    fuel_type: 'diesel',
    fuel_capacity: '',
    mileage: '',
    status: 'active',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        vehicle_no: vehicle.vehicle_no || '',
        type: vehicle.type || 'bus',
        registration_number: vehicle.registration_number || '',
        capacity: vehicle.capacity?.toString() || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        registration_date: vehicle.registration_date ? vehicle.registration_date.split('T')[0] : '',
        insurance_expiry: vehicle.insurance_expiry ? vehicle.insurance_expiry.split('T')[0] : '',
        fitness_expiry: vehicle.fitness_expiry ? vehicle.fitness_expiry.split('T')[0] : '',
        permit_expiry: vehicle.permit_expiry ? vehicle.permit_expiry.split('T')[0] : '',
        gps_device_id: vehicle.gps_device_id || '',
        fuel_type: vehicle.fuel_type || 'diesel',
        fuel_capacity: vehicle.fuel_capacity?.toString() || '',
        mileage: vehicle.mileage?.toString() || '',
        status: vehicle.status || 'active',
      });
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.vehicle_no || !formData.type || !formData.capacity) {
        throw new Error('Name, vehicle number, type, and capacity are required');
      }

      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        year: formData.year ? parseInt(formData.year) : undefined,
        fuel_capacity: formData.fuel_capacity ? parseFloat(formData.fuel_capacity) : undefined,
        mileage: formData.mileage ? parseFloat(formData.mileage) : undefined,
        registration_date: formData.registration_date || undefined,
        insurance_expiry: formData.insurance_expiry || undefined,
        fitness_expiry: formData.fitness_expiry || undefined,
        permit_expiry: formData.permit_expiry || undefined,
        gps_device_id: formData.gps_device_id || undefined,
        status: formData.status || 'active',
      };

      if (vehicle) {
        await updateVehicle(vehicle.id, submitData);
      } else {
        await createVehicle(submitData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} component={Paper} elevation={0}>
        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Vehicle Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Vehicle Number"
            name="vehicle_no"
            value={formData.vehicle_no}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="e.g., KA01AB1234"
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            select
            label="Vehicle Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            variant="outlined"
          >
            {vehicleTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            required
            variant="outlined"
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            variant="outlined"
            placeholder="e.g., Ashok Leyland"
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            variant="outlined"
            placeholder="e.g., School Bus"
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Registration Date"
            name="registration_date"
            type="date"
            value={formData.registration_date}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Insurance Expiry"
            name="insurance_expiry"
            type="date"
            value={formData.insurance_expiry}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Fitness Expiry"
            name="fitness_expiry"
            type="date"
            value={formData.fitness_expiry}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Permit Expiry"
            name="permit_expiry"
            type="date"
            value={formData.permit_expiry}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="GPS Device ID"
            name="gps_device_id"
            value={formData.gps_device_id}
            onChange={handleChange}
            variant="outlined"
            placeholder="Optional GPS tracking device ID"
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            select
            label="Fuel Type"
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            variant="outlined"
          >
            {fuelTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Fuel Capacity (Liters)"
            name="fuel_capacity"
            type="number"
            value={formData.fuel_capacity}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} component="div">
          <TextField
            fullWidth
            label="Mileage (km/l)"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>
      </Grid>

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
          {loading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Create Vehicle'}
        </Button>
      </Box>
    </Box>
  );
};
