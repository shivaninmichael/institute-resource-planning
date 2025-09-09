// =====================================================
// OpenEducat ERP Frontend - User Management
// Admin tools for managing system users and roles
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Menu,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import MoreIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import StudentIcon from '@mui/icons-material/School';
import FacultyIcon from '@mui/icons-material/Work';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'faculty' | 'admin' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  department?: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const UserManagement: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialogs
  const [userDialog, setUserDialog] = useState<{
    open: boolean;
    user: User | null;
    mode: 'create' | 'edit' | 'view';
  }>({ open: false, user: null, mode: 'create' });

  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    role: Role | null;
    mode: 'create' | 'edit';
  }>({ open: false, role: null, mode: 'create' });

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
    department: '',
    permissions: [] as string[],
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const availablePermissions = [
    'user.read', 'user.write', 'user.delete',
    'student.read', 'student.write', 'student.delete',
    'faculty.read', 'faculty.write', 'faculty.delete' as any,
    'course.read', 'course.write', 'course.delete' as any,
    'exam.read', 'exam.write', 'exam.delete' as any,
    'grade.read', 'grade.write', 'grade.delete',
    'attendance.read', 'attendance.write', 'attendance.delete',
    'fee.read', 'fee.write', 'fee.delete',
    'report.read', 'report.write',
    'system.admin', 'system.settings',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllRoles(),
      ]);
      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await adminApi.createUser(userForm);
      loadData();
      setUserDialog({ open: false, user: null, mode: 'create' });
      resetUserForm();
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  const handleUpdateUser = async () => {
    if (!userDialog.user) return;

    try {
      await adminApi.updateUser(userDialog.user.id, userForm);
      loadData();
      setUserDialog({ open: false, user: null, mode: 'edit' });
      resetUserForm();
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminApi.deleteUser(userId);
      loadData();
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await adminApi.updateUser(userId, { status: newStatus });
      loadData();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'student',
      status: 'active',
      department: '',
      permissions: [],
    });
  };

  const openUserDialog = (user: User | null, mode: 'create' | 'edit' | 'view') => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setUserForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        department: user.department || '',
        permissions: user.permissions,
      });
    } else {
      resetUserForm();
    }
    setUserDialog({ open: true, user, mode });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <StudentIcon />;
      case 'faculty': return <FacultyIcon />;
      case 'admin': return <AdminIcon />;
      default: return <PersonIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openUserDialog(null, 'create')}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Users (${users.length})`} />
          <Tab label={`Roles (${roles.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Users Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={user.avatar} alt={user.name}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role.toUpperCase()}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={user.status.toUpperCase()}
                            color={getStatusColor(user.status) as any}
                            size="small"
                          />
                          <Switch
                            checked={user.status === 'active'}
                            onChange={() => handleToggleUserStatus(user.id, user.status)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedUser(user);
                          }}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Role Management
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Role management functionality will be implemented here.
            </Alert>
          </Box>
        </TabPanel>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          if (selectedUser) openUserDialog(selectedUser, 'view');
          setAnchorEl(null);
        }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedUser) openUserDialog(selectedUser, 'edit');
          setAnchorEl(null);
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (selectedUser) handleDeleteUser(selectedUser.id);
          setAnchorEl(null);
        }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* User Dialog */}
      <Dialog
        open={userDialog.open}
        onClose={() => setUserDialog({ open: false, user: null, mode: 'create' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {userDialog.mode === 'create' ? 'Add New User' : 
           userDialog.mode === 'edit' ? 'Edit User' : 'User Details'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                disabled={userDialog.mode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                disabled={userDialog.mode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                disabled={userDialog.mode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={userForm.role}
                  label="Role"
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  disabled={userDialog.mode === 'view'}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={userForm.status}
                  label="Status"
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value as any })}
                  disabled={userDialog.mode === 'view'}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={userForm.department}
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                disabled={userDialog.mode === 'view'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog({ open: false, user: null, mode: 'create' })}>
            Cancel
          </Button>
          {userDialog.mode !== 'view' && (
            <Button
              onClick={userDialog.mode === 'create' ? handleCreateUser : handleUpdateUser}
              variant="contained"
              disabled={!userForm.name || !userForm.email}
            >
              {userDialog.mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
