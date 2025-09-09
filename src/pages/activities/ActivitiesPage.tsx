// =====================================================
// OpenEducat ERP Frontend - Activities Page
// Comprehensive activity management interface
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity } from '../../types';
import { toast } from 'react-hot-toast';

const ActivitiesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Dialog state
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // =====================================================
  // Effects
  // =====================================================

  useEffect(() => {
    fetchActivities();
  }, [page, rowsPerPage, searchTerm, statusFilter, typeFilter]);

  // =====================================================
  // API Calls
  // =====================================================

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockActivities: Activity[] = [
        {
          id: '1',
          title: 'Science Fair 2024',
          name: 'Science Fair 2024',
          description: 'Annual science fair competition',
          type: 'academic',
          status: 'active',
          start_date: '2024-11-15',
          startDate: '2024-11-15',
          location: 'Main Hall',
          participants: 45,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Basketball Tournament',
          name: 'Basketball Tournament',
          description: 'Inter-class basketball competition',
          type: 'sports',
          status: 'upcoming',
          start_date: '2024-12-01',
          startDate: '2024-12-01',
          location: 'Sports Complex',
          participants: 32,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setActivities(mockActivities);
      setTotalCount(mockActivities.length);
    } catch (err) {
      setError('Failed to fetch activities');
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      // Mock delete - replace with actual API call
      setActivities(activities.filter(a => a.id.toString() !== id.toString()));
      toast.success('Activity deleted successfully');
    } catch (err) {
      toast.error('Failed to delete activity');
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
      case 'type':
        setTypeFilter(value);
        break;
    }
    setPage(0);
  };

  const handleAddNew = () => {
    setEditingActivity(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormDialogOpen(true);
  };

  const handleView = (activity: Activity) => {
    setSelectedActivity(activity);
    setViewDialogOpen(true);
  };

  // =====================================================
  // Utility Functions
  // =====================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return '📚';
      case 'sports':
        return '⚽';
      case 'cultural':
        return '🎭';
      case 'social':
        return '👥';
      default:
        return '📅';
    }
  };

  // =====================================================
  // Render Functions
  // =====================================================

  const renderFilters = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          placeholder="Search activities..."
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="academic">Academic</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="cultural">Cultural</MenuItem>
            <MenuItem value="social">Social</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchActivities}
          >
            Refresh
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderActivityRow = (activity: Activity) => (
    <TableRow key={activity.id} hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(activity.type)}</span>
          <Typography variant="body2" fontWeight="medium">
             {activity.title || activity.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {activity.description?.substring(0, 50)}...
        </Typography>
      </TableCell>
      <TableCell>{activity.start_date || activity.startDate}</TableCell>
      <TableCell>{activity.location || 'N/A'}</TableCell>
      <TableCell>
        <Chip
          label={activity.status}
          color={getStatusColor(activity.status)}
          size="small"
        />
      </TableCell>
      <TableCell>{typeof activity.participants === 'number' ? activity.participants : 0}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleView(activity)}
              color="primary"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Activity">
            <IconButton
              size="small"
              onClick={() => handleEdit(activity)}
              color="secondary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Activity">
            <IconButton
              size="small"
              onClick={() => handleDeleteActivity(activity.id.toString())}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );

  // =====================================================
  // Main Render
  // =====================================================

  if (loading && activities.length === 0) {
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
          Activities
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
        >
          New Activity
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

      {/* Activities Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map(renderActivityRow)}
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
          aria-label="add activity"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddNew}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ActivitiesPage;
