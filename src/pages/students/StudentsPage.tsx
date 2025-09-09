import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  useTheme,
  Alert,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import FilterIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';
import { Student } from '../../types';

interface StudentFilters {
  search: string;
  gender: string;
  category: string;
  active: string;
}

export const StudentsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { hasPermission } = useSupabaseAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    gender: '',
    category: '',
    active: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [page, filters]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('students')
        .select(`
          *,
          users!inner(*),
          courses!inner(*)
        `)
        .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

      // Apply filters
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,student_id.ilike.%${filters.search}%`);
      }
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.active !== undefined) {
        query = query.eq('active', filters.active);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setStudents(data || []);
      setTotalPages(Math.ceil((count || 0) / rowsPerPage));
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
    setPage(1);
  };

  const handleFilterChange = (field: keyof StudentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', selectedStudent.id);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderStudentRow = (student: Student) => (
    <TableRow key={student.id} hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
            {student.first_name?.[0] || 'S'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">
              {student.first_name} {student.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {student.gr_no || 'No GR No'}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      <TableCell>
        <Chip
          label={student.gender === 'm' ? 'Male' : student.gender === 'f' ? 'Female' : 'Other'}
          size="small"
          color={student.gender === 'm' ? 'primary' : student.gender === 'f' ? 'secondary' : 'default'}
        />
      </TableCell>
      
      <TableCell>{student.birth_date ? new Date(student.birth_date).toLocaleDateString() : 'N/A'}</TableCell>
      
      <TableCell>
        <Chip
          label={student.active ? 'Active' : 'Inactive'}
          size="small"
          color={student.active ? 'success' : 'error'}
        />
      </TableCell>
      
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/students/${student.id}`)}
            color="primary"
          >
            <ViewIcon />
          </IconButton>
          
          {hasPermission('manage' as any, 'students' as any) && (
            <>
              <IconButton
                size="small"
                onClick={() => navigate(`/students/${student.id}/edit`)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedStudent(student);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );

  if (loading && students.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Students
        </Typography>
        <Grid container spacing={3}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton variant="rectangular" height={60} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Students Management
        </Typography>
        
        {hasPermission('manage' as any, 'students' as any) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/students/new')}
          >
            Add Student
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender}
                  label="Gender"
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="m">Male</MenuItem>
                  <MenuItem value="f">Female</MenuItem>
                  <MenuItem value="o">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.active}
                  label="Status"
                  onChange={(e) => handleFilterChange('active', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilters({ search: '', gender: '', category: '', active: '' })}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Students Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Birth Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(renderStudentRow)}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedStudent?.first_name} {selectedStudent?.last_name}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteStudent} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
