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
import GraduationCap from '@mui/icons-material/School';
import Calendar from '@mui/icons-material/Event';
import Heart from '@mui/icons-material/Favorite';
import Users from '@mui/icons-material/People';
import Briefcase from '@mui/icons-material/Work';
import Plus from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import Filter from '@mui/icons-material/FilterList';
import MoreVertical from '@mui/icons-material/MoreVert';
import Eye from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import Trash2 from '@mui/icons-material/Delete';
import ExternalLink from '@mui/icons-material/OpenInNew';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface Alumni {
  id: number;
  graduation_year: number;
  degree?: string;
  current_company?: string;
  current_position?: string;
  industry?: string;
  willing_to_mentor: boolean;
  status: 'active' | 'inactive';
  student_first_name?: string;
  student_last_name?: string;
  student_gr_no?: string;
  partner_name?: string;
  department_name?: string;
  program_name?: string;
  batch_name?: string;
  created_at: string;
}

interface AlumniEvent {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees_count: number;
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
      id={`alumni-tabpanel-${index}`}
      aria-labelledby={`alumni-tab-${index}`}
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
    id: `alumni-tab-${index}`,
    'aria-controls': `alumni-tabpanel-${index}`,
  };
}

const AlumniPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [events, setEvents] = useState<AlumniEvent[]>([]);
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
      setAlumni([
        {
          id: 1,
          graduation_year: 2020,
          degree: 'B.Tech Computer Science',
          current_company: 'Google',
          current_position: 'Software Engineer',
          industry: 'Technology',
          willing_to_mentor: true,
          status: 'active',
          student_first_name: 'John',
          student_last_name: 'Doe',
          created_at: '2024-01-01'
        }
      ]);
      setEvents([
        {
          id: 1,
          name: 'Annual Alumni Meet',
          description: 'Annual gathering of all alumni',
          date: '2024-12-15',
          location: 'Main Campus',
          status: 'upcoming',
          attendees_count: 150,
          created_at: '2024-01-01'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load alumni data');
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
      case 'upcoming': return 'info';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const filteredAlumni = alumni.filter(alum =>
    `${alum.student_first_name} ${alum.student_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.degree?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Alumni Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus />}
          >
            Add New
          </Button>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search alumni data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="alumni tabs">
              <Tab label="Alumni" {...a11yProps(0)} />
              <Tab label="Events" {...a11yProps(1)} />
              <Tab label="Donations" {...a11yProps(2)} />
              <Tab label="Mentorship" {...a11yProps(3)} />
              <Tab label="Job Posts" {...a11yProps(4)} />
            </Tabs>
          </Box>

          {/* Alumni Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {filteredAlumni.map((alum) => (
                <Grid item xs={12} md={6} lg={4} key={alum.id}>
                  <Card>
                    <CardHeader
                      title={`${alum.student_first_name} ${alum.student_last_name}`}
                      subheader={`Class of ${alum.graduation_year}`}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'alumni', alum.id)}
                        >
                          <MoreVertical />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          {alum.degree}
                        </Typography>
                        <Typography variant="body2">
                          {alum.current_position} at {alum.current_company}
                        </Typography>
                        <Typography variant="body2">
                          Industry: {alum.industry}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={alum.status} 
                            color={getStatusColor(alum.status)}
                            size="small"
                          />
                          {alum.willing_to_mentor && (
                            <Chip 
                              label="Mentor" 
                              color="primary"
                              size="small"
                            />
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Events Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event.id}>
                  <Card>
                    <CardHeader
                      title={event.name}
                      subheader={new Date(event.date).toLocaleDateString()}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'event', event.id)}
                        >
                          <MoreVertical />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          {event.description}
                        </Typography>
                        <Typography variant="body2">
                          Location: {event.location}
                        </Typography>
                        <Typography variant="body2">
                          Attendees: {event.attendees_count}
                        </Typography>
                        <Chip 
                          label={event.status} 
                          color={getStatusColor(event.status)}
                          size="small"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Other tabs would go here */}
          <TabPanel value={activeTab} index={2}>
            <Typography>Donations content coming soon...</Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography>Mentorship content coming soon...</Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Typography>Job Posts content coming soon...</Typography>
          </TabPanel>
        </Paper>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuClose()}>
            <Eye sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose()}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem 
            onClick={() => menuTarget && handleDelete(menuTarget.id, menuTarget.type)}
            sx={{ color: 'error.main' }}
          >
            <Trash2 sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
};

export default AlumniPage;