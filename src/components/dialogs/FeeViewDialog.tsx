// =====================================================
// Fee View Dialog Component
// Dialog for viewing fee details
// =====================================================

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface FeeViewDialogProps {
  open: boolean;
  onClose: () => void;
  fee: any;
}

const FeeViewDialog: React.FC<FeeViewDialogProps> = ({
  open,
  onClose,
  fee,
}) => {
  if (!fee) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const calculatePaymentProgress = () => {
    return (fee.paid / fee.amount) * 100;
  };

  const getRemainingAmount = () => {
    return fee.amount - fee.paid;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Fee Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5" component="h2">
                {fee.name}
              </Typography>
              <Chip
                label={fee.status}
                color={getStatusColor(fee.status)}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" paragraph>
              {fee.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Category"
                  secondary={fee.category}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Due Date"
                  secondary={formatDate(fee.dueDate)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Course"
                  secondary={fee.course}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Student"
                  secondary={fee.student}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PaymentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Total Amount"
                  secondary={formatCurrency(fee.amount)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Late Fee"
                  secondary={formatCurrency(fee.lateFee)}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Payment Progress
            </Typography>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Paid: {formatCurrency(fee.paid)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remaining: {formatCurrency(getRemainingAmount())}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculatePaymentProgress()}
                sx={{ height: 8, borderRadius: 4 }}
                color={fee.status === 'paid' ? 'success' : 'primary'}
              />
              <Box display="flex" justifyContent="center" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  {calculatePaymentProgress().toFixed(1)}% Complete
                </Typography>
              </Box>
            </Box>
          </Grid>

          {fee.allowInstallments && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Installment Plan
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Installment</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fee.installments?.map((installment: any) => (
                        <TableRow key={installment.id}>
                          <TableCell>{installment.number}</TableCell>
                          <TableCell>{formatDate(installment.dueDate)}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(installment.amount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={installment.status}
                              color={getStatusColor(installment.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          {fee.payments && fee.payments.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Payment History
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Reference</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fee.payments.map((payment: any) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          {fee.notes && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography color="text.secondary">
                  {fee.notes}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeeViewDialog;
