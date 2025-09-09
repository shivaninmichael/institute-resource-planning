import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tab,
  Tabs,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useTransportation } from '../../contexts/TransportationContext';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { DriverForm } from '../../components/forms/DriverForm';
import { RouteForm } from '../../components/forms/RouteForm';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const TransportationDashboard: React.FC = () => {
  const { state, fetchDashboardStats, fetchVehicles, fetchDrivers, fetchRoutes, fetchMaintenanceRecords } = useTransportation();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'vehicle' | 'driver' | 'route'>('vehicle');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
    fetchVehicles();
    fetchDrivers();
    fetchRoutes();
    fetchMaintenanceRecords();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type: 'vehicle' | 'driver' | 'route', item?: any) => {
    setDialogType(type);
    setSelectedItem(item || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'retired':
        return 'error';
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon />;
      case 'maintenance':
        return <BuildIcon />;
      case 'retired':
        return <CancelIcon />;
      case 'scheduled':
        return <ScheduleIcon />;
      case 'in_progress':
        return <WarningIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  if (state.loading && !state.dashboardStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transportation Management
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DirectionsBusIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Vehicles
                  </Typography>
                  <Typography variant="h5">
                    {state.dashboardStats?.total_vehicles || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {state.dashboardStats?.active_vehicles || 0} Active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Drivers
                  </Typography>
                  <Typography variant="h5">
                    {state.dashboardStats?.total_drivers || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {state.dashboardStats?.active_drivers || 0} Active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <RouteIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Routes
                  </Typography>
                  <Typography variant="h5">
                    {state.dashboardStats?.total_routes || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Students Using Transport
                  </Typography>
                  <Typography variant="h5">
                    {state.dashboardStats?.total_students_using_transport || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Maintenance Alert */}
      {state.dashboardStats && state.dashboardStats.pending_maintenance > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            {state.dashboardStats.pending_maintenance} vehicles have pending maintenance scheduled within the next 7 days.
          </Typography>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Vehicles" />
          <Tab label="Drivers" />
          <Tab label="Routes" />
          <Tab label="Maintenance" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Vehicle Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('vehicle')}
            >
              Add Vehicle
            </Button>
          </Box>

          <Grid container spacing={2}>
            {state.vehicles.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6">{vehicle.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {vehicle.vehicle_no}
                        </Typography>
                        <Typography variant="body2">
                          {vehicle.type} • Capacity: {vehicle.capacity}
                        </Typography>
                        {vehicle.driver_name && (
                          <Typography variant="body2">
                            Driver: {vehicle.driver_name}
                          </Typography>
                        )}
                        {vehicle.route_name && (
                          <Typography variant="body2">
                            Route: {vehicle.route_name}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Chip
                          label={vehicle.status}
                          color={getStatusColor(vehicle.status) as any}
                          size="small"
                          icon={getStatusIcon(vehicle.status)}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <IconButton size="small" onClick={() => handleOpenDialog('vehicle', vehicle)}>
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Driver Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('driver')}
            >
              Add Driver
            </Button>
          </Box>

          <Grid container spacing={2}>
            {state.drivers.map((driver) => (
              <Grid item xs={12} sm={6} md={4} key={driver.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{driver.driver_name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      License: {driver.license_no}
                    </Typography>
                    <Typography variant="body2">
                      Type: {driver.license_type || 'N/A'}
                    </Typography>
                    {driver.experience_years && (
                      <Typography variant="body2">
                        Experience: {driver.experience_years} years
                      </Typography>
                    )}
                    <Box mt={1}>
                      <Chip
                        label={driver.status}
                        color={getStatusColor(driver.status) as any}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Route Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('route')}
            >
              Add Route
            </Button>
          </Box>

          <Grid container spacing={2}>
            {state.routes.map((route) => (
              <Grid item xs={12} sm={6} md={4} key={route.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{route.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Code: {route.code}
                    </Typography>
                    <Typography variant="body2">
                      {route.start_point} → {route.end_point}
                    </Typography>
                    {route.distance && (
                      <Typography variant="body2">
                        Distance: {route.distance} km
                      </Typography>
                    )}
                    {route.total_students !== undefined && (
                      <Typography variant="body2">
                        Students: {route.total_students}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      Stops: {route.stops?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" mb={2}>Maintenance Records</Typography>
          
          <List>
            {state.maintenanceRecords.map((record) => (
              <ListItem key={record.id} divider>
                <ListItemIcon>
                  {getStatusIcon(record.status)}
                </ListItemIcon>
                <ListItemText
                  primary={`${record.vehicle_name} (${record.vehicle_no})`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Type: {record.maintenance_type}
                      </Typography>
                      {record.scheduled_date && (
                        <Typography variant="body2">
                          Scheduled: {new Date(record.scheduled_date).toLocaleDateString()}
                        </Typography>
                      )}
                      {record.cost && (
                        <Typography variant="body2">
                          Cost: ${record.cost}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Chip
                  label={record.status}
                  color={getStatusColor(record.status) as any}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>

      {/* Dialog for Forms */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit' : 'Add'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'vehicle' && (
            <VehicleForm
              vehicle={selectedItem}
              onSubmit={handleCloseDialog}
              onCancel={handleCloseDialog}
            />
          )}
          {dialogType === 'driver' && (
            <DriverForm
              driver={selectedItem}
              onSubmit={handleCloseDialog}
              onCancel={handleCloseDialog}
            />
          )}
          {dialogType === 'route' && (
            <RouteForm
              route={selectedItem}
              onSubmit={handleCloseDialog}
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
