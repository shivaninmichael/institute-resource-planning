// =====================================================
// Assignment View Dialog Component
// Dialog for viewing assignment details
// =====================================================

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScoreIcon from '@mui/icons-material/Score';
import TimerIcon from '@mui/icons-material/Timer';
import DescriptionIcon from '@mui/icons-material/Description';

interface AssignmentViewDialogProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
}

const AssignmentViewDialog: React.FC<AssignmentViewDialogProps> = ({
  open,
  onClose,
  assignment,
}) => {
  if (!assignment) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const calculateSubmissionProgress = () => {
    if (!assignment.submissions || !assignment.totalStudents) return 0;
    return (assignment.submissions.length / assignment.totalStudents) * 100;
  };

  const calculateGradingProgress = () => {
    if (!assignment.submissions || assignment.submissions.length === 0) return 0;
    const gradedSubmissions = assignment.submissions.filter((s: any) => s.graded).length;
    return (gradedSubmissions / assignment.submissions.length) * 100;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Assignment Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5" component="h2">
                {assignment.title}
              </Typography>
              <Chip
                label={assignment.status}
                color={getStatusColor(assignment.status)}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" paragraph>
              {assignment.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Due Date"
                  secondary={formatDate(assignment.dueDate)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Course"
                  secondary={assignment.course}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Faculty"
                  secondary={assignment.faculty}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ScoreIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Maximum Score"
                  secondary={assignment.maxScore}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Weight"
                  secondary={`${(assignment.weight * 100).toFixed(0)}%`}
                />
              </ListItem>
              {assignment.allowLateSubmission && (
                <ListItem>
                  <ListItemIcon>
                    <TimerIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Late Submission"
                    secondary={`Allowed (${assignment.latePenalty}% penalty per day, max ${assignment.maxDaysLate} days)`}
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <Typography color="text.secondary" paragraph>
              {assignment.instructions}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Submission Progress
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flexGrow={1}>
                    <LinearProgress
                      variant="determinate"
                      value={calculateSubmissionProgress()}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {assignment.submissions?.length || 0} / {assignment.totalStudents} submitted
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Grading Progress
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flexGrow={1}>
                    <LinearProgress
                      variant="determinate"
                      value={calculateGradingProgress()}
                      sx={{ height: 8, borderRadius: 4 }}
                      color="secondary"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {assignment.submissions?.filter((s: any) => s.graded).length || 0} / {assignment.submissions?.length || 0} graded
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentViewDialog;
