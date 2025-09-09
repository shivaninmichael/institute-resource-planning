// =====================================================
// Timetable View Dialog Component
// Dialog for viewing timetable details
// =====================================================

import React from 'react';
import { Timetable } from '../../types/timetable';
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RoomIcon from '@mui/icons-material/Room';
import BookIcon from '@mui/icons-material/Book';
import WarningIcon from '@mui/icons-material/Warning';

interface TimetableViewDialogProps {
  open: boolean;
  onClose: () => void;
  timetable: Timetable;
}

const TimetableViewDialog: React.FC<TimetableViewDialogProps> = ({
  open,
  onClose,
  timetable,
}) => {
  if (!timetable) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      case 'conflict':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regular':
        return 'primary';
      case 'exam':
        return 'error';
      case 'special':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDayColor = (day: string) => {
    switch (day.toLowerCase()) {
      case 'monday':
        return '#4CAF50';
      case 'tuesday':
        return '#2196F3';
      case 'wednesday':
        return '#9C27B0';
      case 'thursday':
        return '#FF9800';
      case 'friday':
        return '#F44336';
      case 'saturday':
        return '#795548';
      case 'sunday':
        return '#607D8B';
      default:
        return '#000000';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Timetable Details</Typography>
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
                {timetable.name}
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label={timetable.type}
                  color={getTypeColor(timetable.type)}
                  size="small"
                />
                <Chip
                  label={timetable.status}
                  color={getStatusColor(timetable.status)}
                  size="small"
                />
              </Box>
            </Box>
            <Typography color="text.secondary" paragraph>
              {(timetable as any).description || 'No description available'}
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
                  primary="Duration"
                  secondary={`${formatDate(timetable.startDate)} - ${formatDate(timetable.endDate)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Course"
                  secondary={timetable.course?.name || 'N/A'}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Faculty"
                  secondary={`${(timetable.faculty as any)?.first_name || ''} ${(timetable.faculty as any)?.last_name || ''}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RoomIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Primary Classroom"
                  secondary={timetable.classroom?.name || 'N/A'}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Weekly Schedule
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Classroom</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(timetable as any).sessions?.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: getDayColor(session.dayOfWeek),
                            }}
                          />
                          <Typography>
                            {session.dayOfWeek}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <BookIcon fontSize="small" />
                          {session.subject}
                        </Box>
                      </TableCell>
                      <TableCell>{session.faculty}</TableCell>
                      <TableCell>{session.classroom}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {(timetable as any).conflicts && (timetable as any).conflicts.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="error">
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningIcon />
                    Conflicts Detected
                  </Box>
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(timetable as any).conflicts.map((conflict: any) => (
                        <TableRow key={conflict.id}>
                          <TableCell>{conflict.dayOfWeek}</TableCell>
                          <TableCell>
                            {formatTime(conflict.startTime)} - {formatTime(conflict.endTime)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={conflict.type}
                              color="error"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{conflict.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimetableViewDialog;
