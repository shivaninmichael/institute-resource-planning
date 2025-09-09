// =====================================================
// Payroll Form Component
// Form for creating and editing payroll entries
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
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface PayrollDeduction {
  type: string;
  amount: number;
  description: string;
}

interface PayrollAllowance {
  type: string;
  amount: number;
  description: string;
}

interface PayrollFormData {
  employeeId: string;
  payPeriodStart: Date | null;
  payPeriodEnd: Date | null;
  baseSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  bonuses: number;
  taxDeductions: number;
  netPay: number;
  paymentMethod: string;
  bankAccount: string;
  notes: string;
  status: 'draft' | 'approved' | 'paid' | '';
}

interface PayrollFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PayrollFormData) => void;
  payroll?: PayrollFormData;
  title?: string;
}

const PayrollForm: React.FC<PayrollFormProps> = ({
  open,
  onClose,
  onSubmit,
  payroll,
  title = 'Payroll Entry'
}) => {
  const [formData, setFormData] = useState<PayrollFormData>({
    employeeId: '',
    payPeriodStart: null,
    payPeriodEnd: null,
    baseSalary: 0,
    overtimeHours: 0,
    overtimeRate: 0,
    allowances: [],
    deductions: [],
    bonuses: 0,
    taxDeductions: 0,
    netPay: 0,
    paymentMethod: '',
    bankAccount: '',
    notes: '',
    status: ''
  });

  const [errors, setErrors] = useState<Partial<PayrollFormData>>({});

  const employees = [
    { id: '1', name: 'John Doe', position: 'Professor' },
    { id: '2', name: 'Jane Smith', position: 'Assistant Professor' },
    { id: '3', name: 'Bob Johnson', position: 'Administrator' },
    { id: '4', name: 'Alice Brown', position: 'Librarian' }
  ];

  const paymentMethods = [
    'Bank Transfer',
    'Check',
    'Cash',
    'Direct Deposit'
  ];

  const allowanceTypes = [
    'Housing Allowance',
    'Transportation',
    'Medical Allowance',
    'Meal Allowance',
    'Communication Allowance'
  ];

  const deductionTypes = [
    'Income Tax',
    'Social Security',
    'Health Insurance',
    'Retirement Fund',
    'Union Dues',
    'Loan Repayment'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'approved', label: 'Approved' },
    { value: 'paid', label: 'Paid' }
  ];

  useEffect(() => {
    if (payroll) {
      setFormData(payroll);
    } else {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setFormData({
        employeeId: '',
        payPeriodStart: startOfMonth,
        payPeriodEnd: endOfMonth,
        baseSalary: 0,
        overtimeHours: 0,
        overtimeRate: 0,
        allowances: [],
        deductions: [],
        bonuses: 0,
        taxDeductions: 0,
        netPay: 0,
        paymentMethod: '',
        bankAccount: '',
        notes: '',
        status: 'draft'
      });
    }
    setErrors({});
  }, [payroll, open]);

  // Calculate net pay whenever relevant fields change
  useEffect(() => {
    const totalAllowances = formData.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    const totalDeductions = formData.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const overtimePay = formData.overtimeHours * formData.overtimeRate;
    
    const grossPay = formData.baseSalary + overtimePay + totalAllowances + formData.bonuses;
    const netPay = grossPay - totalDeductions - formData.taxDeductions;
    
    setFormData(prev => ({ ...prev, netPay: Math.max(0, netPay) }));
  }, [formData.baseSalary, formData.overtimeHours, formData.overtimeRate, 
      formData.allowances, formData.deductions, formData.bonuses, formData.taxDeductions]);

  const handleInputChange = (field: keyof PayrollFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addAllowance = () => {
    setFormData(prev => ({
      ...prev,
      allowances: [...prev.allowances, { type: '', amount: 0, description: '' }]
    }));
  };

  const removeAllowance = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index)
    }));
  };

  const updateAllowance = (index: number, field: keyof PayrollAllowance, value: any) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances.map((allowance, i) => 
        i === index ? { ...allowance, [field]: value } : allowance
      )
    }));
  };

  const addDeduction = () => {
    setFormData(prev => ({
      ...prev,
      deductions: [...prev.deductions, { type: '', amount: 0, description: '' }]
    }));
  };

  const removeDeduction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index)
    }));
  };

  const updateDeduction = (index: number, field: keyof PayrollDeduction, value: any) => {
    setFormData(prev => ({
      ...prev,
      deductions: prev.deductions.map((deduction, i) => 
        i === index ? { ...deduction, [field]: value } : deduction
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PayrollFormData> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }
    if (!formData.payPeriodStart) {
      newErrors.payPeriodStart = 'Pay period start is required' as any;
    }
    if (!formData.payPeriodEnd) {
      newErrors.payPeriodEnd = 'Pay period end is required' as any;
    }
    if (!formData.baseSalary || formData.baseSalary <= 0) {
      newErrors.baseSalary = 'Base salary must be greater than 0' as any;
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
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
            <FormControl fullWidth error={!!errors.employeeId}>
              <InputLabel>Employee *</InputLabel>
              <Select
                value={formData.employeeId}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('employeeId', e.target.value)
                }
                label="Employee *"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </MenuItem>
                ))}
              </Select>
              {errors.employeeId && (
                <FormHelperText>{errors.employeeId}</FormHelperText>
              )}
            </FormControl>
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
            <DatePicker
              label="Pay Period Start *"
              value={formData.payPeriodStart}
              onChange={(date) => handleInputChange('payPeriodStart', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.payPeriodStart,
                  helperText: errors.payPeriodStart?.toString()
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Pay Period End *"
              value={formData.payPeriodEnd}
              onChange={(date) => handleInputChange('payPeriodEnd', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.payPeriodEnd,
                  helperText: errors.payPeriodEnd?.toString()
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Salary Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Salary Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Base Salary *"
              type="number"
              value={formData.baseSalary}
              onChange={(e) => handleInputChange('baseSalary', parseFloat(e.target.value) || 0)}
              error={!!errors.baseSalary}
              helperText={errors.baseSalary}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Overtime Hours"
              type="number"
              value={formData.overtimeHours}
              onChange={(e) => handleInputChange('overtimeHours', parseFloat(e.target.value) || 0)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Overtime Rate"
              type="number"
              value={formData.overtimeRate}
              onChange={(e) => handleInputChange('overtimeRate', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bonuses"
              type="number"
              value={formData.bonuses}
              onChange={(e) => handleInputChange('bonuses', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tax Deductions"
              type="number"
              value={formData.taxDeductions}
              onChange={(e) => handleInputChange('taxDeductions', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Allowances */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Allowances</Typography>
              <Button startIcon={<AddIcon />} onClick={addAllowance}>
                Add Allowance
              </Button>
            </Box>
          </Grid>

          {formData.allowances.map((allowance, index) => (
            <Grid item xs={12} key={index}>
              <Box border={1} borderColor="grey.300" borderRadius={1} p={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={allowance.type}
                        onChange={(e: SelectChangeEvent) => 
                          updateAllowance(index, 'type', e.target.value)
                        }
                        label="Type"
                      >
                        {allowanceTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={allowance.amount}
                      onChange={(e) => updateAllowance(index, 'amount', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={allowance.description}
                      onChange={(e) => updateAllowance(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <IconButton onClick={() => removeAllowance(index)} color="error">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Deductions */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Deductions</Typography>
              <Button startIcon={<AddIcon />} onClick={addDeduction}>
                Add Deduction
              </Button>
            </Box>
          </Grid>

          {formData.deductions.map((deduction, index) => (
            <Grid item xs={12} key={index}>
              <Box border={1} borderColor="grey.300" borderRadius={1} p={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={deduction.type}
                        onChange={(e: SelectChangeEvent) => 
                          updateDeduction(index, 'type', e.target.value)
                        }
                        label="Type"
                      >
                        {deductionTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={deduction.amount}
                      onChange={(e) => updateDeduction(index, 'amount', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={deduction.description}
                      onChange={(e) => updateDeduction(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <IconButton onClick={() => removeDeduction(index)} color="error">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.paymentMethod}>
              <InputLabel>Payment Method *</InputLabel>
              <Select
                value={formData.paymentMethod}
                onChange={(e: SelectChangeEvent) => 
                  handleInputChange('paymentMethod', e.target.value)
                }
                label="Payment Method *"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
              {errors.paymentMethod && (
                <FormHelperText>{errors.paymentMethod}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bank Account"
              value={formData.bankAccount}
              onChange={(e) => handleInputChange('bankAccount', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box 
              p={2} 
              bgcolor="primary.light" 
              borderRadius={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="primary.contrastText">
                Net Pay
              </Typography>
              <Typography variant="h5" color="primary.contrastText">
                ${formData.netPay.toFixed(2)}
              </Typography>
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
          {payroll ? 'Update' : 'Create'} Payroll
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollForm;
