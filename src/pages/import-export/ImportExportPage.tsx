// =====================================================
// OpenEducat ERP Frontend - Import/Export Data
// Data import/export functionality with templates
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ExportIcon from '@mui/icons-material/GetApp';
import ImportIcon from '@mui/icons-material/Publish';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Visibility';
import TemplateIcon from '@mui/icons-material/CloudDownload';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';
import { importExportApi } from '../../services/api';

interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  entityType: string;
  fields: ImportField[];
  sampleData?: any[];
  validations: ValidationRule[];
}

interface ImportField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'boolean';
  required: boolean;
  format?: string;
  options?: string[];
}

interface ValidationRule {
  field: string;
  rule: 'required' | 'unique' | 'format' | 'range';
  message: string;
  params?: any;
}

interface ImportJob {
  id: string;
  fileName: string;
  entityType: string;
  status: 'processing' | 'completed' | 'failed' | 'validating';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[];
  createdAt: string;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ExportJob {
  id: string;
  name: string;
  entityType: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  format: 'excel' | 'csv' | 'pdf';
  filters: any;
  downloadUrl?: string;
  createdAt: string;
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
      id={`import-export-tabpanel-${index}`}
      aria-labelledby={`import-export-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ImportExportPage: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ImportTemplate[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  
  // Import states
  const [selectedTemplate, setSelectedTemplate] = useState<ImportTemplate | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<ImportError[]>([]);

  // Export states
  const [exportDialog, setExportDialog] = useState(false);
  const [exportForm, setExportForm] = useState({
    entityType: '',
    format: 'excel' as 'excel' | 'csv' | 'pdf',
    filters: {},
    fields: [] as string[],
  });

  const steps = ['Select Template', 'Upload File', 'Map Fields', 'Validate', 'Import'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesResponse, importJobsResponse, exportJobsResponse] = await Promise.all([
        importExportApi.getImportTemplates(),
        importExportApi.getImportJobs(),
        importExportApi.getExportJobs(),
      ]);
      setTemplates(templatesResponse.data);
      setImportJobs(importJobsResponse.data);
      setExportJobs(exportJobsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      try {
        // Preview file data
        const formData = new FormData();
        formData.append('file', file);
        const response = await importExportApi.previewImportFile(formData);
        setPreviewData(response.data.preview);
        setActiveStep(2);
      } catch (err) {
        setError('Failed to preview file');
        console.error('Error previewing file:', err);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleTemplateSelect = (template: ImportTemplate) => {
    setSelectedTemplate(template);
    setActiveStep(1);
  };

  const handleFieldMapping = (fileColumn: string, templateField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [fileColumn]: templateField,
    }));
  };

  const validateData = async () => {
    if (!selectedTemplate || !uploadedFile) return;

    try {
      setLoading(true);
      const response = await importExportApi.validateImportData({
        templateId: selectedTemplate.id,
        fieldMapping,
        fileData: previewData,
      });
      setValidationResults(response.data.errors);
      setActiveStep(4);
    } catch (err) {
      setError('Failed to validate data');
      console.error('Error validating data:', err);
    } finally {
      setLoading(false);
    }
  };

  const startImport = async () => {
    if (!selectedTemplate || !uploadedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('templateId', selectedTemplate.id);
      formData.append('fieldMapping', JSON.stringify(fieldMapping));
      
      await importExportApi.startImport(formData);
      
      // Reset form
      resetImportForm();
      loadData();
      
      alert('Import started successfully!');
    } catch (err) {
      setError('Failed to start import');
      console.error('Error starting import:', err);
    } finally {
      setLoading(false);
    }
  };

  const startExport = async () => {
    try {
      setLoading(true);
      await importExportApi.startExport(exportForm);
      
      setExportDialog(false);
      resetExportForm();
      loadData();
      
      alert('Export started successfully!');
    } catch (err) {
      setError('Failed to start export');
      console.error('Error starting export:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (templateId: string) => {
    try {
      const response = await importExportApi.downloadTemplate(templateId);
      
      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `template_${templateId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download template');
      console.error('Error downloading template:', err);
    }
  };

  const resetImportForm = () => {
    setSelectedTemplate(null);
    setUploadedFile(null);
    setPreviewData([]);
    setFieldMapping({});
    setValidationResults([]);
    setActiveStep(0);
  };

  const resetExportForm = () => {
    setExportForm({
      entityType: '',
      format: 'excel',
      filters: {},
      fields: [],
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'processing':
      case 'validating':
        return <CircularProgress size={20} />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
      case 'validating':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (loading && templates.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Import/Export Data
        </Typography>
        <Button
          variant="contained"
          startIcon={<ExportIcon />}
          onClick={() => setExportDialog(true)}
        >
          Export Data
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Import Data" />
          <Tab label={`Import Jobs (${importJobs.length})`} />
          <Tab label={`Export Jobs (${exportJobs.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Import Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 0: Select Template */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Select Import Template
                  </Typography>
                </Grid>
                {templates.map((template) => (
                  <Grid item xs={12} md={6} lg={4} key={template.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {template.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip label={template.entityType} size="small" />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTemplate(template.id);
                            }}
                          >
                            <TemplateIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Step 1: Upload File */}
            {activeStep === 1 && selectedTemplate && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Upload File for {selectedTemplate.name}
                </Typography>
                <Paper
                  {...getRootProps()}
                  sx={{
                    p: 4,
                    border: 2,
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderStyle: 'dashed',
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? 'action.hover' : 'transparent',
                    mb: 3,
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </Typography>
                </Paper>
                
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                >
                  Back
                </Button>
              </Box>
            )}

            {/* Step 2: Map Fields */}
            {activeStep === 2 && previewData.length > 0 && selectedTemplate && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Map Fields
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      File Columns
                    </Typography>
                    <List>
                      {Object.keys(previewData[0] || {}).map((column) => (
                        <ListItem key={column}>
                          <ListItemText primary={column} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Template Fields
                    </Typography>
                    {Object.keys(previewData[0] || {}).map((column) => (
                      <FormControl fullWidth key={column} sx={{ mb: 2 }}>
                        <InputLabel>Map "{column}" to</InputLabel>
                        <Select
                          value={fieldMapping[column] || ''}
                          label={`Map "${column}" to`}
                          onChange={(e) => handleFieldMapping(column, e.target.value)}
                        >
                          <MenuItem value="">Skip</MenuItem>
                          {selectedTemplate.fields.map((field) => (
                            <MenuItem key={field.key} value={field.key}>
                              {field.label} {field.required && '*'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ))}
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(1)}
                    sx={{ mr: 2 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(3)}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 3: Validate */}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Validate Data
                </Typography>
                <Button
                  variant="contained"
                  onClick={validateData}
                  disabled={loading}
                  sx={{ mb: 3 }}
                >
                  {loading ? 'Validating...' : 'Validate Data'}
                </Button>
              </Box>
            )}

            {/* Step 4: Import */}
            {activeStep === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Import Results
                </Typography>
                
                {validationResults.length > 0 ? (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Found {validationResults.length} validation errors. Please fix them before importing.
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Data validation passed! Ready to import.
                  </Alert>
                )}

                <Button
                  variant="contained"
                  onClick={startImport}
                  disabled={validationResults.length > 0 || loading}
                  sx={{ mr: 2 }}
                >
                  {loading ? 'Importing...' : 'Start Import'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetImportForm}
                >
                  Start Over
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Import Jobs
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Entity Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Records</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.fileName}</TableCell>
                      <TableCell>
                        <Chip label={job.entityType} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(job.status)}
                          <Chip
                            label={job.status.toUpperCase()}
                            color={getStatusColor(job.status) as any}
                            size="small"
                           />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={job.progress}
                           />
                          <Typography variant="caption">
                            {job.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {job.processedRecords}/{job.totalRecords}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Success: {job.successCount} | Errors: {job.errorCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export Jobs
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Entity Type</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exportJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.name}</TableCell>
                      <TableCell>
                        <Chip label={job.entityType} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={job.format.toUpperCase()} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(job.status)}
                          <Chip
                            label={job.status.toUpperCase()}
                            color={getStatusColor(job.status) as any}
                            size="small"
                           />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={job.progress}
                           />
                          <Typography variant="caption">
                            {job.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {job.status === 'completed' && job.downloadUrl && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(job.downloadUrl, '_blank')}
                          >
                            <DownloadIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Card>

      {/* Export Dialog */}
      <Dialog
        open={exportDialog}
        onClose={() => setExportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={exportForm.entityType}
                  label="Entity Type"
                  onChange={(e) => setExportForm({ ...exportForm, entityType: e.target.value })}
                >
                  <MenuItem value="students">Students</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="courses">Courses</MenuItem>
                  <MenuItem value="departments">Departments</MenuItem>
                  <MenuItem value="exams">Exams</MenuItem>
                  <MenuItem value="grades">Grades</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={exportForm.format}
                  label="Format"
                  onChange={(e) => setExportForm({ ...exportForm, format: e.target.value as any })}
                >
                  <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={startExport}
            variant="contained"
            disabled={!exportForm.entityType || loading}
          >
            {loading ? 'Starting Export...' : 'Start Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImportExportPage;
