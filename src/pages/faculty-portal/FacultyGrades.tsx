// =====================================================
// OpenEducat ERP Frontend - Faculty Grade Management
// Faculty tools for managing student grades and assessments
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
  IconButton,
  Tooltip,
} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ExamIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../contexts/AuthContext';
import { facultyApi } from '../../services/api';

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Grade {
  id: string;
  studentId: string;
  examId: string;
  examType: string;
  examName: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  points: number;
  remarks?: string;
  isPublished: boolean;
}

interface Course {
  id: string;
  code: string;
  name: string;
  students: Student[];
}

interface Exam {
  id: string;
  name: string;
  code: string;
  type: string;
  totalMarks: number;
  date: string;
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
      id={`grades-tabpanel-${index}`}
      aria-labelledby={`grades-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const FacultyGrades: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [bulkGradeDialog, setBulkGradeDialog] = useState(false);
  const [publishDialog, setPublishDialog] = useState(false);

  // Grade entry state
  const [gradeEntries, setGradeEntries] = useState<{
    [studentId: string]: {
      obtainedMarks: string;
      remarks: string;
    };
  }>({});

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadExams();
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse && selectedExam) {
      loadGrades();
    }
  }, [selectedCourse, selectedExam]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getFacultyCourses(user?.id?.toString() || '');
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].id);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    try {
      const response = await facultyApi.getCourseExams(selectedCourse);
      setExams(response.data);
      if (response.data.length > 0) {
        setSelectedExam(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load exams');
      console.error('Error loading exams:', err);
    }
  };

  const loadGrades = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getExamGrades(selectedExam);
      setGrades(response.data);
      
      // Initialize grade entries
      const selectedCourseData = courses.find(c => c.id === selectedCourse);
      if (selectedCourseData) {
        const entries: typeof gradeEntries = {};
        selectedCourseData.students.forEach(student => {
          const existingGrade = response.data.find((g: Grade) => g.studentId === student.id);
          entries[student.id] = {
            obtainedMarks: existingGrade ? existingGrade.obtainedMarks.toString() : '',
            remarks: existingGrade ? existingGrade.remarks || '' : '',
          };
        });
        setGradeEntries(entries);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load grades');
      console.error('Error loading grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (obtainedMarks: number, totalMarks: number) => {
    const percentage = (obtainedMarks / totalMarks) * 100;
    
    if (percentage >= 90) return { grade: 'A+', points: 4.0 };
    if (percentage >= 85) return { grade: 'A', points: 3.7 };
    if (percentage >= 80) return { grade: 'B+', points: 3.3 };
    if (percentage >= 75) return { grade: 'B', points: 3.0 };
    if (percentage >= 70) return { grade: 'C+', points: 2.7 };
    if (percentage >= 65) return { grade: 'C', points: 2.3 };
    if (percentage >= 60) return { grade: 'D+', points: 2.0 };
    if (percentage >= 55) return { grade: 'D', points: 1.7 };
    return { grade: 'F', points: 0.0 };
  };

  const handleGradeChange = (studentId: string, field: 'obtainedMarks' | 'remarks', value: string) => {
    setGradeEntries(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const saveGrades = async () => {
    try {
      setLoading(true);
      const selectedExamData = exams.find(e => e.id === selectedExam);
      if (!selectedExamData) return;

      const gradesToSave = Object.entries(gradeEntries)
        .filter(([_, entry]) => entry.obtainedMarks.trim() !== '')
        .map(([studentId, entry]) => {
          const obtainedMarks = parseInt(entry.obtainedMarks);
          const percentage = (obtainedMarks / selectedExamData.totalMarks) * 100;
          const { grade, points } = calculateGrade(obtainedMarks, selectedExamData.totalMarks);

          return {
            studentId,
            examId: selectedExam,
            obtainedMarks,
            totalMarks: selectedExamData.totalMarks,
            percentage,
            grade,
            points,
            remarks: entry.remarks,
          };
        });

      await facultyApi.saveGrades(selectedExam, gradesToSave);
      
      // Reload grades
      loadGrades();
      
      alert('Grades saved successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to save grades');
      console.error('Error saving grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const publishGrades = async () => {
    try {
      setLoading(true);
      await facultyApi.publishGrades(selectedExam);
      
      // Reload grades
      loadGrades();
      
      alert('Grades published successfully!');
      setPublishDialog(false);
      setError(null);
    } catch (err) {
      setError('Failed to publish grades');
      console.error('Error publishing grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B+':
      case 'B':
        return 'info';
      case 'C+':
      case 'C':
        return 'warning';
      default:
        return 'error';
    }
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedExamData = exams.find(e => e.id === selectedExam);
  const publishedGrades = grades.filter(g => g.isPublished);
  const unpublishedGrades = grades.filter(g => !g.isPublished);

  if (loading && courses.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grade Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Selection Controls */}
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
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Exam/Assessment</InputLabel>
                <Select
                  value={selectedExam}
                  label="Exam/Assessment"
                  onChange={(e) => setSelectedExam(e.target.value)}
                >
                  {exams.map((exam) => (
                    <MenuItem key={exam.id} value={exam.id}>
                      {exam.name} ({exam.type || "midterm"})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveGrades}
                  disabled={loading || !selectedCourse || !selectedExam}
                >
                  Save Grades
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => setPublishDialog(true)}
                  disabled={loading || unpublishedGrades.length === 0}
                >
                  Publish
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Grade Entry Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Enter Grades" />
          <Tab label="Grade Summary" />
          <Tab label="Statistics" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {selectedCourseData && selectedExamData && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedExamData.name} - {selectedExamData.type}
                </Typography>
                <Typography variant="body2">
                  Total Marks: {selectedExamData.totalMarks} | 
                  Date: {new Date(selectedExamData.date).toLocaleDateString()} |
                  Students: {selectedCourseData.students.length}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Obtained Marks</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCourseData.students.map((student) => {
                      const entry = gradeEntries[student.id] || { obtainedMarks: '', remarks: '' };
                      const obtainedMarks = parseInt(entry.obtainedMarks) || 0;
                      const percentage = entry.obtainedMarks ? (obtainedMarks / selectedExamData.totalMarks) * 100 : 0;
                      const { grade } = entry.obtainedMarks ? calculateGrade(obtainedMarks, selectedExamData.totalMarks) : { grade: '-' };
                      const existingGrade = grades.find(g => g.studentId === student.id);
                      
                      return (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={entry.obtainedMarks}
                              onChange={(e) => handleGradeChange(student.id, 'obtainedMarks', e.target.value)}
                              inputProps={{ min: 0, max: selectedExamData.totalMarks }}
                              sx={{ width: 100 }}
                            />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              / {selectedExamData.totalMarks}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {entry.obtainedMarks ? `${percentage.toFixed(1)}%` : '-'}
                          </TableCell>
                          <TableCell>
                            {entry.obtainedMarks ? (
                              <Chip
                                label={grade}
                                color={getGradeColor(grade) as any}
                                size="small"
                              />
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="Add remarks..."
                              value={entry.remarks}
                              onChange={(e) => handleGradeChange(student.id, 'remarks', e.target.value)}
                              sx={{ minWidth: 200 }}
                            />
                          </TableCell>
                          <TableCell>
                            {existingGrade ? (
                              <Chip
                                label={existingGrade.isPublished ? 'Published' : 'Saved'}
                                color={existingGrade.isPublished ? 'success' : 'warning'}
                                size="small"
                              />
                            ) : (
                              <Chip label="Not Saved" color="default" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grade Summary
            </Typography>
            
            {grades.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Marks</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grades.map((grade) => {
                      const student = selectedCourseData?.students.find(s => s.id === grade.studentId);
                      
                      return (
                        <TableRow key={grade.id}>
                          <TableCell>{student?.name}</TableCell>
                          <TableCell>{grade.obtainedMarks}/{grade.totalMarks}</TableCell>
                          <TableCell>{grade.percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Chip
                              label={grade.grade}
                              color={getGradeColor(grade.grade) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{grade.points}</TableCell>
                          <TableCell>
                            <Chip
                              label={grade.isPublished ? 'Published' : 'Draft'}
                              color={grade.isPublished ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No grades available for the selected exam.
              </Alert>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grade Statistics
            </Typography>
            
            {grades.length > 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {grades.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Graded
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {Math.max(...grades.map(g => g.percentage)).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Highest Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {Math.min(...grades.map(g => g.percentage)).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lowest Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="info">
                No statistics available for the selected exam.
              </Alert>
            )}
          </Box>
        </TabPanel>
      </Card>

      {/* Publish Dialog */}
      <Dialog
        open={publishDialog}
        onClose={() => setPublishDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Publish Grades</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to publish grades for {selectedExamData?.name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Once published, students will be able to see their grades. You have {unpublishedGrades.length} unpublished grades.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)}>
            Cancel
          </Button>
          <Button onClick={publishGrades} variant="contained" color="primary">
            Publish Grades
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyGrades;
