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
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Schedule from '@mui/icons-material/Schedule';
import { useTransportation } from '../../contexts/TransportationContext';

interface RouteFormProps {
  route?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const routeTypes = [
  { value: 'pickup', label: 'Pickup Only' },
  { value: 'drop', label: 'Drop Only' },
  { value: 'both', label: 'Both Pickup & Drop' },
];

interface RouteStop {
  name: string;
  sequence: number;
  latitude?: string;
  longitude?: string;
  morning_time?: string;
  evening_time?: string;
  distance_from_start?: string;
}

export const RouteForm: React.FC<RouteFormProps> = ({ route, onSubmit, onCancel }) => {
  const { createRoute, createRouteStop, state } = useTransportation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    start_point: '',
    end_point: '',
    distance: '',
    estimated_time: '',
    morning_start_time: '',
    morning_end_time: '',
    evening_start_time: '',
    evening_end_time: '',
    type: 'both',
  });

  const [stops, setStops] = useState<RouteStop[]>([]);
  const [newStop, setNewStop] = useState<RouteStop>({
    name: '',
    sequence: 1,
    latitude: '',
    longitude: '',
    morning_time: '',
    evening_time: '',
    distance_from_start: '',
  });

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name || '',
        code: route.code || '',
        start_point: route.start_point || '',
        end_point: route.end_point || '',
        distance: route.distance?.toString() || '',
        estimated_time: route.estimated_time?.toString() || '',
        morning_start_time: route.morning_start_time || '',
        morning_end_time: route.morning_end_time || '',
        evening_start_time: route.evening_start_time || '',
        evening_end_time: route.evening_end_time || '',
        type: route.type || 'both',
      });

      if (route.stops) {
        setStops(route.stops.map((stop: any) => ({
          name: stop.name,
          sequence: stop.sequence,
          latitude: stop.latitude?.toString() || '',
          longitude: stop.longitude?.toString() || '',
          morning_time: stop.morning_time || '',
          evening_time: stop.evening_time || '',
          distance_from_start: stop.distance_from_start?.toString() || '',
        })));
      }
    }
  }, [route]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStop(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addStop = () => {
    if (!newStop.name) {
      setError('Stop name is required');
      return;
    }

    const stopToAdd = {
      ...newStop,
      sequence: stops.length + 1,
    };

    setStops(prev => [...prev, stopToAdd]);
    setNewStop({
      name: '',
      sequence: stops.length + 2,
      latitude: '',
      longitude: '',
      morning_time: '',
      evening_time: '',
      distance_from_start: '',
    });
    setError(null);
  };

  const removeStop = (index: number) => {
    setStops(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Resequence the remaining stops
      return updated.map((stop, i) => ({ ...stop, sequence: i + 1 }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.start_point || !formData.end_point) {
        throw new Error('Name, code, start point, and end point are required');
      }

      const submitData = {
        ...formData,
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : undefined,
        morning_start_time: formData.morning_start_time || undefined,
        morning_end_time: formData.morning_end_time || undefined,
        evening_start_time: formData.evening_start_time || undefined,
        evening_end_time: formData.evening_end_time || undefined,
      };

      const createdRoute = await createRoute(submitData);

      // Create stops if any
      for (const stop of stops) {
        const stopData = {
          route_id: (createdRoute as any)?.id || 0,
          name: stop.name,
          sequence: stop.sequence,
          latitude: stop.latitude ? parseFloat(stop.latitude) : undefined,
          longitude: stop.longitude ? parseFloat(stop.longitude) : undefined,
          morning_time: stop.morning_time || undefined,
          evening_time: stop.evening_time || undefined,
          distance_from_start: stop.distance_from_start ? parseFloat(stop.distance_from_start) : undefined,
        };

        await createRouteStop(stopData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the route');
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

      <Typography variant="h6" gutterBottom>
        Route Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Route Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="e.g., North Campus Route"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Route Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="e.g., NR001"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Point"
            name="start_point"
            value={formData.start_point}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="e.g., School Campus"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Point"
            name="end_point"
            value={formData.end_point}
            onChange={handleChange}
            required
            variant="outlined"
            placeholder="e.g., North Terminal"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Distance (km)"
            name="distance"
            type="number"
            value={formData.distance}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estimated Time (minutes)"
            name="estimated_time"
            type="number"
            value={formData.estimated_time}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Route Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            variant="outlined"
          >
            {routeTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Schedule Timings
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Morning Start Time"
            name="morning_start_time"
            type="time"
            value={formData.morning_start_time}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Morning End Time"
            name="morning_end_time"
            type="time"
            value={formData.morning_end_time}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Evening Start Time"
            name="evening_start_time"
            type="time"
            value={formData.evening_start_time}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Evening End Time"
            name="evening_end_time"
            type="time"
            value={formData.evening_end_time}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Route Stops
      </Typography>

      {/* Add New Stop */}
      <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add Stop
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Stop Name"
              name="name"
              value={newStop.name}
              onChange={handleStopChange}
              variant="outlined"
              size="small"
              placeholder="e.g., Main Gate"
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Distance (km)"
              name="distance_from_start"
              type="number"
              value={newStop.distance_from_start}
              onChange={handleStopChange}
              variant="outlined"
              size="small"
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Morning Time"
              name="morning_time"
              type="time"
              value={newStop.morning_time}
              onChange={handleStopChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Evening Time"
              name="evening_time"
              type="time"
              value={newStop.evening_time}
              onChange={handleStopChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={addStop}
              startIcon={<Add />}
              size="small"
            >
              Add Stop
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Existing Stops */}
      {stops.length > 0 && (
        <List>
          {stops.map((stop, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`${stop.sequence}. ${stop.name}`}
                secondary={
                  <Box>
                    {stop.distance_from_start && (
                      <Typography variant="body2">
                        Distance: {stop.distance_from_start} km
                      </Typography>
                    )}
                    {(stop.morning_time || stop.evening_time) && (
                      <Typography variant="body2">
                        Times: {stop.morning_time || 'N/A'} (Morning), {stop.evening_time || 'N/A'} (Evening)
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => removeStop(index)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

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
          {loading ? 'Saving...' : route ? 'Update Route' : 'Create Route'}
        </Button>
      </Box>
    </Box>
  );
};
