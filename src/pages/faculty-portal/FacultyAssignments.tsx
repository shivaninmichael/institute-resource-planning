// =====================================================
// OpenEducat ERP Frontend - Faculty Assignment Management
// Faculty tools for creating and managing assignments
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
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Menu,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import MoreIcon from '@mui/icons-material/MoreVert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { facultyApi } from '../../services/api';

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  status: 'draft' | 'published' | 'closed';
  submissionsCount: number;
  totalStudents: number;
  attachments: string[];
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  status: 'submitted' | 'graded';
  obtainedMarks?: number;
  feedback?: string;
  files: string[];
}

interface Course {
  id: string;
  code: string;
  name: string;
  studentsCount: number;
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

const FacultyAssignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // Dialog states
  const [assignmentDialog, setAssignmentDialog] = useState<{
    open: boolean;
    assignment: Assignment | null;
    mode: 'create' | 'edit';
  }>({ open: false, assignment: null, mode: 'create' });
  
  const [submissionsDialog, setSubmissionsDialog] = useState<{
    open: boolean;
    assignment: Assignment | null;
  }>({ open: false, assignment: null });

  const [gradingDialog, setGradingDialog] = useState<{
    open: boolean;
    submission: Submission | null;
    marks: string;
    feedback: string;
  }>({ open: false, submission: null, marks: '', feedback: '' });

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: new Date(),
    maxMarks: 100,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [selectedCourse]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [coursesResponse] = await Promise.all([
        facultyApi.getFacultyCourses(user?.id?.toString() || ''),
      ]);
      setCourses(coursesResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getAssignments(user?.id?.toString() || '', {
        courseId: selectedCourse !== 'all' ? selectedCourse : undefined,
      });
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load assignments');
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (assignmentId: string) => {
    try {
      const response = await facultyApi.getAssignmentSubmissions(assignmentId);
      setSubmissions(response.data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await facultyApi.createAssignment({
        ...formData,
        dueDate: formData.dueDate.toISOString(),
        facultyId: user?.id || '',
      });
      
      loadAssignments();
      setAssignmentDialog({ open: false, assignment: null, mode: 'create' });
      resetForm();
    } catch (err) {
      setError('Failed to create assignment');
      console.error('Error creating assignment:', err);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!assignmentDialog.assignment) return;

    try {
      await facultyApi.updateAssignment(assignmentDialog.assignment.id, {
        ...formData,
        dueDate: formData.dueDate.toISOString(),
      });
      
      loadAssignments();
      setAssignmentDialog({ open: false, assignment: null, mode: 'edit' });
      resetForm();
    } catch (err) {
      setError('Failed to update assignment');
      console.error('Error updating assignment:', err);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await facultyApi.deleteFacultyAssignment(assignmentId);
      loadAssignments();
    } catch (err) {
      setError('Failed to delete assignment');
      console.error('Error deleting assignment:', err);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradingDialog.submission) return;

    try {
      await facultyApi.gradeSubmission(gradingDialog.submission.id, {
        obtainedMarks: parseInt(gradingDialog.marks),
        feedback: gradingDialog.feedback,
      });
      
      // Reload submissions
      if (submissionsDialog.assignment) {
        loadSubmissions(submissionsDialog.assignment.id);
      }
      
      setGradingDialog({ open: false, submission: null, marks: '', feedback: '' });
    } catch (err) {
      setError('Failed to grade submission');
      console.error('Error grading submission:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      dueDate: new Date(),
      maxMarks: 100,
    });
  };

  const openAssignmentDialog = (assignment: Assignment | null, mode: 'create' | 'edit') => {
    if (assignment && mode === 'edit') {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        courseId: assignment.courseId,
        dueDate: new Date(assignment.dueDate),
        maxMarks: assignment.maxMarks,
      });
    } else {
      resetForm();
    }
    setAssignmentDialog({ open: true, assignment, mode });
  };

  const openSubmissionsDialog = async (assignment: Assignment) => {
    setSubmissionsDialog({ open: true, assignment });
    await loadSubmissions(assignment.id);
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'published':
        return 'success';
      case 'closed':
        return 'error';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && assignments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Assignment Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openAssignmentDialog(null, 'create')}
          >
            Create Assignment
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={selectedCourse}
                    label="Course"
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <MenuItem value="all">All Courses</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Assignments ({assignments.length})
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submissions</TableCell>
                    <TableCell>Max Marks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => {
                    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                    
                    return (
                      <TableRow key={assignment.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {assignment.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {assignment.description.substring(0, 100)}...
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {assignment.courseCode}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {assignment.courseName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: daysUntilDue < 0 ? 'error.main' : 
                                     daysUntilDue <= 3 ? 'warning.main' : 'text.primary'
                            }}
                          >
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </Typography>
                          {daysUntilDue >= 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {daysUntilDue} days left
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={assignment.status.toUpperCase()}
                            color={getStatusColor(assignment.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => openSubmissionsDialog(assignment)}
                          >
                            {assignment.submissionsCount}/{assignment.totalStudents}
                          </Button>
                        </TableCell>
                        <TableCell>{assignment.maxMarks}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedAssignment(assignment);
                            }}
                          >
                            <MoreIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            if (selectedAssignment) openAssignmentDialog(selectedAssignment, 'edit');
            setAnchorEl(null);
          }}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedAssignment) openSubmissionsDialog(selectedAssignment);
            setAnchorEl(null);
          }}>
            <ViewIcon sx={{ mr: 1 }} />
            View Submissions
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            if (selectedAssignment) handleDeleteAssignment(selectedAssignment.id);
            setAnchorEl(null);
          }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Assignment Dialog */}
        <Dialog
          open={assignmentDialog.open}
          onClose={() => setAssignmentDialog({ open: false, assignment: null, mode: 'create' })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {assignmentDialog.mode === 'create' ? 'Create Assignment' : 'Edit Assignment'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={formData.courseId}
                    label="Course"
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Marks"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(date) => date && setFormData({ ...formData, dueDate: date })}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignmentDialog({ open: false, assignment: null, mode: 'create' })}>
              Cancel
            </Button>
            <Button
              onClick={assignmentDialog.mode === 'create' ? handleCreateAssignment : handleUpdateAssignment}
              variant="contained"
              disabled={!formData.title || !formData.courseId}
            >
              {assignmentDialog.mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submissions Dialog */}
        <Dialog
          open={submissionsDialog.open}
          onClose={() => setSubmissionsDialog({ open: false, assignment: null })}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Submissions for: {submissionsDialog.assignment?.title}
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.studentName}</TableCell>
                      <TableCell>
                        {new Date(submission.submissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status.toUpperCase()}
                          color={submission.status === 'graded' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {submission.obtainedMarks !== undefined 
                          ? `${submission.obtainedMarks}/${submissionsDialog.assignment?.maxMarks}`
                          : 'Not graded'
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<GradeIcon />}
                          onClick={() => setGradingDialog({
                            open: true,
                            submission,
                            marks: submission.obtainedMarks?.toString() || '',
                            feedback: submission.feedback || '',
                          })}
                        >
                          Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmissionsDialog({ open: false, assignment: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Grading Dialog */}
        <Dialog
          open={gradingDialog.open}
          onClose={() => setGradingDialog({ open: false, submission: null, marks: '', feedback: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Grade Submission - {gradingDialog.submission?.studentName}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Marks Obtained"
                  value={gradingDialog.marks}
                  onChange={(e) => setGradingDialog({ ...gradingDialog, marks: e.target.value })}
                  helperText={`Max marks: ${submissionsDialog.assignment?.maxMarks}`}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Feedback"
                  value={gradingDialog.feedback}
                  onChange={(e) => setGradingDialog({ ...gradingDialog, feedback: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGradingDialog({ open: false, submission: null, marks: '', feedback: '' })}>
              Cancel
            </Button>
            <Button
              onClick={handleGradeSubmission}
              variant="contained"
              disabled={!gradingDialog.marks}
            >
              Save Grade
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default FacultyAssignments;
