// =====================================================
// Analytics and Reporting Page
// Advanced analytics, report builder and data visualization
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Fab,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RunIcon from '@mui/icons-material/PlayArrow';
import ExportIcon from '@mui/icons-material/Download';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChartIcon from '@mui/icons-material/BarChart';
import TableIcon from '@mui/icons-material/TableChart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Type definitions
interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  widgets: Widget[];
}

interface Widget {
  id: string;
  name: string;
  type: string;
  data: any;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  createdAt: string;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  headers: string[];
  rows: any[][];
  summary: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportBuilderOpen, setReportBuilderOpen] = useState(false);
  const [dashboardBuilderOpen, setDashboardBuilderOpen] = useState(false);

  // Mock data
  const mockReports: Report[] = [
    {
      id: 'student_enrollment',
      name: 'Student Enrollment Analysis',
      description: 'Analysis of student enrollment trends by department and time period',
      category: 'Academic',
      createdAt: new Date().toISOString(),
      tags: ['students', 'enrollment', 'academic'],
      widgets: []
    },
    {
      id: 'fee_collection',
      name: 'Fee Collection Analysis',
      description: 'Analysis of fee collection status and trends',
      category: 'Financial',
      createdAt: new Date().toISOString(),
      tags: ['fees', 'financial', 'collection'],
      widgets: []
    },
    {
      id: 'attendance_analysis',
      name: 'Attendance Analysis',
      description: 'Student attendance patterns and trends',
      category: 'Academic',
      createdAt: new Date().toISOString(),
      tags: ['attendance', 'academic', 'trends'],
      widgets: []
    }
  ];

  const mockDashboards: Dashboard[] = [
    {
      id: 'academic_dashboard',
      name: 'Academic Dashboard',
      description: 'Overview of academic performance and enrollment',
      widgets: [
        { id: 'w1', name: 'Student Enrollment', type: 'chart', data: {} },
        { id: 'w2', name: 'Attendance Trends', type: 'chart', data: {} },
        { id: 'w3', name: 'Total Students', type: 'kpi', data: {} }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'financial_dashboard',
      name: 'Financial Dashboard',
      description: 'Financial overview and fee collection analysis',
      widgets: [
        { id: 'w1', name: 'Fee Collection Status', type: 'chart', data: {} },
        { id: 'w2', name: 'Revenue Trend', type: 'chart', data: {} },
        { id: 'w3', name: 'Total Revenue', type: 'kpi', data: {} }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  const mockDataSources: DataSource[] = [
    {
      id: 'student_data',
      name: 'Student Database',
      type: 'database',
      headers: ['ID', 'Name', 'Email', 'Department', 'Enrollment Date'],
      rows: [
        ['1', 'John Doe', 'john@example.com', 'Computer Science', '2023-01-15'],
        ['2', 'Jane Smith', 'jane@example.com', 'Mathematics', '2023-01-20']
      ],
      summary: { totalRecords: 2, lastUpdated: '2023-12-01' }
    },
    {
      id: 'fee_data',
      name: 'Fee Collection Data',
      type: 'csv',
      headers: ['Student ID', 'Fee Type', 'Amount', 'Status', 'Due Date'],
      rows: [
        ['1', 'Tuition', '5000', 'Paid', '2023-12-01'],
        ['2', 'Tuition', '5000', 'Pending', '2023-12-01']
      ],
      summary: { totalRecords: 2, lastUpdated: '2023-12-01' }
    }
  ];

  const mockChartData = {
    bar: {
      labels: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'],
      datasets: [
        {
          label: 'Students',
          data: [65, 59, 80, 81, 56],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    line: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Attendance Rate',
          data: [85, 87, 82, 89, 91, 88],
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    },
    pie: {
      labels: ['Paid', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  };

  useEffect(() => {
    setReports(mockReports);
    setDashboards(mockDashboards);
    setDataSources(mockDataSources);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const runReport = async (reportId: string) => {
    setIsLoading(true);
    setSelectedReport(reports.find(r => r.id === reportId) || null);
    
    // Simulate API call
    setTimeout(() => {
      setReportData({
        headers: ['Department', 'Students', 'Avg GPA'],
        rows: [
          ['Computer Science', 120, 3.8],
          ['Mathematics', 95, 3.7],
          ['Physics', 80, 3.6],
          ['Chemistry', 75, 3.9],
          ['Biology', 65, 3.5]
        ],
        summary: {
          totalRecords: 5,
          aggregations: {
            total_students: 435,
            avg_gpa: 3.7
          }
        }
      });
      setIsLoading(false);
    }, 2000);
  };

  const exportReport = (reportId: string, format: string) => {
    // Simulate export
    console.log(`Exporting report ${reportId} as ${format}`);
  };

  const renderReports = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setReportBuilderOpen(true)}
        >
          Create Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {report.description}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  {report.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip label={report.category} color="primary" size="small" />
                  <Box>
                    <Tooltip title="Run Report">
                      <IconButton size="small" onClick={() => runReport(report.id)}>
                        <RunIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Export">
                      <IconButton size="small" onClick={() => exportReport(report.id, 'csv')}>
                        <ExportIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Results Dialog */}
      <Dialog open={!!reportData} onClose={() => setReportData(null)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedReport?.name} Results
          {isLoading && <LinearProgress sx={{ mt: 1 }} />}
        </DialogTitle>
        <DialogContent>
          {reportData && (
            <Box>
              {/* Chart Visualization */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Visualization
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Bar data={mockChartData.bar} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Pie data={mockChartData.pie} />
                  </Grid>
                </Grid>
              </Box>

              {/* Data Table */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Data Table
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {reportData.headers.map((header: any) => (
                          <TableCell key={header}>{header}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.rows.map((row: any, index: number) => (
                        <TableRow key={index}>
                           {row.map((cell: any, cellIndex: number) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Summary */}
              {reportData.summary && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="primary">
                            {reportData.summary.totalRecords}
                          </Typography>
                          <Typography variant="body2">Total Records</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    {Object.entries(reportData.summary.aggregations || {}).map(([key, value]) => (
                      <Grid item xs={6} md={3} key={key}>
                        <Card>
                          <CardContent>
                            <Typography variant="h4" color="secondary">
                               {String(value)}
                            </Typography>
                            <Typography variant="body2">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportData(null)}>Close</Button>
          <Button variant="contained" startIcon={<ExportIcon />}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderDashboards = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Dashboards</Typography>
        <Button
          variant="contained"
          startIcon={<DashboardIcon />}
          onClick={() => setDashboardBuilderOpen(true)}
        >
          Create Dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dashboards.map((dashboard) => (
          <Grid item xs={12} md={6} lg={4} key={dashboard.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {dashboard.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {dashboard.description}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  {dashboard.widgets.length} widgets
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="caption">
                     Created: {new Date(dashboard.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <Tooltip title="View Dashboard">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderReportBuilder = () => (
    <Dialog open={reportBuilderOpen} onClose={() => setReportBuilderOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Report Builder</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Report Name"
              placeholder="Enter report name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Enter report description"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Data Source</InputLabel>
              <Select label="Data Source">
                <MenuItem value="students">Students</MenuItem>
                <MenuItem value="fees">Fees</MenuItem>
                <MenuItem value="attendance">Attendance</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category">
                <MenuItem value="Academic">Academic</MenuItem>
                <MenuItem value="Financial">Financial</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Administrative">Administrative</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Chart Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Chart Type</InputLabel>
                  <Select label="Chart Type">
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="pie">Pie Chart</MenuItem>
                    <MenuItem value="area">Area Chart</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Chart Title"
                  placeholder="Enter chart title"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setReportBuilderOpen(false)}>Cancel</Button>
        <Button variant="contained">Create Report</Button>
      </DialogActions>
    </Dialog>
  );

  const renderDashboardBuilder = () => (
    <Dialog open={dashboardBuilderOpen} onClose={() => setDashboardBuilderOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Dashboard Builder</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dashboard Name"
              placeholder="Enter dashboard name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Enter dashboard description"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Available Widgets
            </Typography>
            <Grid container spacing={2}>
              {['Chart Widget', 'KPI Widget', 'Table Widget', 'Text Widget'].map((widget) => (
                <Grid item xs={6} md={3} key={widget}>
                  <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <ChartIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">{widget}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDashboardBuilderOpen(false)}>Cancel</Button>
        <Button variant="contained">Create Dashboard</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analytics & Reporting
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Reports" />
            <Tab label="Dashboards" />
            <Tab label="Data Explorer" />
            <Tab label="Scheduled Reports" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderReports()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderDashboards()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Data Explorer
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Explore your data with interactive queries and visualizations.
            </Typography>
            {/* Data explorer content would go here */}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Scheduled Reports
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage automated report generation and distribution.
            </Typography>
            {/* Scheduled reports content would go here */}
          </Box>
        </TabPanel>

        {renderReportBuilder()}
        {renderDashboardBuilder()}
      </Box>
    </Container>
  );
};

export default AnalyticsPage;
