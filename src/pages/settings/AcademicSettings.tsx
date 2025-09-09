// =====================================================
// Academic Settings Component
// Academic-related system configuration
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stack,
  Slider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

interface AcademicSettingsProps {
  onSave?: (settings: any) => Promise<void>;
}

const AcademicSettings: React.FC<AcademicSettingsProps> = ({
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [settings, setSettings] = useState({
    // Academic Calendar
    academicYearStart: 'September',
    academicYearEnd: 'June',
    semestersPerYear: 2,
    weeksPerSemester: 16,
    holidayCalendarEnabled: true,

    // Grading System
    gradingSystem: 'letter',
    passingGrade: 'D',
    passingPercentage: 60,
    gpaScale: '4.0',
    includeAttendanceInGrade: true,
    attendanceWeight: 10,

    // Attendance
    minimumAttendance: 75,
    attendanceWarningThreshold: 80,
    autoMarkAbsent: true,
    allowLateAttendance: true,
    lateAttendanceGracePeriod: 15,
    attendanceReportFrequency: 'weekly',

    // Examination
    examPassingMarks: 40,
    examGraceMarks: 5,
    allowReexamination: true,
    maxReexaminationAttempts: 2,
    examResultPublishDelay: 7,
    autoPublishResults: false,

    // Assignments
    assignmentSubmissionFormat: 'pdf',
    allowLateSubmission: true,
    latePenaltyPerDay: 10,
    maxLateDays: 7,
    plagiarismCheckEnabled: true,
    plagiarismThreshold: 30,

    // Course Management
    maxCoursesPerStudent: 6,
    maxStudentsPerCourse: 50,
    prerequisitesEnabled: true,
    creditSystem: true,
    minCreditsPerSemester: 15,
    maxCreditsPerSemester: 21,
  });

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | any
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked
      : event.target.value;
      
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      if (onSave) {
        await onSave(settings);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* Academic Calendar */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Academic Calendar
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Academic Year Start</InputLabel>
                  <Select
                    value={settings.academicYearStart}
                    label="Academic Year Start"
                    onChange={handleChange('academicYearStart')}
                  >
                    {['January', 'June', 'July', 'August', 'September'].map(month => (
                      <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Academic Year End</InputLabel>
                  <Select
                    value={settings.academicYearEnd}
                    label="Academic Year End"
                    onChange={handleChange('academicYearEnd')}
                  >
                    {['May', 'June', 'July', 'December'].map(month => (
                      <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Semesters Per Year</InputLabel>
                  <Select
                    value={settings.semestersPerYear}
                    label="Semesters Per Year"
                    onChange={handleChange('semestersPerYear')}
                  >
                    {[1, 2, 3, 4].map(num => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Weeks Per Semester"
                  value={settings.weeksPerSemester}
                  onChange={handleChange('weeksPerSemester')}
                  InputProps={{ inputProps: { min: 12, max: 20 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.holidayCalendarEnabled}
                      onChange={handleChange('holidayCalendarEnabled')}
                    />
                  }
                  label="Enable Holiday Calendar"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Grading System */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Grading System
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Grading System</InputLabel>
                  <Select
                    value={settings.gradingSystem}
                    label="Grading System"
                    onChange={handleChange('gradingSystem')}
                  >
                    <MenuItem value="letter">Letter Grade (A, B, C)</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="gpa">GPA</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Passing Grade</InputLabel>
                  <Select
                    value={settings.passingGrade}
                    label="Passing Grade"
                    onChange={handleChange('passingGrade')}
                  >
                    {['A', 'B', 'C', 'D'].map(grade => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Passing Percentage"
                  value={settings.passingPercentage}
                  onChange={handleChange('passingPercentage')}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>GPA Scale</InputLabel>
                  <Select
                    value={settings.gpaScale}
                    label="GPA Scale"
                    onChange={handleChange('gpaScale')}
                  >
                    <MenuItem value="4.0">4.0</MenuItem>
                    <MenuItem value="5.0">5.0</MenuItem>
                    <MenuItem value="10.0">10.0</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeAttendanceInGrade}
                      onChange={handleChange('includeAttendanceInGrade')}
                    />
                  }
                  label="Include Attendance in Grade"
                />
              </Grid>
              {settings.includeAttendanceInGrade && (
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Attendance Weight: {settings.attendanceWeight}%
                  </Typography>
                  <Slider
                    value={settings.attendanceWeight}
                    onChange={(e, value) => handleChange('attendanceWeight')({ target: { value } })}
                    min={5}
                    max={20}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Attendance Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Attendance (%)"
                  value={settings.minimumAttendance}
                  onChange={handleChange('minimumAttendance')}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Warning Threshold (%)"
                  value={settings.attendanceWarningThreshold}
                  onChange={handleChange('attendanceWarningThreshold')}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoMarkAbsent}
                      onChange={handleChange('autoMarkAbsent')}
                    />
                  }
                  label="Auto Mark Absent"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowLateAttendance}
                      onChange={handleChange('allowLateAttendance')}
                    />
                  }
                  label="Allow Late Attendance"
                />
              </Grid>
              {settings.allowLateAttendance && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Grace Period (minutes)"
                    value={settings.lateAttendanceGracePeriod}
                    onChange={handleChange('lateAttendanceGracePeriod')}
                    InputProps={{ inputProps: { min: 5, max: 30 } }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Frequency</InputLabel>
                  <Select
                    value={settings.attendanceReportFrequency}
                    label="Report Frequency"
                    onChange={handleChange('attendanceReportFrequency')}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Examination Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Examination Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Passing Marks"
                  value={settings.examPassingMarks}
                  onChange={handleChange('examPassingMarks')}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Grace Marks"
                  value={settings.examGraceMarks}
                  onChange={handleChange('examGraceMarks')}
                  InputProps={{ inputProps: { min: 0, max: 10 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowReexamination}
                      onChange={handleChange('allowReexamination')}
                    />
                  }
                  label="Allow Re-examination"
                />
              </Grid>
              {settings.allowReexamination && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Re-examination Attempts"
                    value={settings.maxReexaminationAttempts}
                    onChange={handleChange('maxReexaminationAttempts')}
                    InputProps={{ inputProps: { min: 1, max: 3 } }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Result Publish Delay (days)"
                  value={settings.examResultPublishDelay}
                  onChange={handleChange('examResultPublishDelay')}
                  InputProps={{ inputProps: { min: 1, max: 30 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoPublishResults}
                      onChange={handleChange('autoPublishResults')}
                    />
                  }
                  label="Auto Publish Results"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Assignment Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assignment Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Submission Format</InputLabel>
                  <Select
                    value={settings.assignmentSubmissionFormat}
                    label="Submission Format"
                    onChange={handleChange('assignmentSubmissionFormat')}
                  >
                    <MenuItem value="pdf">PDF Only</MenuItem>
                    <MenuItem value="doc">DOC/DOCX</MenuItem>
                    <MenuItem value="any">Any Format</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowLateSubmission}
                      onChange={handleChange('allowLateSubmission')}
                    />
                  }
                  label="Allow Late Submission"
                />
              </Grid>
              {settings.allowLateSubmission && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Late Penalty (%/day)"
                      value={settings.latePenaltyPerDay}
                      onChange={handleChange('latePenaltyPerDay')}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Max Late Days"
                      value={settings.maxLateDays}
                      onChange={handleChange('maxLateDays')}
                      InputProps={{ inputProps: { min: 1, max: 30 } }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.plagiarismCheckEnabled}
                      onChange={handleChange('plagiarismCheckEnabled')}
                    />
                  }
                  label="Enable Plagiarism Check"
                />
              </Grid>
              {settings.plagiarismCheckEnabled && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Plagiarism Threshold (%)"
                    value={settings.plagiarismThreshold}
                    onChange={handleChange('plagiarismThreshold')}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Course Management */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Course Management
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Courses Per Student"
                  value={settings.maxCoursesPerStudent}
                  onChange={handleChange('maxCoursesPerStudent')}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Students Per Course"
                  value={settings.maxStudentsPerCourse}
                  onChange={handleChange('maxStudentsPerCourse')}
                  InputProps={{ inputProps: { min: 1, max: 200 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.prerequisitesEnabled}
                      onChange={handleChange('prerequisitesEnabled')}
                    />
                  }
                  label="Enable Prerequisites"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.creditSystem}
                      onChange={handleChange('creditSystem')}
                    />
                  }
                  label="Enable Credit System"
                />
              </Grid>
              {settings.creditSystem && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Min Credits Per Semester"
                      value={settings.minCreditsPerSemester}
                      onChange={handleChange('minCreditsPerSemester')}
                      InputProps={{ inputProps: { min: 1, max: 30 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Max Credits Per Semester"
                      value={settings.maxCreditsPerSemester}
                      onChange={handleChange('maxCreditsPerSemester')}
                      InputProps={{ inputProps: { min: 1, max: 30 } }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => setSettings({
              academicYearStart: 'September',
              academicYearEnd: 'June',
              semestersPerYear: 2,
              weeksPerSemester: 16,
              holidayCalendarEnabled: true,
              gradingSystem: 'letter',
              passingGrade: 'D',
              passingPercentage: 60,
              gpaScale: '4.0',
              includeAttendanceInGrade: true,
              attendanceWeight: 10,
              minimumAttendance: 75,
              attendanceWarningThreshold: 80,
              autoMarkAbsent: true,
              allowLateAttendance: true,
              lateAttendanceGracePeriod: 15,
              attendanceReportFrequency: 'weekly',
              examPassingMarks: 40,
              examGraceMarks: 5,
              allowReexamination: true,
              maxReexaminationAttempts: 2,
              examResultPublishDelay: 7,
              autoPublishResults: false,
              assignmentSubmissionFormat: 'pdf',
              allowLateSubmission: true,
              latePenaltyPerDay: 10,
              maxLateDays: 7,
              plagiarismCheckEnabled: true,
              plagiarismThreshold: 30,
              maxCoursesPerStudent: 6,
              maxStudentsPerCourse: 50,
              prerequisitesEnabled: true,
              creditSystem: true,
              minCreditsPerSemester: 15,
              maxCreditsPerSemester: 21,
            })}
          >
            Reset
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            type="submit"
          >
            Save Changes
          </LoadingButton>
        </Box>

        {/* Status Messages */}
        {success && (
          <Alert severity="success">
            Settings saved successfully
          </Alert>
        )}
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
      </Stack>
    </form>
  );
};

export default AcademicSettings;
