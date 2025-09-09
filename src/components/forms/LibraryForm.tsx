// =====================================================
// Library Form Component
// Form for creating and editing library resources
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
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface LibraryFormData {
  // Basic Information
  title: string;
  isbn: string;
  author: string;
  publisher: string;
  publicationDate: Date | null;
  edition: string;
  language: string;
  
  // Classification
  category: string;
  subject: string;
  deweyDecimal: string;
  tags: string[];
  
  // Physical Details
  totalCopies: number;
  availableCopies: number;
  location: string;
  shelf: string;
  pages: number;
  format: string;
  
  // Digital Information
  isDigital: boolean;
  digitalUrl: string;
  fileSize: string;
  downloadable: boolean;
  
  // Acquisition Details
  acquisitionDate: Date | null;
  cost: number;
  supplier: string;
  invoiceNumber: string;
  
  // Status
  status: string;
  condition: string;
  isRestricted: boolean;
  restrictionNote: string;
  
  // Additional Information
  description: string;
  notes: string;
  keywords: string[];
}

interface LibraryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LibraryFormData) => void;
  resource?: LibraryFormData;
  title?: string;
}

const LibraryForm: React.FC<LibraryFormProps> = ({
  open,
  onClose,
  onSubmit,
  resource,
  title = 'Library Resource'
}) => {
  const [formData, setFormData] = useState<LibraryFormData>({
    title: '',
    isbn: '',
    author: '',
    publisher: '',
    publicationDate: null,
    edition: '',
    language: '',
    category: '',
    subject: '',
    deweyDecimal: '',
    tags: [],
    totalCopies: 1,
    availableCopies: 1,
    location: '',
    shelf: '',
    pages: 0,
    format: '',
    isDigital: false,
    digitalUrl: '',
    fileSize: '',
    downloadable: false,
    acquisitionDate: new Date(),
    cost: 0,
    supplier: '',
    invoiceNumber: '',
    status: 'available',
    condition: 'good',
    isRestricted: false,
    restrictionNote: '',
    description: '',
    notes: '',
    keywords: []
  });

  const [errors, setErrors] = useState<Partial<LibraryFormData>>({});
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const categories = [
    'Books',
    'Journals',
    'Magazines',
    'Newspapers',
    'Reference Materials',
    'Textbooks',
    'E-books',
    'Audio Books',
    'DVDs',
    'CDs',
    'Maps',
    'Theses',
    'Research Papers',
    'Government Documents'
  ];

  const subjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Medicine',
    'Literature',
    'History',
    'Geography',
    'Economics',
    'Business',
    'Law',
    'Arts',
    'Music',
    'Philosophy',
    'Psychology',
    'Education'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Arabic',
    'Hindi',
    'Portuguese',
    'Russian',
    'Italian',
    'Dutch'
  ];

  const formats = [
    'Hardcover',
    'Paperback',
    'PDF',
    'EPUB',
    'Audio',
    'Video',
    'Microfilm',
    'CD-ROM',
    'DVD',
    'Online'
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'checked_out', label: 'Checked Out' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'lost', label: 'Lost' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const locations = [
    'Main Library',
    'Reference Section',
    'Periodicals Section',
    'Digital Library',
    'Special Collections',
    'Reserve Section',
    'Children Section',
    'Study Hall',
    'Archives'
  ];

  const commonTags = [
    'Fiction',
    'Non-fiction',
    'Academic',
    'Research',
    'Popular',
    'Classic',
    'Contemporary',
    'Biography',
    'Self-help',
    'Technical',
    'Historical',
    'Scientific'
  ];

  useEffect(() => {
    if (resource) {
      setFormData(resource);
    } else {
      setFormData({
        title: '',
        isbn: '',
        author: '',
        publisher: '',
        publicationDate: null,
        edition: '',
        language: 'English',
        category: '',
        subject: '',
        deweyDecimal: '',
        tags: [],
        totalCopies: 1,
        availableCopies: 1,
        location: '',
        shelf: '',
        pages: 0,
        format: '',
        isDigital: false,
        digitalUrl: '',
        fileSize: '',
        downloadable: false,
        acquisitionDate: new Date(),
        cost: 0,
        supplier: '',
        invoiceNumber: '',
        status: 'available',
        condition: 'good',
        isRestricted: false,
        restrictionNote: '',
        description: '',
        notes: '',
        keywords: []
      });
    }
    setErrors({});
  }, [resource, open]);

  // Update available copies when total copies change
  useEffect(() => {
    if (formData.availableCopies > formData.totalCopies) {
      setFormData(prev => ({ ...prev, availableCopies: prev.totalCopies }));
    }
  }, [formData.totalCopies]);

  const handleInputChange = (field: keyof LibraryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCommonTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LibraryFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.totalCopies <= 0) {
      newErrors.totalCopies = 'Total copies must be greater than 0' as any;
    }
    if (formData.availableCopies < 0) {
      newErrors.availableCopies = 'Available copies cannot be negative' as any;
    }
    if (formData.availableCopies > formData.totalCopies) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies' as any;
    }
    if (formData.isDigital && !formData.digitalUrl.trim()) {
      newErrors.digitalUrl = 'Digital URL is required for digital resources';
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title *"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Author *"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              error={!!errors.author}
              helperText={errors.author}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => handleInputChange('isbn', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Publisher"
              value={formData.publisher}
              onChange={(e) => handleInputChange('publisher', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Publication Date"
              value={formData.publicationDate}
              onChange={(date) => handleInputChange('publicationDate', date)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Edition"
              value={formData.edition}
              onChange={(e) => handleInputChange('edition', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={languages}
              value={formData.language}
              onChange={(_, value) => handleInputChange('language', value || '')}
              renderInput={(params) => (
                <TextField {...params} label="Language" />
              )}
            />
          </Grid>

          {/* Classification */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Classification
            </Typography>
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

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={subjects}
              value={formData.subject}
              onChange={(_, value) => handleInputChange('subject', value || '')}
              renderInput={(params) => (
                <TextField {...params} label="Subject" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Dewey Decimal"
              value={formData.deweyDecimal}
              onChange={(e) => handleInputChange('deweyDecimal', e.target.value)}
              placeholder="e.g., 004.678"
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Common Tags (click to add):
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {commonTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => addCommonTag(tag)}
                    variant={formData.tags.includes(tag) ? "filled" : "outlined"}
                    color={formData.tags.includes(tag) ? "primary" : "default"}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label="Add Custom Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} variant="outlined" startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  color="primary"
                />
              ))}
            </Box>
          </Grid>

          {/* Physical Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Physical Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Total Copies *"
              type="number"
              value={formData.totalCopies}
              onChange={(e) => handleInputChange('totalCopies', parseInt(e.target.value) || 0)}
              error={!!errors.totalCopies}
              helperText={errors.totalCopies}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Available Copies"
              type="number"
              value={formData.availableCopies}
              onChange={(e) => handleInputChange('availableCopies', parseInt(e.target.value) || 0)}
              error={!!errors.availableCopies}
              helperText={errors.availableCopies}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Pages"
              type="number"
              value={formData.pages}
              onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('location', e.target.value)
                }
                label="Location"
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shelf"
              value={formData.shelf}
              onChange={(e) => handleInputChange('shelf', e.target.value)}
              placeholder="e.g., A-12, B-05"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={formats}
              value={formData.format}
              onChange={(_, value) => handleInputChange('format', value || '')}
              renderInput={(params) => (
                <TextField {...params} label="Format" />
              )}
            />
          </Grid>

          {/* Digital Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Digital Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDigital}
                  onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                />
              }
              label="Digital Resource"
            />
          </Grid>

          {formData.isDigital && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Digital URL *"
                  value={formData.digitalUrl}
                  onChange={(e) => handleInputChange('digitalUrl', e.target.value)}
                  error={!!errors.digitalUrl}
                  helperText={errors.digitalUrl}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="File Size"
                  value={formData.fileSize}
                  onChange={(e) => handleInputChange('fileSize', e.target.value)}
                  placeholder="e.g., 25 MB, 2.5 GB"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.downloadable}
                      onChange={(e) => handleInputChange('downloadable', e.target.checked)}
                    />
                  }
                  label="Downloadable"
                />
              </Grid>
            </>
          )}

          {/* Acquisition Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Acquisition Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Acquisition Date"
              value={formData.acquisitionDate}
              onChange={(date) => handleInputChange('acquisitionDate', date)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              value={formData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('status', e.target.value)
                }
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                value={formData.condition}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('condition', e.target.value)
                }
                label="Condition"
              >
                {conditionOptions.map((condition) => (
                  <MenuItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isRestricted}
                  onChange={(e) => handleInputChange('isRestricted', e.target.checked)}
                />
              }
              label="Restricted Access"
            />
          </Grid>

          {formData.isRestricted && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Restriction Note"
                multiline
                rows={2}
                value={formData.restrictionNote}
                onChange={(e) => handleInputChange('restrictionNote', e.target.value)}
                placeholder="Explain access restrictions..."
              />
            </Grid>
          )}

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
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

          {/* Keywords */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Search Keywords
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label="Add Keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword} variant="outlined" startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => removeKeyword(keyword)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
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
          {resource ? 'Update' : 'Create'} Resource
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LibraryForm;
