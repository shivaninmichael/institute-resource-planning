// =====================================================
// OpenEducat ERP Frontend - Student Assignments
// Student view and submission of assignments
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CompletedIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Warning';
import OverdueIcon from '@mui/icons-material/Error';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../services/api';

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submissionDate?: string;
  obtainedMarks?: number;
  feedback?: string;
  attachments: string[];
  submissionFiles: string[];
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
      id={`assignment-tabpanel-${index}`}
      aria-labelledby={`assignment-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const StudentAssignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [submissionDialog, setSubmissionDialog] = useState<{
    open: boolean;
    assignment: Assignment | null;
  }>({ open: false, assignment: null });
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudent(Number(user?.id) || 0);
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load assignments');
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submissionDialog.assignment) return;

    try {
      const formData = new FormData();
      formData.append('assignmentId', submissionDialog.assignment.id);
      formData.append('submissionText', submissionText);
      
      submissionFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      // await studentApi.submitAssignment(formData);
      
      // Refresh assignments
      loadAssignments();
      
      // Close dialog and reset form
      setSubmissionDialog({ open: false, assignment: null });
      setSubmissionText('');
      setSubmissionFiles([]);
    } catch (err) {
      setError('Failed to submit assignment');
      console.error('Error submitting assignment:', err);
    }
  };

  const getStatusColor = (assignment: Assignment) => {
    switch (assignment.status) {
      case 'submitted':
        return 'info';
      case 'graded':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (assignment: Assignment) => {
    switch (assignment.status) {
      case 'submitted':
        return <ScheduleIcon />;
      case 'graded':
        return <CompletedIcon />;
      case 'overdue':
        return <OverdueIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filterAssignments = (status: string) => {
    switch (status) {
      case 'pending':
        return assignments.filter(a => a.status === 'pending');
      case 'submitted':
        return assignments.filter(a => a.status === 'submitted');
      case 'graded':
        return assignments.filter(a => a.status === 'graded');
      case 'overdue':
        return assignments.filter(a => a.status === 'overdue');
      default:
        return assignments;
    }
  };

  const renderAssignmentCard = (assignment: Assignment) => {
    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
    
    return (
      <Card key={assignment.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {assignment.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {assignment.courseCode} - {assignment.courseName}
              </Typography>
              <Typography variant="body2" paragraph>
                {assignment.description}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(assignment)}
              label={assignment.status.toUpperCase()}
              color={getStatusColor(assignment) as any}
            />
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Assigned Date
              </Typography>
              <Typography variant="body2">
                {new Date(assignment.assignedDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Due Date
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  color: daysUntilDue < 0 ? 'error.main' : 
                         daysUntilDue <= 3 ? 'warning.main' : 'text.primary'
                }}
              >
                {new Date(assignment.dueDate).toLocaleDateString()}
                {daysUntilDue >= 0 && ` (${daysUntilDue} days left)`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Max Marks
              </Typography>
              <Typography variant="body2">
                {assignment.maxMarks}
              </Typography>
            </Grid>
            {assignment.status === 'graded' && (
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Obtained Marks
                </Typography>
                <Typography variant="body2" color="primary">
                  {assignment.obtainedMarks}/{assignment.maxMarks}
                </Typography>
              </Grid>
            )}
          </Grid>

          {assignment.status === 'graded' && assignment.feedback && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Feedback:</Typography>
              <Typography variant="body2">{assignment.feedback}</Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {assignment.attachments.length > 0 && (
              <Button
                startIcon={<DownloadIcon />}
                size="small"
                variant="outlined"
              >
                Download Materials ({assignment.attachments.length})
              </Button>
            )}
            
            {assignment.status === 'pending' && (
              <Button
                startIcon={<UploadIcon />}
                size="small"
                variant="contained"
                onClick={() => setSubmissionDialog({ open: true, assignment })}
              >
                Submit Assignment
              </Button>
            )}
            
            {assignment.submissionFiles.length > 0 && (
              <Button
                startIcon={<DownloadIcon />}
                size="small"
                variant="outlined"
                color="success"
              >
                My Submission ({assignment.submissionFiles.length})
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  const pendingAssignments = filterAssignments('pending');
  const submittedAssignments = filterAssignments('submitted');
  const gradedAssignments = filterAssignments('graded');
  const overdueAssignments = filterAssignments('overdue');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Assignments
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {pendingAssignments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {submittedAssignments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CompletedIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {gradedAssignments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Graded
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <OverdueIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="error.main">
                {overdueAssignments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assignments Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`All (${assignments.length})`} />
          <Tab label={`Pending (${pendingAssignments.length})`} />
          <Tab label={`Submitted (${submittedAssignments.length})`} />
          <Tab label={`Graded (${gradedAssignments.length})`} />
          <Tab label={`Overdue (${overdueAssignments.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            {assignments.map(renderAssignmentCard)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {pendingAssignments.map(renderAssignmentCard)}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {submittedAssignments.map(renderAssignmentCard)}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {gradedAssignments.map(renderAssignmentCard)}
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            {overdueAssignments.map(renderAssignmentCard)}
          </TabPanel>
        </Box>
      </Card>

      {/* Submission Dialog */}
      <Dialog
        open={submissionDialog.open}
        onClose={() => setSubmissionDialog({ open: false, assignment: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Submit Assignment: {submissionDialog.assignment?.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Submission Text"
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Files
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setSubmissionFiles(Array.from(e.target.files));
                }
              }}
            />
          </Button>
          
          {submissionFiles.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Selected Files:
              </Typography>
              {submissionFiles.map((file, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialog({ open: false, assignment: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitAssignment}
            variant="contained"
            disabled={!submissionText.trim() && submissionFiles.length === 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentAssignments;

