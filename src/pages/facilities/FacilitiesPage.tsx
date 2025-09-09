// =====================================================
// Facilities Management Page
// Infrastructure and facility management interface
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Stack,
  Avatar,
  LinearProgress,
  Tooltip,
  Alert,
  Badge,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import BuildingIcon from '@mui/icons-material/Business';
import RoomIcon from '@mui/icons-material/Room';
import MaintenanceIcon from '@mui/icons-material/Build';
import BookingIcon from '@mui/icons-material/Event';
import UtilizationIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';

interface Facility {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'auditorium' | 'library' | 'sports' | 'cafeteria' | 'office';
  building: string;
  floor: number;
  capacity: number;
  area: number;
  status: 'available' | 'occupied' | 'maintenance' | 'booked';
  utilization: number;
  lastMaintenance: string;
  nextMaintenance: string;
  equipment: string[];
  bookings: number;
}

interface MaintenanceRequest {
  id: string;
  facilityId: string;
  facilityName: string;
  type: 'routine' | 'repair' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requestedBy: string;
  requestDate: string;
  scheduledDate?: string;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  estimatedCost: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`facility-tabpanel-${index}`}
      aria-labelledby={`facility-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const FacilitiesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockFacilities: Facility[] = [
      {
        id: '1',
        name: 'Main Auditorium',
        type: 'auditorium',
        building: 'Academic Block A',
        floor: 1,
        capacity: 500,
        area: 800,
        status: 'available',
        utilization: 75,
        lastMaintenance: '2024-01-01',
        nextMaintenance: '2024-04-01',
        equipment: ['Projector', 'Sound System', 'Air Conditioning'],
        bookings: 12,
      },
      {
        id: '2',
        name: 'Computer Lab 1',
        type: 'laboratory',
        building: 'Tech Building',
        floor: 2,
        capacity: 40,
        area: 200,
        status: 'occupied',
        utilization: 90,
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-03-15',
        equipment: ['Computers', 'Projector', 'Whiteboard'],
        bookings: 25,
      },
      {
        id: '3',
        name: 'Sports Complex',
        type: 'sports',
        building: 'Sports Center',
        floor: 1,
        capacity: 200,
        area: 1500,
        status: 'maintenance',
        utilization: 60,
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-02-10',
        equipment: ['Basketball Court', 'Volleyball Net', 'Gym Equipment'],
        bookings: 8,
      },
    ];

    const mockMaintenanceRequests: MaintenanceRequest[] = [
      {
        id: '1',
        facilityId: '3',
        facilityName: 'Sports Complex',
        type: 'repair',
        priority: 'high',
        description: 'Basketball court flooring needs repair',
        requestedBy: 'John Smith',
        requestDate: '2024-01-20',
        scheduledDate: '2024-01-25',
        status: 'scheduled',
        estimatedCost: 5000,
      },
      {
        id: '2',
        facilityId: '2',
        facilityName: 'Computer Lab 1',
        type: 'routine',
        priority: 'medium',
        description: 'Regular computer maintenance and updates',
        requestedBy: 'IT Department',
        requestDate: '2024-01-18',
        status: 'pending',
        estimatedCost: 1200,
      },
    ];

    setFacilities(mockFacilities);
    setMaintenanceRequests(mockMaintenanceRequests);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'info';
      case 'maintenance':
        return 'warning';
      case 'booked':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getFacilityTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom':
        return <RoomIcon />;
      case 'laboratory':
        return <SettingsIcon />;
      case 'auditorium':
        return <BuildingIcon />;
      case 'library':
        return <BuildingIcon />;
      case 'sports':
        return <BuildingIcon />;
      case 'cafeteria':
        return <BuildingIcon />;
      case 'office':
        return <BuildingIcon />;
      default:
        return <BuildingIcon />;
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || facility.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredMaintenanceRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Facilities Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<MaintenanceIcon />}
            onClick={() => console.log('Schedule maintenance')}
          >
            Schedule Maintenance
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Facility
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BuildingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{facilities.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Facilities
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {facilities.filter(f => f.status === 'available').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <MaintenanceIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {facilities.filter(f => f.status === 'maintenance').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Maintenance
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <UtilizationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {Math.round(facilities.reduce((sum, f) => sum + f.utilization, 0) / facilities.length)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Utilization
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search facilities, buildings, equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="occupied">Occupied</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="booked">Booked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => console.log('Advanced filters')}
              >
                Advanced Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Facilities" />
          <Tab label="Maintenance" />
          <Tab label="Bookings" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Facility</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Utilization</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Next Maintenance</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFacilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {getFacilityTypeIcon(facility.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{facility.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {facility.area} sq ft
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={facility.type} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{facility.building}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Floor {facility.floor}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{facility.capacity} people</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={facility.utilization}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption">
                        {facility.utilization}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={facility.status}
                      color={getStatusColor(facility.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(facility.nextMaintenance).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedFacility(facility)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Book">
                        <IconButton size="small">
                          <BookingIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Facility</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Requested By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Estimated Cost</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMaintenanceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{request.facilityName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={request.type} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.priority}
                      color={getPriorityColor(request.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {request.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${request.estimatedCost.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Schedule">
                        <IconButton size="small">
                          <ScheduleIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Alert severity="info">
          Facility booking management will be implemented here.
        </Alert>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Alert severity="info">
          Facility reports and analytics will be implemented here.
        </Alert>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default FacilitiesPage;
