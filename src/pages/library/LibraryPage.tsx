// =====================================================
// Library Management Page
// Comprehensive library operations interface
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
  Badge,
  Tooltip,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import QrCodeIcon from '@mui/icons-material/QrCode';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  status: 'available' | 'issued' | 'reserved' | 'maintenance';
}

interface Member {
  id: string;
  name: string;
  memberType: 'student' | 'staff' | 'faculty';
  membershipId: string;
  email: string;
  phone: string;
  issuedBooks: number;
  fines: number;
  status: 'active' | 'suspended' | 'expired';
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
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const LibraryPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'Introduction to Computer Science',
        author: 'John Smith',
        isbn: '978-0123456789',
        category: 'Computer Science',
        publisher: 'Tech Publications',
        publishedYear: 2023,
        totalCopies: 5,
        availableCopies: 3,
        location: 'A-101',
        status: 'available',
      },
      {
        id: '2',
        title: 'Advanced Mathematics',
        author: 'Jane Doe',
        isbn: '978-0987654321',
        category: 'Mathematics',
        publisher: 'Academic Press',
        publishedYear: 2022,
        totalCopies: 3,
        availableCopies: 0,
        location: 'B-205',
        status: 'issued',
      },
      {
        id: '3',
        title: 'Physics Fundamentals',
        author: 'Robert Johnson',
        isbn: '978-0456789123',
        category: 'Physics',
        publisher: 'Science Books',
        publishedYear: 2023,
        totalCopies: 4,
        availableCopies: 2,
        location: 'C-150',
        status: 'available',
      },
    ];

    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        memberType: 'student',
        membershipId: 'STU001',
        email: 'alice@s-erp.com',
        phone: '+1-555-0101',
        issuedBooks: 2,
        fines: 0,
        status: 'active',
      },
      {
        id: '2',
        name: 'Prof. Bob Wilson',
        memberType: 'faculty',
        membershipId: 'FAC001',
        email: 'bob.wilson@s-erp.com',
        phone: '+1-555-0102',
        issuedBooks: 5,
        fines: 15.50,
        status: 'active',
      },
      {
        id: '3',
        name: 'Carol Martinez',
        memberType: 'staff',
        membershipId: 'STA001',
        email: 'carol@s-erp.com',
        phone: '+1-555-0103',
        issuedBooks: 1,
        fines: 0,
        status: 'active',
      },
    ];

    setBooks(mockBooks);
    setMembers(mockMembers);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'issued':
        return 'warning';
      case 'reserved':
        return 'info';
      case 'maintenance':
        return 'error';
      case 'active':
        return 'success';
      case 'suspended':
        return 'error';
      case 'expired':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getMemberTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <PersonIcon />;
      case 'faculty':
        return <AssignmentIcon />;
      case 'staff':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Library Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => console.log('Import data')}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => console.log('Export data')}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add New
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
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{books.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Books
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
                    {books.reduce((sum, book) => sum + book.availableCopies, 0)}
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
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {books.reduce((sum, book) => sum + (book.totalCopies - book.availableCopies), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issued
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{members.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Members
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
                placeholder="Search books, members, ISBN..."
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
                  <MenuItem value="issued">Issued</MenuItem>
                  <MenuItem value="reserved">Reserved</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
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
          <Tab label="Books" />
          <Tab label="Members" />
          <Tab label="Transactions" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Details</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{book.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ISBN: {book.isbn}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">
                        {book.availableCopies}/{book.totalCopies}
                      </Typography>
                      <CircularProgress
                        variant="determinate"
                        value={(book.availableCopies / book.totalCopies) * 100}
                        size={20}
                        thickness={4}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{book.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={book.status}
                      color={getStatusColor(book.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedBook(book)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="QR Code">
                        <IconButton size="small">
                          <QrCodeIcon />
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
                <TableCell>Member Details</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Issued Books</TableCell>
                <TableCell>Fines</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>
                        {getMemberTypeIcon(member.memberType)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {member.membershipId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.memberType} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{member.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Badge badgeContent={member.issuedBooks} color="primary">
                      <BookIcon />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.fines > 0 ? (
                      <Chip
                        label={`$${member.fines.toFixed(2)}`}
                        color="error"
                        size="small"
                        icon={<WarningIcon />}
                      />
                    ) : (
                      <Typography variant="body2">$0.00</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      color={getStatusColor(member.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Profile">
                        <IconButton size="small" onClick={() => setSelectedMember(member)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="History">
                        <IconButton size="small">
                          <HistoryIcon />
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
          Transaction history and issue/return management will be implemented here.
        </Alert>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Alert severity="info">
          Library reports and analytics will be implemented here.
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

export default LibraryPage;
