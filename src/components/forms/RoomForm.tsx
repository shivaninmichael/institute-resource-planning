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
import BedIcon from '@mui/icons-material/Bed';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';
import { ApiClient } from '../../types/api';

const typedApi = api as unknown as ApiClient;

interface Room {
  id?: number;
  hostel_id: number;
  room_number: string;
  category_id: number;
  capacity: number;
  status: string;
  description?: string;
  floor?: number;
  block?: string;
}

interface RoomCategory {
  id: number;
  name: string;
  description?: string;
}

interface Hostel {
  id: number;
  name: string;
  code: string;
}

interface RoomFormProps {
  room?: Room | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Room>({
    hostel_id: 0,
    room_number: '',
    category_id: 0,
    capacity: 1,
    status: 'available',
    description: '',
    floor: 1,
    block: ''
  });
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHostels();
    loadCategories();
    if (room) {
      setFormData(room);
    }
  }, [room]);

  const loadHostels = async () => {
    try {
      const data = await typedApi.hostel.getAllHostels();
      setHostels(data.data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await typedApi.hostel.getAllRoomCategories();
      setCategories(data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (room?.id) {
        await typedApi.hostel.updateRoom(room.id, formData);
        toast.success('Room updated successfully');
      } else {
        await typedApi.hostel.createRoom(formData);
        toast.success('Room created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error('Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Room, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <BedIcon />
            <Typography variant="h6">
              {room?.id ? 'Edit Room' : 'Create New Room'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Room Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Hostel</InputLabel>
                  <Select 
                    value={formData.hostel_id} 
                    onChange={(e) => handleChange('hostel_id', Number(e.target.value))}
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
                <TextField
                  fullWidth
                  label="Room Number"
                  value={formData.room_number}
                  onChange={(e) => handleChange('room_number', e.target.value)}
                  placeholder="Enter room number"
                  required
                />
              </Grid>
            </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Room Category</InputLabel>
                    <Select
                      value={formData.category_id}
                      onChange={(e) => handleChange('category_id', Number(e.target.value))}
                      label="Room Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', Number(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Floor"
                    type="number"
                    value={formData.floor || ''}
                    onChange={(e) => handleChange('floor', Number(e.target.value) || 0)}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Block"
                    value={formData.block || ''}
                    onChange={(e) => handleChange('block', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="occupied">Occupied</MenuItem>
                      <MenuItem value="maintenance">Under Maintenance</MenuItem>
                      <MenuItem value="reserved">Reserved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading ? 'Saving...' : 'Save Room'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
