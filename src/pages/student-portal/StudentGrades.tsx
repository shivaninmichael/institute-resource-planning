// =====================================================
// OpenEducat ERP Frontend - Student Grades
// Student view of grades and academic performance
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';

interface Grade {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  points: number;
  semester: string;
  examType: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
}

interface GradeData {
  grades: Grade[];
  summary: {
    currentSemesterGPA: number;
    cumulativeGPA: number;
    totalCredits: number;
    completedCredits: number;
    gradeDistribution: {
      [grade: string]: number;
    };
  };
}

const StudentGrades: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [data, setData] = useState<GradeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  useEffect(() => {
    loadGrades();
  }, [selectedSemester]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getExamResults(Number(user?.id) || 0, {
        semester: selectedSemester !== 'all' ? selectedSemester : undefined,
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load grades');
      console.error('Error loading grades:', err);
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

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'success.main';
    if (percentage >= 80) return 'info.main';
    if (percentage >= 70) return 'warning.main';
    return 'error.main';
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

  if (!data) return null;

  const semesters = [...new Set(data.grades.map(g => g.semester))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Academic Performance
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GradeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {data.summary.cumulativeGPA.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cumulative GPA
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {data.summary.currentSemesterGPA.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Semester GPA
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {data.summary.completedCredits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Credits
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(data.summary.completedCredits / data.summary.totalCredits) * 100}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {data.summary.totalCredits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Credits Required
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grade Distribution */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Grade Distribution
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(data.summary.gradeDistribution).map(([grade, count]) => (
              <Grid item key={grade}>
                <Chip
                  label={`${grade}: ${count}`}
                  color={getGradeColor(grade) as any}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Course Grades
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Semester</InputLabel>
              <Select
                value={selectedSemester}
                label="Semester"
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <MenuItem value="all">All Semesters</MenuItem>
                {semesters.map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Exam Type</TableCell>
                  <TableCell>Marks</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Semester</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.grades.map((grade) => (
                  <TableRow key={grade.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {grade.courseCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {grade.courseName}
                      </Typography>
                    </TableCell>
                    <TableCell>{grade.credits}</TableCell>
                    <TableCell>
                      <Chip
                        label={grade.examType}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {grade.obtainedMarks}/{grade.totalMarks}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: getPercentageColor(grade.percentage) }}
                        fontWeight="medium"
                      >
                        {grade.percentage.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={grade.grade}
                        color={getGradeColor(grade.grade) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{grade.points.toFixed(2)}</TableCell>
                    <TableCell>{grade.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentGrades;

