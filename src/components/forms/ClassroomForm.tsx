// =====================================================
// Classroom Form Component
// Form for creating and editing classroom information
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

interface ClassroomFormData {
  name: string;
  code: string;
  building: string;
  floor: string;
  roomNumber: string;
  capacity: number;
  type: string;
  subject: string;
  equipment: string[];
  features: string[];
  isActive: boolean;
  isAvailable: boolean;
  responsibleTeacher: string;
  department: string;
  area: number;
  description: string;
  maintenanceSchedule: string;
  notes: string;
}

interface ClassroomFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassroomFormData) => void;
  classroom?: ClassroomFormData;
  title?: string;
}

const ClassroomForm: React.FC<ClassroomFormProps> = ({
  open,
  onClose,
  onSubmit,
  classroom,
  title = 'Classroom'
}) => {
  const [formData, setFormData] = useState<ClassroomFormData>({
    name: '',
    code: '',
    building: '',
    floor: '',
    roomNumber: '',
    capacity: 0,
    type: '',
    subject: '',
    equipment: [],
    features: [],
    isActive: true,
    isAvailable: true,
    responsibleTeacher: '',
    department: '',
    area: 0,
    description: '',
    maintenanceSchedule: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<ClassroomFormData>>({});
  const [newEquipment, setNewEquipment] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const buildings = [
    'Main Building',
    'Science Block',
    'Engineering Block',
    'Arts Building',
    'Administrative Block',
    'Library Building'
  ];

  const classroomTypes = [
    'Lecture Hall',
    'Seminar Room',
    'Laboratory',
    'Computer Lab',
    'Language Lab',
    'Workshop',
    'Studio',
    'Conference Room',
    'Library Reading Room'
  ];

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography',
    'Economics',
    'Art',
    'Music',
    'Physical Education',
    'General Purpose'
  ];

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Arts',
    'Engineering',
    'Business'
  ];

  const teachers = [
    { id: '1', name: 'Dr. John Smith' },
    { id: '2', name: 'Prof. Jane Doe' },
    { id: '3', name: 'Mr. Bob Johnson' },
    { id: '4', name: 'Ms. Alice Brown' },
    { id: '5', name: 'Dr. David Wilson' }
  ];

  const commonEquipment = [
    'Projector',
    'Smart Board',
    'Whiteboard',
    'Blackboard',
    'Computer',
    'Speakers',
    'Microphone',
    'Air Conditioner',
    'Ceiling Fan',
    'Desks',
    'Chairs',
    'Podium',
    'Screen',
    'Wi-Fi Router'
  ];

  const commonFeatures = [
    'Natural Lighting',
    'Artificial Lighting',
    'Ventilation',
    'Sound Proof',
    'Wheelchair Accessible',
    'Emergency Exit',
    'Fire Extinguisher',
    'First Aid Kit',
    'CCTV Camera',
    'Power Outlets',
    'Internet Connection',
    'Storage Space'
  ];

  useEffect(() => {
    if (classroom) {
      setFormData(classroom);
    } else {
      setFormData({
        name: '',
        code: '',
        building: '',
        floor: '',
        roomNumber: '',
        capacity: 0,
        type: '',
        subject: '',
        equipment: [],
        features: [],
        isActive: true,
        isAvailable: true,
        responsibleTeacher: '',
        department: '',
        area: 0,
        description: '',
        maintenanceSchedule: '',
        notes: ''
      });
    }
    setErrors({});
  }, [classroom, open]);

  const handleInputChange = (field: keyof ClassroomFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addCommonEquipment = (equipment: string) => {
    if (!formData.equipment.includes(equipment)) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipment]
      }));
    }
  };

  const addCommonFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClassroomFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Classroom name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Classroom code is required';
    }
    if (!formData.building) {
      newErrors.building = 'Building is required';
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    if (!formData.type) {
      newErrors.type = 'Classroom type is required';
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0' as any;
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
              label="Classroom Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Classroom Code *"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              error={!!errors.code}
              helperText={errors.code}
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
              label="Room Number *"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange('roomNumber', e.target.value)}
              error={!!errors.roomNumber}
              helperText={errors.roomNumber}
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
                {classroomTypes.map((type) => (
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
            <FormControl fullWidth>
              <InputLabel>Primary Subject</InputLabel>
              <Select
                value={formData.subject}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('subject', e.target.value)
                }
                label="Primary Subject"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Capacity *"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
              error={!!errors.capacity}
              helperText={errors.capacity}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Area (sq ft)"
              type="number"
              value={formData.area}
              onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('department', e.target.value)
                }
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                    color={formData.equipment.includes(equipment) ? "primary" : "default"}
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
                  color="primary"
                />
              ))}
            </Box>
          </Grid>

          {/* Features */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Common Features (click to add):
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {commonFeatures.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    onClick={() => addCommonFeature(feature)}
                    variant={formData.features.includes(feature) ? "filled" : "outlined"}
                    color={formData.features.includes(feature) ? "secondary" : "default"}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label="Add Custom Feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button onClick={addFeature} variant="outlined" startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.features.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  onDelete={() => removeFeature(feature)}
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

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Responsible Teacher</InputLabel>
              <Select
                value={formData.responsibleTeacher}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('responsibleTeacher', e.target.value)
                }
                label="Responsible Teacher"
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maintenance Schedule"
              value={formData.maintenanceSchedule}
              onChange={(e) => handleInputChange('maintenanceSchedule', e.target.value)}
              placeholder="e.g., Daily cleaning, Weekly inspection"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              }
              label="Active Classroom"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAvailable}
                  onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                />
              }
              label="Available for Booking"
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
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {classroom ? 'Update' : 'Create'} Classroom
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassroomForm;
