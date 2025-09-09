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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Plus from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertical from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import Trash2 from '@mui/icons-material/Delete';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface CertificateType {
  id: number;
  name: string;
  code: string;
  description?: string;
  validity_period: number;
  is_digital: boolean;
  requires_signature: boolean;
  requires_seal: boolean;
  active: boolean;
  created_at: string;
}

interface CertificateTemplate {
  id: number;
  name: string;
  certificate_type_id: number;
  template_content: string;
  variables: string[];
  active: boolean;
  created_at: string;
}

interface Certificate {
  id: number;
  certificate_number: string;
  certificate_type_id: number;
  student_id: number;
  issued_date: string;
  expiry_date?: string;
  status: 'draft' | 'issued' | 'revoked';
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
      id={`certificate-tabpanel-${index}`}
      aria-labelledby={`certificate-tab-${index}`}
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
    id: `certificate-tab-${index}`,
    'aria-controls': `certificate-tabpanel-${index}`,
  };
}

const CertificatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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
      setCertificateTypes([
        {
          id: 1,
          name: 'Graduation Certificate',
          code: 'GRAD',
          description: 'Certificate of graduation',
          validity_period: 0,
          is_digital: true,
          requires_signature: true,
          requires_seal: true,
          active: true,
          created_at: '2024-01-01'
        }
      ]);
      setTemplates([
        {
          id: 1,
          name: 'Standard Graduation Template',
          certificate_type_id: 1,
          template_content: 'Certificate template content...',
          variables: ['student_name', 'course', 'date'],
          active: true,
          created_at: '2024-01-01'
        }
      ]);
      setCertificates([
        {
          id: 1,
          certificate_number: 'CERT2024001',
          certificate_type_id: 1,
          student_id: 1,
          issued_date: '2024-01-15',
          status: 'issued',
          created_at: '2024-01-15'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load certificate data');
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
      case 'issued': return 'success';
      case 'draft': return 'warning';
      case 'revoked': return 'error';
      default: return 'default';
    }
  };

  const filteredTypes = certificateTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCertificates = certificates.filter(cert =>
    cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Certificate Management
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
            placeholder="Search certificates..."
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
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="certificate tabs">
              <Tab label="Certificate Types" {...a11yProps(0)} />
              <Tab label="Templates" {...a11yProps(1)} />
              <Tab label="Certificates" {...a11yProps(2)} />
              <Tab label="Verification" {...a11yProps(3)} />
            </Tabs>
          </Box>

          {/* Certificate Types Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {filteredTypes.map((type) => (
                <Grid item xs={12} md={6} lg={4} key={type.id}>
                  <Card>
                    <CardHeader
                      title={type.name}
                      subheader={type.code}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'type', type.id)}
                        >
                          <MoreVertical />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          {type.description}
                        </Typography>
                        <Typography variant="body2">
                          Validity: {type.validity_period === 0 ? 'Lifetime' : `${type.validity_period} days`}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={type.active ? 'Active' : 'Inactive'} 
                            color={getStatusColor(type.active ? 'active' : 'inactive')}
                            size="small"
                          />
                          {type.is_digital && (
                            <Chip 
                              label="Digital" 
                              color="info"
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

          {/* Templates Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {filteredTemplates.map((template) => (
                <Grid item xs={12} md={6} lg={4} key={template.id}>
                  <Card>
                    <CardHeader
                      title={template.name}
                      subheader={`Variables: ${template.variables.length}`}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'template', template.id)}
                        >
                          <MoreVertical />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Variables: {template.variables.join(', ')}
                        </Typography>
                        <Chip 
                          label={template.active ? 'Active' : 'Inactive'} 
                          color={getStatusColor(template.active ? 'active' : 'inactive')}
                          size="small"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Certificates Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              {filteredCertificates.map((cert) => (
                <Grid item xs={12} md={6} lg={4} key={cert.id}>
                  <Card>
                    <CardHeader
                      title={cert.certificate_number}
                      subheader={`Issued: ${new Date(cert.issued_date).toLocaleDateString()}`}
                      action={
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, 'certificate', cert.id)}
                        >
                          <MoreVertical />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Student ID: {cert.student_id}
                        </Typography>
                        {cert.expiry_date && (
                          <Typography variant="body2">
                            Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={cert.status} 
                            color={getStatusColor(cert.status)}
                            size="small"
                          />
                          <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => toast.success('Download feature coming soon')}
                          >
                            Download
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Verification Tab */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
              <Card>
                <CardHeader title="Verify Certificate" />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Certificate Number"
                      placeholder="Enter certificate number"
                    />
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      fullWidth
                    >
                      Verify Certificate
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Paper>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuClose()}>
            <VisibilityIcon sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose()}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose()}>
            <DownloadIcon sx={{ mr: 1 }} />
            Download
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

export default CertificatePage;