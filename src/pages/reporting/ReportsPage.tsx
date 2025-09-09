// =====================================================
// OpenEducat ERP Frontend - Reports & Analytics
// Comprehensive reporting system with charts and exports
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
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ViewIcon from '@mui/icons-material/Visibility';
import ReportIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AcademicIcon from '@mui/icons-material/School';
import FinanceIcon from '@mui/icons-material/Payment';
import UsersIcon from '@mui/icons-material/People';
import AttendanceIcon from '@mui/icons-material/EventNote';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { reportsApi } from '../../services/api';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'financial' | 'attendance' | 'users' | 'custom';
  type: 'chart' | 'table' | 'summary';
  lastGenerated?: string;
  parameters: ReportParameter[];
}

interface ReportParameter {
  name: string;
  type: 'date' | 'select' | 'text' | 'number';
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

interface ReportData {
  summary: {
    totalRecords: number;
    generatedAt: string;
    filters: Record<string, any>;
  };
  chartData?: any[];
  tableData?: any[];
  statistics?: Record<string, number>;
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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [generateDialog, setGenerateDialog] = useState(false);
  const [reportParameters, setReportParameters] = useState<Record<string, any>>({});

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getAvailableReports();
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    try {
      setLoading(true);
      const response = await reportsApi.generateReport(selectedReport.id, reportParameters);
      setReportData(response.data);
      setGenerateDialog(false);
      setError(null);
    } catch (err) {
      setError('Failed to generate report');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!selectedReport || !reportData) return;

    try {
      const response = await reportsApi.exportReport(selectedReport.id, format, reportParameters);
      
      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedReport.name}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to export report as ${format.toUpperCase()}`);
      console.error('Error exporting report:', err);
    }
  };

  const openGenerateDialog = (report: Report) => {
    setSelectedReport(report);
    
    // Initialize parameters with default values
    const initialParams: Record<string, any> = {};
    report.parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        initialParams[param.name] = param.defaultValue;
      } else if (param.type === 'date') {
        initialParams[param.name] = new Date();
      } else {
        initialParams[param.name] = '';
      }
    });
    setReportParameters(initialParams);
    setGenerateDialog(true);
  };

  const renderParameterInput = (parameter: ReportParameter) => {
    const value = reportParameters[parameter.name] || '';

    switch (parameter.type) {
      case 'date':
        return (
          <DatePicker
            label={parameter.label}
            value={value}
            onChange={(date) => 
              setReportParameters(prev => ({ ...prev, [parameter.name]: date }))
            }
            slotProps={{
              textField: { fullWidth: true, required: parameter.required },
            }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth required={parameter.required}>
            <InputLabel>{parameter.label}</InputLabel>
            <Select
              value={value}
              label={parameter.label}
              onChange={(e) => 
                setReportParameters(prev => ({ ...prev, [parameter.name]: e.target.value }))
              }
            >
              {parameter.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={parameter.label}
            value={value}
            onChange={(e) => 
              setReportParameters(prev => ({ ...prev, [parameter.name]: e.target.value }))
            }
            required={parameter.required}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            label={parameter.label}
            value={value}
            onChange={(e) => 
              setReportParameters(prev => ({ ...prev, [parameter.name]: e.target.value }))
            }
            required={parameter.required}
          />
        );
    }
  };

  const renderChart = () => {
    if (!reportData?.chartData) return null;

    switch (selectedReport?.type) {
      case 'chart':
        if (selectedReport.name.toLowerCase().includes('trend')) {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={reportData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );
        } else if (selectedReport.name.toLowerCase().includes('distribution')) {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={reportData.chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          );
        }

      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <AcademicIcon />;
      case 'financial': return <FinanceIcon />;
      case 'attendance': return <AttendanceIcon />;
      case 'users': return <UsersIcon />;
      default: return <ReportIcon />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'primary';
      case 'financial': return 'success';
      case 'attendance': return 'info';
      case 'users': return 'secondary';
      default: return 'default';
    }
  };

  const reportsByCategory = reports.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, Report[]>);

  if (loading && reports.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Available Reports */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Reports
                </Typography>
                
                {Object.entries(reportsByCategory).map(([category, categoryReports]) => (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {category} Reports
                    </Typography>
                    {categoryReports.map(report => (
                      <Card 
                        key={report.id} 
                        variant="outlined" 
                        sx={{ 
                          mb: 1, 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => openGenerateDialog(report)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {getCategoryIcon(report.category)}
                            <Typography variant="subtitle2">
                              {report.name}
                            </Typography>
                            <Chip
                              label={report.category}
                              size="small"
                              color={getCategoryColor(report.category) as any}
                              variant="outlined"
                             />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {report.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Report Results */}
          <Grid item xs={12} md={8}>
            {reportData && selectedReport ? (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      {selectedReport.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExportReport('pdf')}
                      >
                        PDF
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExportReport('excel')}
                      >
                        Excel
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExportReport('csv')}
                      >
                        CSV
                      </Button>
                    </Box>
                  </Box>

                  {/* Report Summary */}
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Generated on {new Date(reportData.summary.generatedAt).toLocaleString()} | 
                      Total Records: {reportData.summary.totalRecords}
                    </Typography>
                  </Alert>

                  {/* Statistics */}
                  {reportData.statistics && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {Object.entries(reportData.statistics).map(([key, value]) => (
                        <Grid item xs={6} sm={3} key={key}>
                          <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h6" color="primary">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {/* Chart */}
                  {renderChart()}

                  {/* Table Data */}
                  {reportData.tableData && reportData.tableData.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Detailed Data
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {Object.keys(reportData.tableData[0]).map(key => (
                                <TableCell key={key}>
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.tableData.slice(0, 10).map((row, index) => (
                              <TableRow key={index}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell key={cellIndex}>
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {reportData.tableData.length > 10 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Showing first 10 of {reportData.tableData.length} records
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <TrendingUpIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a report from the left panel to generate and view analytics
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Generate Report Dialog */}
        <Dialog
          open={generateDialog}
          onClose={() => setGenerateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Generate Report: {selectedReport?.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedReport?.description}
            </Typography>
            
            {selectedReport?.parameters && selectedReport.parameters.length > 0 && (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {selectedReport.parameters.map(parameter => (
                  <Grid item xs={12} md={6} key={parameter.name}>
                    {renderParameterInput(parameter)}
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              variant="contained"
              startIcon={<ViewIcon />}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsPage;
