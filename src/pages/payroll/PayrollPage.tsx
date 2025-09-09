// =====================================================
// Payroll Management Page
// Employee payroll and salary management interface
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
  Tabs,
  Tab,
  Stack,
  Avatar,
  LinearProgress,
  Tooltip,
  Alert,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import SalaryIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import PayslipIcon from '@mui/icons-material/Receipt';
import GrowthIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payrollStatus: 'processed' | 'pending' | 'hold' | 'approved';
  lastPayDate: string;
  ytdEarnings: number;
}

interface PayrollCycle {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'processing' | 'approved' | 'paid';
  totalEmployees: number;
  totalAmount: number;
  processedDate?: string;
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
      id={`payroll-tabpanel-${index}`}
      aria-labelledby={`payroll-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PayrollPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollCycles, setPayrollCycles] = useState<PayrollCycle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Mock data
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Smith',
        employeeId: 'EMP001',
        department: 'Computer Science',
        position: 'Professor',
        email: 'john.smith@s-erp.com',
        baseSalary: 8000,
        allowances: 1500,
        deductions: 800,
        netSalary: 8700,
        payrollStatus: 'processed',
        lastPayDate: '2024-01-31',
        ytdEarnings: 104400,
      },
      {
        id: '2',
        name: 'Jane Doe',
        employeeId: 'EMP002',
        department: 'Mathematics',
        position: 'Associate Professor',
        email: 'jane.doe@s-erp.com',
        baseSalary: 7000,
        allowances: 1200,
        deductions: 700,
        netSalary: 7500,
        payrollStatus: 'pending',
        lastPayDate: '2024-01-31',
        ytdEarnings: 90000,
      },
      {
        id: '3',
        name: 'Mike Johnson',
        employeeId: 'EMP003',
        department: 'Administration',
        position: 'Admin Officer',
        email: 'mike.johnson@s-erp.com',
        baseSalary: 4500,
        allowances: 800,
        deductions: 450,
        netSalary: 4850,
        payrollStatus: 'approved',
        lastPayDate: '2024-01-31',
        ytdEarnings: 58200,
      },
    ];

    const mockPayrollCycles: PayrollCycle[] = [
      {
        id: '1',
        period: 'January 2024',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'paid',
        totalEmployees: 45,
        totalAmount: 387500,
        processedDate: '2024-02-01',
      },
      {
        id: '2',
        period: 'February 2024',
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        status: 'processing',
        totalEmployees: 47,
        totalAmount: 402300,
      },
    ];

    setEmployees(mockEmployees);
    setPayrollCycles(mockPayrollCycles);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
      case 'approved':
      case 'paid':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'hold':
      case 'draft':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || employee.payrollStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.netSalary, 0);
  const avgSalary = totalPayroll / employees.length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Payroll Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => console.log('Process payroll')}
          >
            Process Payroll
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => console.log('Add employee')}
          >
            Add Employee
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{employees.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Employees
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
                  <SalaryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${totalPayroll.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Payroll
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
                  <GrowthIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${Math.round(avgSalary).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Salary
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
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {employees.filter(e => e.payrollStatus === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Payroll
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
                placeholder="Search employees, departments..."
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
                  <MenuItem value="processed">Processed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="hold">On Hold</MenuItem>
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
          <Tab label="Employees" />
          <Tab label="Payroll Cycles" />
          <Tab label="Reports" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Base Salary</TableCell>
                <TableCell>Allowances</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{employee.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.employeeId} • {employee.position}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${employee.baseSalary.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main">
                      +${employee.allowances.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main">
                      -${employee.deductions.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      ${employee.netSalary.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.payrollStatus}
                      color={getStatusColor(employee.payrollStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedEmployee(employee)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Generate Payslip">
                        <IconButton size="small">
                          <PayslipIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Payslip">
                        <IconButton size="small">
                          <SendIcon />
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
                <TableCell>Period</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Employees</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Processed Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollCycles.map((cycle) => (
                <TableRow key={cycle.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{cycle.period}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{cycle.totalEmployees}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      ${cycle.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={cycle.status}
                      color={getStatusColor(cycle.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {cycle.processedDate ? new Date(cycle.processedDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Report">
                        <IconButton size="small">
                          <DownloadIcon />
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
          Payroll reports and analytics will be implemented here.
        </Alert>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Alert severity="info">
          Payroll settings and configuration will be implemented here.
        </Alert>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => console.log('Quick action')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default PayrollPage;
