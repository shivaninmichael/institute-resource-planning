// =====================================================
// Financial Report Component
// Displays financial statistics and payment history
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ChartCard from '../dashboard/ChartCard';

interface PaymentData {
  id: string;
  type: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  category: string;
  reference?: string;
}

interface FinancialReportProps {
  studentId?: string;
  courseId?: string;
  onExport?: () => void;
}

const FinancialReport: React.FC<FinancialReportProps> = ({
  studentId,
  courseId,
  onExport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with actual API data
  const paymentData: PaymentData[] = [
    {
      id: '1',
      type: 'Tuition Fee',
      amount: 5000,
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-10',
      paidAmount: 5000,
      category: 'tuition',
      reference: 'TF-2024-001',
    },
    {
      id: '2',
      type: 'Laboratory Fee',
      amount: 800,
      status: 'partial',
      dueDate: '2024-01-20',
      paidDate: '2024-01-18',
      paidAmount: 400,
      category: 'lab',
      reference: 'LF-2024-001',
    },
    {
      id: '3',
      type: 'Library Fee',
      amount: 200,
      status: 'pending',
      dueDate: '2024-02-01',
      category: 'library',
    },
    {
      id: '4',
      type: 'Exam Fee',
      amount: 300,
      status: 'overdue',
      dueDate: '2024-01-10',
      category: 'exam',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'pending':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculatePaymentProgress = (paid?: number, total?: number) => {
    if (!paid || !total) return 0;
    return (paid / total) * 100;
  };

  return (
    <Box>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Time Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="semester">This Semester</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="tuition">Tuition</MenuItem>
              <MenuItem value="lab">Laboratory</MenuItem>
              <MenuItem value="library">Library</MenuItem>
              <MenuItem value="exam">Examination</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" justifyContent="flex-end">
            <Tooltip title="Export Report">
              <IconButton onClick={onExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      {/* Financial Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChartCard
            title="Payment Trends"
            subtitle="Monthly payment patterns"
            chart={<div style={{ height: 300 }}>Chart placeholder</div>}
            height={400}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Total Due</Typography>
                    <Typography variant="h4" color="error.main">
                      {formatCurrency(6300)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Paid Amount
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      {formatCurrency(5400)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Pending Amount
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      {formatCurrency(900)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85.7}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary" align="center">
                    85.7% Paid
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Status
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label="Paid" size="small" color="success" />
                    <Typography>2 items</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label="Partial" size="small" color="warning" />
                    <Typography>1 item</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label="Pending" size="small" color="info" />
                    <Typography>1 item</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label="Overdue" size="small" color="error" />
                    <Typography>1 item</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Payment History */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentData.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PaymentIcon fontSize="small" color="action" />
                        {payment.type}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        {formatCurrency(payment.amount)}
                      </Typography>
                      {payment.paidAmount && payment.paidAmount !== payment.amount && (
                        <Typography variant="caption" color="text.secondary">
                          Paid: {formatCurrency(payment.paidAmount)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={payment.status}
                        size="small"
                        color={getStatusColor(payment.status)}
                      />
                    </TableCell>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                    <TableCell>
                      {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                    </TableCell>
                    <TableCell>{payment.reference || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculatePaymentProgress(payment.paidAmount, payment.amount)}
                          color={getStatusColor(payment.status) as any}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinancialReport;
