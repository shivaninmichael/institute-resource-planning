// =====================================================
// OpenEducat ERP Frontend - Timetables Page
// Comprehensive timetable management interface
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import TimetableForm from '@components/forms/TimetableForm';
import TimetableViewDialog from '@components/dialogs/TimetableViewDialog';
import ConflictResolutionDialog from '@components/dialogs/ConflictResolutionDialog';
import { TimetableService } from '@services/TimetableService';
import type { Timetable, TimetableStatus, TimetableType } from '@/types/timetable';

// =====================================================
// Component Props
// =====================================================

interface TimetablesPageProps {
  // Add any specific props if needed
}

// Custom Grid component with proper typing
// Import types for Grid
import type { GridProps } from '@mui/material';

// No need for custom grid component, we'll use MUI Grid directly

// =====================================================
// Main Component
// =====================================================

const TimetablesPage: React.FC<TimetablesPageProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  
  // Dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);

  // Initialize timetable service
  const timetableService = new TimetableService();

  // =====================================================
  // Effects
  // =====================================================

  useEffect(() => {
    fetchTimetables();
  }, [page, rowsPerPage, searchTerm, statusFilter, typeFilter, courseFilter]);

  // =====================================================
  // API Calls
  // =====================================================

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await TimetableService.getTimetables({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        courseId: courseFilter !== 'all' ? courseFilter : undefined,
      });
      
      setTimetables(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timetables');
      toast.error('Failed to fetch timetables');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimetable = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this timetable?')) {
      return;
    }

    try {
      await TimetableService.deleteTimetable(id);
      toast.success('Timetable deleted successfully');
      fetchTimetables();
    } catch (err) {
      toast.error('Failed to delete timetable');
    }
  };

  const handleValidateTimetable = async (id: string) => {
    try {
      const conflicts = await TimetableService.validateTimetable(id);
      if (conflicts.length > 0) {
        setSelectedTimetable(timetables.find(t => t.id === id) || null);
        setConflictDialogOpen(true);
      } else {
        toast.success('No conflicts found');
      }
    } catch (err) {
      toast.error('Failed to validate timetable');
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
      case 'course':
        setCourseFilter(value);
        break;
    }
    setPage(0);
  };

  const handleAddNew = () => {
    setEditingTimetable(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (timetable: Timetable) => {
    setEditingTimetable(timetable);
    setFormDialogOpen(true);
  };

  const handleView = (timetable: Timetable) => {
    setSelectedTimetable(timetable);
    setViewDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setEditingTimetable(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchTimetables();
    toast.success(editingTimetable ? 'Timetable updated successfully' : 'Timetable created successfully');
  };

  // =====================================================
  // Utility Functions
  // =====================================================

  const getStatusColor = (status: TimetableStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      case 'conflict':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: TimetableType) => {
    switch (type) {
      case 'regular':
        return <ScheduleIcon />;
      case 'exam':
        return <WarningIcon />;
      case 'special':
        return <CalendarTodayIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  // =====================================================
  // Render Functions
  // =====================================================

  const renderFilters = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(25% - 16px)' } }}>
        <TextField
          fullWidth
          placeholder="Search timetables..."
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
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(16.66% - 16px)' } }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
            <MenuItem value="conflict">Conflict</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(16.66% - 16px)' } }}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="regular">Regular</MenuItem>
            <MenuItem value="exam">Exam</MenuItem>
            <MenuItem value="special">Special</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(16.66% - 16px)' } }}>
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            value={courseFilter}
            label="Course"
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <MenuItem value="all">All Courses</MenuItem>
            {/* Add course options dynamically */}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(25% - 16px)' } }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTimetables}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => TimetableService.exportTimetables()}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderTimetableRow = (timetable: Timetable) => (
    <TableRow key={timetable.id} hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getTypeIcon(timetable.type)}
          <Typography variant="body2" fontWeight="medium">
            {timetable.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{timetable.course?.name || 'N/A'}</TableCell>
      <TableCell>{timetable.faculty?.name || 'N/A'}</TableCell>
      <TableCell>{timetable.classroom?.name || 'N/A'}</TableCell>
      <TableCell>
        <Chip
          label={timetable.status}
          color={getStatusColor(timetable.status)}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleView(timetable)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Timetable">
            <IconButton
              size="small"
              onClick={() => handleEdit(timetable)}
              color="secondary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Validate for Conflicts">
            <IconButton
              size="small"
              onClick={() => handleValidateTimetable(timetable.id)}
              color="info"
            >
              <WarningIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Timetable">
            <IconButton
              size="small"
              onClick={() => handleDeleteTimetable(timetable.id)}
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

  if (loading && timetables.length === 0) {
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
          Timetables
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
        >
          New Timetable
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

      {/* Timetables Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Faculty</TableCell>
                <TableCell>Classroom</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timetables.map(renderTimetableRow)}
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
          aria-label="add timetable"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddNew}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialogs */}
      <TimetableForm
        open={formDialogOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSuccess}
        timetable={editingTimetable as any}
      />

      <TimetableViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        timetable={selectedTimetable!}
      />

      <ConflictResolutionDialog
        open={conflictDialogOpen}
        onClose={() => setConflictDialogOpen(false)}
        timetable={selectedTimetable}
      />
    </Box>
  );
};

export default TimetablesPage;
