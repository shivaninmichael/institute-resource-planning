// =====================================================
// OpenEducat ERP Frontend - Fees Page
// Comprehensive fee management interface
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Type definitions
interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount: number;
  createdAt: string;
}

const FeesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  
  // Dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [editingFee, setEditingFee] = useState(null);

  // =====================================================
  // Effects
  // =====================================================

  useEffect(() => {
    fetchFees();
  }, [page, rowsPerPage, searchTerm, statusFilter, courseFilter]);

  // =====================================================
  // API Calls
  // =====================================================

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockFees = [
        {
          id: '1',
          name: 'Tuition Fee - Semester 1',
          student: 'John Doe',
          course: 'Computer Science',
          amount: 5000,
          paid: 3500,
          dueDate: '2024-12-31',
          status: 'partial',
          category: 'tuition'
        },
        {
          id: '2',
          name: 'Laboratory Fee',
          student: 'Jane Smith',
          course: 'Physics',
          amount: 800,
          paid: 800,
          dueDate: '2024-11-15',
          status: 'paid',
          category: 'lab'
        },
        {
          id: '3',
          name: 'Library Fee',
          student: 'Mike Johnson',
          course: 'Literature',
          amount: 200,
          paid: 0,
          dueDate: '2024-10-30',
          status: 'overdue',
          category: 'library'
        }
      ];
      
      // Add missing properties to mock data
      const enhancedMockFees = mockFees.map(fee => ({
        ...fee,
        studentId: fee.id,
        studentName: fee.student,
        feeType: fee.category,
        paidAmount: fee.paid,
        createdAt: new Date().toISOString()
      }));
      setFees(enhancedMockFees as Fee[]);
      setTotalCount(mockFees.length);
    } catch (err) {
      setError('Failed to fetch fees');
      toast.error('Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fee?')) {
      return;
    }

    try {
      // Mock delete - replace with actual API call
      setFees(fees.filter(f => f.id !== id));
      toast.success('Fee deleted successfully');
    } catch (err) {
      toast.error('Failed to delete fee');
    }
  };

  // =====================================================
  // Event Handlers
  // =====================================================

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'course':
        setCourseFilter(value);
        break;
    }
    setPage(0);
  };

  const handleAddNew = () => {
    setEditingFee(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (fee: any) => {
    setEditingFee(fee);
    setFormDialogOpen(true);
  };

  const handleView = (fee: any) => {
    setSelectedFee(fee);
    setViewDialogOpen(true);
  };

  // =====================================================
  // Utility Functions
  // =====================================================

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'partial':
        return 'Partial';
      case 'overdue':
        return 'Overdue';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tuition':
        return <AccountIcon />;
      case 'lab':
        return <PaymentIcon />;
      case 'library':
        return <ReceiptIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const calculatePaymentProgress = (paid: number, amount: number) => {
    return (paid / amount) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // =====================================================
  // Render Functions
  // =====================================================

  const renderFilters = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          placeholder="Search fees..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            value={courseFilter}
            label="Course"
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <MenuItem value="all">All Courses</MenuItem>
            <MenuItem value="computer-science">Computer Science</MenuItem>
            <MenuItem value="physics">Physics</MenuItem>
            <MenuItem value="literature">Literature</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchFees}
          >
            Refresh
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderFeeRow = (fee: any) => {
    const paymentProgress = calculatePaymentProgress(fee.paid, fee.amount);
    
    return (
      <TableRow key={fee.id} hover>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getCategoryIcon(fee.category)}
            <Typography variant="body2" fontWeight="medium">
              {fee.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{fee.student}</TableCell>
        <TableCell>{fee.course}</TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {formatCurrency(fee.amount)}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Paid: {formatCurrency(fee.paid)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={paymentProgress}
              color={paymentProgress === 100 ? 'success' : 'primary'}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary">
              {paymentProgress.toFixed(1)}% Complete
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            label={getStatusLabel(fee.status)}
            color={getStatusColor(fee.status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {fee.dueDate}
          </Typography>
          {fee.status === 'overdue' && (
            <Typography variant="caption" color="error">
              Overdue
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => handleView(fee)}
                color="primary"
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Fee">
              <IconButton
                size="small"
                onClick={() => handleEdit(fee)}
                color="secondary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Record Payment">
              <IconButton
                size="small"
                onClick={() => navigate(`/fees/${fee.id}/payment`)}
                color="success"
              >
                <PaymentIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Fee">
              <IconButton
                size="small"
                onClick={() => handleDeleteFee(fee.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  // =====================================================
  // Main Render
  // =====================================================

  if (loading && fees.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Fees Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
        >
          New Fee
        </Button>
      </Box>

      {/* Filters */}
      {renderFilters()}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Fees Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fee Name</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map(renderFeeRow)}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add fee"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddNew}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default FeesPage;