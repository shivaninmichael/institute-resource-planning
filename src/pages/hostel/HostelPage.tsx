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
  Container,
  Stack,
  Paper
} from '@mui/material';
import Building2Icon from '@mui/icons-material/Business';
import UsersIcon from '@mui/icons-material/People';
import BedIcon from '@mui/icons-material/Hotel';
import UserCheckIcon from '@mui/icons-material/PersonCheck';
import WrenchIcon from '@mui/icons-material/Build';
import CalendarIcon from '@mui/icons-material/Event';
import PlusIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import MoreVerticalIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface Hostel {
  id: number;
  name: string;
  code: string;
  type: string;
  address: string;
  capacity: number;
  current_occupancy: number;
  status: string;
  created_at: string;
}

interface Room {
  id: number;
  hostel_id: number;
  room_number: string;
  room_type: string;
  capacity: number;
  current_occupancy: number;
  rent: number;
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
      id={`hostel-tabpanel-${index}`}
      aria-labelledby={`hostel-tab-${index}`}
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
    id: `hostel-tab-${index}`,
    'aria-controls': `hostel-tabpanel-${index}`,
  };
}

const HostelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTarget, setMenuTarget] = useState<{type: string, id: number} | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data loading - replace with actual API calls
      setHostels([
        {
          id: 1,
          name: 'Main Hostel',
          code: 'MH001',
          type: 'Boys',
          address: '123 University Road',
          capacity: 200,
          current_occupancy: 150,
          status: 'active',
          created_at: '2024-01-01'
        }
      ]);
      setRooms([
        {
          id: 1,
          hostel_id: 1,
          room_number: '101',
          room_type: 'Single',
          capacity: 1,
          current_occupancy: 1,
          rent: 5000,
          status: 'occupied',
          created_at: '2024-01-01'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load hostel data');
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
    toast.success(`${type} deleted successfully`);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'occupied': return 'success';
      case 'vacant': return 'info';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const filteredHostels = hostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRooms = rooms.filter(room =>
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Hostel Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
          >
            Add New
          </Button>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search hostel data..."
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
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="hostel tabs">
              <Tab label="Hostels" {...a11yProps(0)} />
              <Tab label="Rooms" {...a11yProps(1)} />
              <Tab label="Allocations" {...a11yProps(2)} />
              <Tab label="Visitors" {...a11yProps(3)} />
              <Tab label="Maintenance" {...a11yProps(4)} />
            </Tabs>
          </Box>

          {/* Hostels Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {filteredHostels.map((hostel) => (
                <Grid item xs={12} md={6} lg={4} key={hostel.id}>
                  <Card>
                    <CardHeader
                      title={hostel.name}
                      subheader={hostel.code}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'hostel', hostel.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Type: {hostel.type}
                        </Typography>
                        <Typography variant="body2">
                          Address: {hostel.address}
                        </Typography>
                        <Typography variant="body2">
                          Occupancy: {hostel.current_occupancy}/{hostel.capacity}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={hostel.status} 
                            color={getStatusColor(hostel.status)}
                            size="small"
                           />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Rooms Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {filteredRooms.map((room) => (
                <Grid item xs={12} md={6} lg={4} key={room.id}>
                  <Card>
                    <CardHeader
                      title={`Room ${room.room_number}`}
                      subheader={room.room_type}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'room', room.id)}
                        >
                          <MoreVerticalIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Capacity: {room.capacity} person(s)
                        </Typography>
                        <Typography variant="body2">
                          Occupancy: {room.current_occupancy}/{room.capacity}
                        </Typography>
                        <Typography variant="body2">
                          Rent: ₹{room.rent}/month
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={room.status} 
                            color={getStatusColor(room.status)}
                            size="small"
                           />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Other tabs */}
          <TabPanel value={activeTab} index={2}>
            <Typography>Room Allocations content coming soon...</Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography>Visitor Logs content coming soon...</Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Typography>Maintenance Requests content coming soon...</Typography>
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
      </Box>
    </Container>
  );
};

export default HostelPage;