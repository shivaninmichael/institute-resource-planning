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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';
import { Faculty, FacultyStatus, FacultyDepartment } from '../../types';

const FacultyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FacultyStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<FacultyDepartment | 'all'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

  useEffect(() => {
    loadFaculty();
  }, [page, rowsPerPage, searchTerm, statusFilter, departmentFilter]);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('faculty')
        .select(`
          *,
          users!inner(*),
          departments!inner(*)
        `)
        .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

      // Apply filters
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,employee_id.ilike.%${searchTerm}%`);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (departmentFilter !== 'all') {
        query = query.eq('department_id', departmentFilter);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setFaculty(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load faculty data');
      console.error('Error loading faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!facultyToDelete) return;

    try {
      const { error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', facultyToDelete.id);

      if (error) throw error;

      setFaculty(faculty.filter(f => f.id !== facultyToDelete.id));
      setDeleteDialogOpen(false);
      setFacultyToDelete(null);
    } catch (err) {
      setError('Failed to delete faculty member');
      console.error('Error deleting faculty:', err);
    }
  };

  const openDeleteDialog = (faculty: Faculty) => {
    setFacultyToDelete(faculty);
    setDeleteDialogOpen(true);
  };

  const getStatusColor = (status: FacultyStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on_leave': return 'warning';
      case 'terminated': return 'error';
      default: return 'default';
    }
  };

  const getDepartmentColor = (department: FacultyDepartment) => {
    const colors = {
      'computer_science': '#1976d2',
      'mathematics': '#388e3c',
      'physics': '#f57c00',
      'chemistry': '#7b1fa2',
      'biology': '#388e3c',
      'english': '#d32f2f',
      'history': '#5d4037',
      'economics': '#1976d2',
      'engineering': '#f57c00',
      'medicine': '#d32f2f',
    };
    return colors[department] || '#757575';
  };

  if (loading && faculty.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Faculty Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/faculty/new')}
          disabled={!user?.permissions?.includes('faculty.create' as any)}
        >
          Add Faculty
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Faculty"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                placeholder="Search by name, email, or employee ID..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as FacultyStatus | 'all')}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value as FacultyDepartment | 'all')}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="computer_science">Computer Science</MenuItem>
                  <MenuItem value="mathematics">Mathematics</MenuItem>
                  <MenuItem value="physics">Physics</MenuItem>
                  <MenuItem value="chemistry">Chemistry</MenuItem>
                  <MenuItem value="biology">Biology</MenuItem>
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="history">History</MenuItem>
                  <MenuItem value="economics">Economics</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="medicine">Medicine</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={loadFaculty}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Faculty Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faculty.map((facultyMember) => (
                <TableRow key={facultyMember.id} hover>
                  <TableCell>{facultyMember.employee_id || ""}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {facultyMember.first_name} {facultyMember.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {facultyMember.qualification || ""}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{facultyMember.email || ""}</TableCell>
                  <TableCell>
                    <Chip
                      label={facultyMember.departments?.[0]?.name || "Unknown".replace('_', ' ').toUpperCase()}
                      size="small"
                      sx={{
                         backgroundColor: getDepartmentColor((facultyMember.departments?.[0]?.name || "computer_science") as FacultyDepartment) + '20',
                         color: getDepartmentColor((facultyMember.departments?.[0]?.name || "computer_science") as FacultyDepartment),
                        fontWeight: 'medium',
                      }}
                    />
                  </TableCell>
                  <TableCell>{facultyMember.position || ""}</TableCell>
                  <TableCell>
                    <Chip
                      label={facultyMember.active ? "ACTIVE" : "INACTIVE"}
                      color={facultyMember.active ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(facultyMember.joining_date || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/faculty/${facultyMember.id}`)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/faculty/${facultyMember.id}/edit`)}
                        color="primary"
                        disabled={!user?.permissions?.includes('faculty.update' as any)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => openDeleteDialog(facultyMember)}
                        color="error"
                        disabled={!user?.permissions?.includes('faculty.delete' as any)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={faculty.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Faculty Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>
              {facultyToDelete?.first_name} {facultyToDelete?.last_name}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyPage;
