import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Chip,
  Tabs,
  Tab,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Grid,
  Paper,
  Container,
  Stack
} from '@mui/material';
import BusIcon from '@mui/icons-material/DirectionsBus';
import UsersIcon from '@mui/icons-material/People';
import MapPinIcon from '@mui/icons-material/LocationOn';
import WrenchIcon from '@mui/icons-material/Build';
import PlusIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import MoreVerticalIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { DriverForm } from '../../components/forms/DriverForm';
import { RouteForm } from '../../components/forms/RouteForm';

interface Vehicle {
  id: number;
  vehicle_no: string;
  type: string;
  capacity: number;
  status: string;
  company_id: number;
  created_at: string;
}

interface Driver {
  id: number;
  name: string;
  license_no: string;
  phone: string;
  status: string;
  created_at: string;
}

interface Route {
  id: number;
  name: string;
  start_location: string;
  end_location: string;
  distance: number;
  status: string;
  created_at: string;
}

interface StudentTransport {
  id: number;
  student_name: string;
  route_name: string;
  pickup_point: string;
  status: string;
  created_at: string;
}

interface MaintenanceRecord {
  id: number;
  vehicle_no: string;
  maintenance_type: string;
  description: string;
  cost: number;
  status: string;
  created_at: string;
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
      id={`transportation-tabpanel-${index}`}
      aria-labelledby={`transportation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `transportation-tab-${index}`,
    'aria-controls': `transportation-tabpanel-${index}`,
  };
}

const TransportationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<StudentTransport[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTarget, setMenuTarget] = useState<{type: string, id: number} | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data loading - replace with actual API calls
      setVehicles([
        { id: 1, vehicle_no: 'BUS001', type: 'Bus', capacity: 50, status: 'active', company_id: 1, created_at: '2024-01-01' },
        { id: 2, vehicle_no: 'VAN001', type: 'Van', capacity: 15, status: 'maintenance', company_id: 1, created_at: '2024-01-02' }
      ]);
      setDrivers([
        { id: 1, name: 'John Doe', license_no: 'DL123456', phone: '9876543210', status: 'active', created_at: '2024-01-01' },
        { id: 2, name: 'Jane Smith', license_no: 'DL789012', phone: '9876543211', status: 'active', created_at: '2024-01-02' }
      ]);
      setRoutes([
        { id: 1, name: 'Route A', start_location: 'School', end_location: 'City Center', distance: 25, status: 'active', created_at: '2024-01-01' }
      ]);
      setStudents([
        { id: 1, student_name: 'Alice Johnson', route_name: 'Route A', pickup_point: 'Stop 1', status: 'active', created_at: '2024-01-01' }
      ]);
      setMaintenanceRecords([
        { id: 1, vehicle_no: 'BUS001', maintenance_type: 'Service', description: 'Regular maintenance', cost: 5000, status: 'completed', created_at: '2024-01-01' }
      ]);
    } catch (error) {
      toast.error('Failed to load transportation data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, type: string, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuTarget({ type, id });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTarget(null);
  };

  const handleDelete = (id: number, type: string) => {
    handleMenuClose();
    // Implement delete logic
    toast.success(`${type} deleted successfully`);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'maintenance': return 'warning';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.start_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.route_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaintenanceRecords = maintenanceRecords.filter(record =>
    record.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.maintenance_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
      {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Transportation Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={() => setActiveTab(activeTab)} // This would open appropriate form based on active tab
          >
            Add New
          </Button>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search transportation data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

      {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="transportation tabs">
              <Tab label="Vehicles" {...a11yProps(0)} />
              <Tab label="Drivers" {...a11yProps(1)} />
              <Tab label="Routes" {...a11yProps(2)} />
              <Tab label="Students" {...a11yProps(3)} />
              <Tab label="Maintenance" {...a11yProps(4)} />
            </Tabs>
          </Box>

        {/* Vehicles Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {filteredVehicles.map((vehicle) => (
                <Grid item xs={12} md={6} lg={4} key={vehicle.id}>
                  <Card>
                    <CardHeader
                      title={vehicle.vehicle_no}
                      subheader={vehicle.type}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'vehicle', vehicle.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Capacity: {vehicle.capacity} passengers
                        </Typography>
                        <Chip 
                          label={vehicle.status} 
                          color={getStatusColor(vehicle.status)}
                          size="small"
                        />
                      </Stack>
                </CardContent>
              </Card>
                </Grid>
            ))}
            </Grid>
          </TabPanel>

        {/* Drivers Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {filteredDrivers.map((driver) => (
                <Grid item xs={12} md={6} lg={4} key={driver.id}>
                  <Card>
                    <CardHeader
                      title={driver.name}
                      subheader={driver.license_no}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'driver', driver.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Phone: {driver.phone}
                        </Typography>
                        <Chip 
                          label={driver.status} 
                          color={getStatusColor(driver.status)}
                          size="small"
                        />
                      </Stack>
                </CardContent>
              </Card>
                </Grid>
            ))}
            </Grid>
          </TabPanel>

        {/* Routes Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              {filteredRoutes.map((route) => (
                <Grid item xs={12} md={6} lg={4} key={route.id}>
                  <Card>
                    <CardHeader
                      title={route.name}
                      subheader={`${route.start_location} → ${route.end_location}`}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'route', route.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Distance: {route.distance} km
                        </Typography>
                        <Chip 
                          label={route.status} 
                          color={getStatusColor(route.status)}
                          size="small"
                        />
                      </Stack>
                </CardContent>
              </Card>
                </Grid>
            ))}
            </Grid>
          </TabPanel>

        {/* Students Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              {filteredStudents.map((student) => (
                <Grid item xs={12} md={6} lg={4} key={student.id}>
                  <Card>
                    <CardHeader
                      title={student.student_name}
                      subheader={student.route_name}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'student', student.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Pickup: {student.pickup_point}
                        </Typography>
                        <Chip 
                          label={student.status} 
                          color={getStatusColor(student.status)}
                          size="small"
                        />
                      </Stack>
                </CardContent>
              </Card>
                </Grid>
            ))}
            </Grid>
          </TabPanel>

        {/* Maintenance Tab */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              {filteredMaintenanceRecords.map((record) => (
                <Grid item xs={12} md={6} lg={4} key={record.id}>
                  <Card>
                    <CardHeader
                      title={record.vehicle_no}
                      subheader={record.maintenance_type}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'maintenance', record.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          {record.description}
                        </Typography>
                        <Typography variant="body2">
                          Cost: ₹{record.cost}
                        </Typography>
                        <Chip 
                          label={record.status} 
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </Stack>
                </CardContent>
              </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Paper>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuClose()}>
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose()}>
            Edit
          </MenuItem>
          <MenuItem 
            onClick={() => menuTarget && handleDelete(menuTarget.id, menuTarget.type)}
            sx={{ color: 'error.main' }}
          >
            Delete
          </MenuItem>
        </Menu>

        {/* Forms - these would be in dialogs */}
              {showVehicleForm && (
          <VehicleForm
            vehicle={selectedVehicle as any}
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        )}
              {showDriverForm && (
          <DriverForm
            driver={selectedDriver}
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        )}
              {showRouteForm && (
          <RouteForm
            route={selectedRoute}
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        )}
      </Box>
    </Container>
  );
};

export default TransportationPage;