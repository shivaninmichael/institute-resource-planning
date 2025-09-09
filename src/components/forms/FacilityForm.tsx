// =====================================================
// Facility Form Component
// Form for creating and editing facilities
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormHelperText,
  IconButton,
  SelectChangeEvent,
  Stack,
  Grid,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface FacilityFormData {
  name: string;
  code: string;
  type: string;
  category: string;
  location: string;
  building: string;
  floor: string;
  roomNumber: string;
  capacity: number;
  area: number;
  description: string;
  amenities: string[];
  equipment: string[];
  isAvailable: boolean;
  maintenanceSchedule: string;
  responsiblePerson: string;
  contactNumber: string;
  notes: string;
  images?: File[];
}

interface FacilityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FacilityFormData) => void;
  facility?: FacilityFormData;
  title?: string;
}

const FacilityForm: React.FC<FacilityFormProps> = ({
  open,
  onClose,
  onSubmit,
  facility,
  title = 'Facility'
}) => {
  const [formData, setFormData] = useState<FacilityFormData>({
    name: '',
    code: '',
    type: '',
    category: '',
    location: '',
    building: '',
    floor: '',
    roomNumber: '',
    capacity: 0,
    area: 0,
    description: '',
    amenities: [],
    equipment: [],
    isAvailable: true,
    maintenanceSchedule: '',
    responsiblePerson: '',
    contactNumber: '',
    notes: '',
    images: []
  });

  const [errors, setErrors] = useState<Partial<FacilityFormData>>({});
  const [newAmenity, setNewAmenity] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const facilityTypes = [
    'Classroom',
    'Laboratory',
    'Library',
    'Auditorium',
    'Conference Room',
    'Office',
    'Sports Facility',
    'Cafeteria',
    'Parking',
    'Storage',
    'Restroom',
    'Common Area'
  ];

  const categories = [
    'Academic',
    'Administrative',
    'Recreational',
    'Support Services',
    'Infrastructure',
    'Emergency'
  ];

  const buildings = [
    'Main Building',
    'Science Block',
    'Engineering Block',
    'Arts Building',
    'Administrative Block',
    'Library Building',
    'Sports Complex',
    'Hostel Block A',
    'Hostel Block B'
  ];

  const commonAmenities = [
    'Air Conditioning',
    'Heating',
    'Wi-Fi',
    'Power Outlets',
    'Natural Lighting',
    'Artificial Lighting',
    'Sound System',
    'Projector',
    'Whiteboard',
    'Blackboard',
    'Water Fountain',
    'Emergency Exit',
    'Fire Extinguisher',
    'Security Camera'
  ];

  const commonEquipment = [
    'Desks',
    'Chairs',
    'Tables',
    'Computer',
    'Laptop',
    'Printer',
    'Scanner',
    'Microscope',
    'Laboratory Equipment',
    'Sports Equipment',
    'Audio System',
    'Video System',
    'Cleaning Equipment'
  ];

  useEffect(() => {
    if (facility) {
      setFormData(facility);
    } else {
      setFormData({
        name: '',
        code: '',
        type: '',
        category: '',
        location: '',
        building: '',
        floor: '',
        roomNumber: '',
        capacity: 0,
        area: 0,
        description: '',
        amenities: [],
        equipment: [],
        isAvailable: true,
        maintenanceSchedule: '',
        responsiblePerson: '',
        contactNumber: '',
        notes: '',
        images: []
      });
    }
    setErrors({});
  }, [facility, open]);

  const handleInputChange = (field: keyof FacilityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter(e => e !== equipment)
    }));
  };

  const addCommonAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const addCommonEquipment = (equipment: string) => {
    if (!formData.equipment.includes(equipment)) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipment]
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FacilityFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Facility name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Facility code is required';
    }
    if (!formData.type) {
      newErrors.type = 'Facility type is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.building) {
      newErrors.building = 'Building is required';
    }
    if (formData.capacity < 0) {
      newErrors.capacity = 'Capacity cannot be negative' as any;
    }
    if (formData.area < 0) {
      newErrors.area = 'Area cannot be negative' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Facility Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Facility Code *"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              error={!!errors.code}
              helperText={errors.code}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Type *</InputLabel>
              <Select
                value={formData.type}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('type', e.target.value)
                }
                label="Type *"
              >
                {facilityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <FormHelperText>{errors.type}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.category}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('category', e.target.value)
                }
                label="Category *"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Location Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Location Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location *"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.building}>
              <InputLabel>Building *</InputLabel>
              <Select
                value={formData.building}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('building', e.target.value)
                }
                label="Building *"
              >
                {buildings.map((building) => (
                  <MenuItem key={building} value={building}>
                    {building}
                  </MenuItem>
                ))}
              </Select>
              {errors.building && (
                <FormHelperText>{errors.building}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Floor"
              value={formData.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Room Number"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange('roomNumber', e.target.value)}
            />
          </Grid>

          {/* Capacity and Area */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
              error={!!errors.capacity}
              helperText={errors.capacity}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Area (sq ft)"
              type="number"
              value={formData.area}
              onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
              error={!!errors.area}
              helperText={errors.area}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </Grid>

          {/* Amenities */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Common Amenities (click to add):
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {commonAmenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => addCommonAmenity(amenity)}
                    variant={formData.amenities.includes(amenity) ? "filled" : "outlined"}
                    color={formData.amenities.includes(amenity) ? "primary" : "default"}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label="Add Custom Amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
              />
              <Button onClick={addAmenity} variant="outlined" startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onDelete={() => removeAmenity(amenity)}
                  color="primary"
                />
              ))}
            </Box>
          </Grid>

          {/* Equipment */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Equipment
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Common Equipment (click to add):
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {commonEquipment.map((equipment) => (
                  <Chip
                    key={equipment}
                    label={equipment}
                    onClick={() => addCommonEquipment(equipment)}
                    variant={formData.equipment.includes(equipment) ? "filled" : "outlined"}
                    color={formData.equipment.includes(equipment) ? "secondary" : "default"}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label="Add Custom Equipment"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
              />
              <Button onClick={addEquipment} variant="outlined" startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.equipment.map((equipment) => (
                <Chip
                  key={equipment}
                  label={equipment}
                  onDelete={() => removeEquipment(equipment)}
                  color="secondary"
                />
              ))}
            </Box>
          </Grid>

          {/* Management Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Management Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAvailable}
                  onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                />
              }
              label="Available for Use"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maintenance Schedule"
              value={formData.maintenanceSchedule}
              onChange={(e) => handleInputChange('maintenanceSchedule', e.target.value)}
              placeholder="e.g., Weekly cleaning, Monthly inspection"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Responsible Person"
              value={formData.responsiblePerson}
              onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Images
              </Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginTop: 8 }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {facility ? 'Update' : 'Create'} Facility
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacilityForm;
