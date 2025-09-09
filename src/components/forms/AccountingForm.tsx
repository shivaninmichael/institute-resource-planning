// =====================================================
// Accounting Form Component
// Form for creating and editing accounting entries
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
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface AccountingFormData {
  transactionType: 'debit' | 'credit' | '';
  accountCode: string;
  accountName: string;
  description: string;
  amount: number;
  transactionDate: Date | null;
  referenceNumber: string;
  category: string;
  departmentId: string;
  fiscalYear: string;
  notes: string;
  attachments?: File[];
}

interface AccountingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AccountingFormData) => void;
  entry?: AccountingFormData;
  title?: string;
}

const AccountingForm: React.FC<AccountingFormProps> = ({
  open,
  onClose,
  onSubmit,
  entry,
  title = 'Accounting Entry'
}) => {
  const [formData, setFormData] = useState<AccountingFormData>({
    transactionType: '',
    accountCode: '',
    accountName: '',
    description: '',
    amount: 0,
    transactionDate: new Date(),
    referenceNumber: '',
    category: '',
    departmentId: '',
    fiscalYear: new Date().getFullYear().toString(),
    notes: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Partial<AccountingFormData>>({});

  const transactionTypes = [
    { value: 'debit', label: 'Debit' },
    { value: 'credit', label: 'Credit' }
  ];

  const categories = [
    'Revenue',
    'Expenses',
    'Assets',
    'Liabilities',
    'Equity',
    'Cost of Goods Sold',
    'Operating Expenses',
    'Administrative Expenses'
  ];

  const departments = [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Mathematics' },
    { id: '3', name: 'Physics' },
    { id: '4', name: 'Administration' },
    { id: '5', name: 'Library' }
  ];

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData({
        transactionType: '',
        accountCode: '',
        accountName: '',
        description: '',
        amount: 0,
        transactionDate: new Date(),
        referenceNumber: '',
        category: '',
        departmentId: '',
        fiscalYear: new Date().getFullYear().toString(),
        notes: '',
        attachments: []
      });
    }
    setErrors({});
  }, [entry, open]);

  const handleInputChange = (field: keyof AccountingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AccountingFormData> = {};

    if (!formData.transactionType) {
      newErrors.transactionType = 'Transaction type is required' as any;
    }
    if (!formData.accountCode.trim()) {
      newErrors.accountCode = 'Account code is required';
    }
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0' as any;
    }
    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Transaction date is required' as any;
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, attachments: files }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.transactionType}>
              <InputLabel>Transaction Type *</InputLabel>
              <Select
                value={formData.transactionType}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('transactionType', e.target.value)
                }
                label="Transaction Type *"
              >
                {transactionTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.transactionType && (
                <FormHelperText>{errors.transactionType}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Code *"
              value={formData.accountCode}
              onChange={(e) => handleInputChange('accountCode', e.target.value)}
              error={!!errors.accountCode}
              helperText={errors.accountCode}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Account Name *"
              value={formData.accountName}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
              error={!!errors.accountName}
              helperText={errors.accountName}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description *"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount *"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Transaction Date *"
              value={formData.transactionDate}
              onChange={(date) => handleInputChange('transactionDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.transactionDate,
                  helperText: errors.transactionDate ? String(errors.transactionDate) : undefined
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Reference Number"
              value={formData.referenceNumber}
              onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={categories}
              value={formData.category}
              onChange={(_, value) => handleInputChange('category', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category *"
                  error={!!errors.category}
                  helperText={errors.category}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.departmentId}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('departmentId', e.target.value)
                }
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fiscal Year"
              value={formData.fiscalYear}
              onChange={(e) => handleInputChange('fiscalYear', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Attachments
              </Typography>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
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
          {entry ? 'Update' : 'Create'} Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountingForm;
