// =====================================================
// OpenEducat ERP Frontend - Assignments Page
// Comprehensive assignment management interface
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Type definitions
interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  maxMarks: number;
  status: 'draft' | 'published' | 'closed';
  submissionsCount: number;
  createdAt: string;
}

const AssignmentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // =====================================================
  // Effects
  // =====================================================

  useEffect(() => {
    fetchAssignments();
  }, [page, rowsPerPage, searchTerm, statusFilter, courseFilter]);

  // =====================================================
  // API Calls
  // =====================================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockAssignments = [
        {
          id: '1',
          title: 'Research Paper on Climate Change',
          description: 'Write a comprehensive research paper on climate change impacts',
          course: 'Environmental Science',
          dueDate: '2024-12-01',
          maxScore: 100,
          status: 'active',
          submissions: 15,
          graded: 8
        },
        {
          id: '2',
          title: 'Mathematics Problem Set',
          description: 'Complete problems 1-20 from Chapter 5',
          course: 'Advanced Mathematics',
          dueDate: '2024-11-20',
          maxScore: 50,
          status: 'active',
          submissions: 28,
          graded: 25
        }
      ];
      
      // Add missing properties to mock data
      const enhancedMockAssignments = mockAssignments.map(assignment => ({
        ...assignment,
        courseId: assignment.id,
        courseName: assignment.course,
        maxMarks: assignment.maxScore,
        submissionsCount: assignment.submissions,
        createdAt: new Date().toISOString()
      }));
      setAssignments(enhancedMockAssignments as Assignment[]);
      setTotalCount(mockAssignments.length);
    } catch (err) {
      setError('Failed to fetch assignments');
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      // Mock delete - replace with actual API call
      setAssignments(assignments.filter(a => a.id !== id));
      toast.success('Assignment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete assignment');
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
    setEditingAssignment(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (assignment: any) => {
    setEditingAssignment(assignment);
    setFormDialogOpen(true);
  };

  const handleView = (assignment: any) => {
    setSelectedAssignment(assignment);
    setViewDialogOpen(true);
  };

  // =====================================================
  // Utility Functions
  // =====================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'default';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSubmissionStatus = (submissions: number, graded: number) => {
    if (submissions === 0) return { color: 'default', label: 'No Submissions' };
    if (graded === submissions) return { color: 'success', label: 'All Graded' };
    if (graded > 0) return { color: 'warning', label: 'Partially Graded' };
    return { color: 'info', label: 'Pending Grading' };
  };

  // =====================================================
  // Render Functions
  // =====================================================

  const renderFilters = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          placeholder="Search assignments..."
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
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
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
            <MenuItem value="environmental">Environmental Science</MenuItem>
            <MenuItem value="mathematics">Advanced Mathematics</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAssignments}
          >
            Refresh
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderAssignmentRow = (assignment: any) => {
    const submissionStatus = getSubmissionStatus(assignment.submissions, assignment.graded);
    
    return (
      <TableRow key={assignment.id} hover>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {assignment.title}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {assignment.description?.substring(0, 60)}...
          </Typography>
        </TableCell>
        <TableCell>{assignment.course}</TableCell>
        <TableCell>{assignment.dueDate}</TableCell>
        <TableCell>
          <Chip
            label={`${assignment.maxScore} pts`}
            color="primary"
            size="small"
          />
        </TableCell>
        <TableCell>
          <Chip
            label={assignment.status}
            color={getStatusColor(assignment.status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={submissionStatus.label}
              color={submissionStatus.color as any}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              ({assignment.graded}/{assignment.submissions})
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => handleView(assignment)}
                color="primary"
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Assignment">
              <IconButton
                size="small"
                onClick={() => handleEdit(assignment)}
                color="secondary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Grade Submissions">
              <IconButton
                size="small"
                onClick={() => navigate(`/assignments/${assignment.id}/grade`)}
                color="info"
              >
                <GradeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Assignment">
              <IconButton
                size="small"
                onClick={() => handleDeleteAssignment(assignment.id)}
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

  if (loading && assignments.length === 0) {
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
          Assignments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
        >
          New Assignment
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

      {/* Assignments Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map(renderAssignmentRow)}
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
          aria-label="add assignment"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddNew}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default AssignmentsPage;
