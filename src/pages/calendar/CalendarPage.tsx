// =====================================================
// Calendar Page Component
// Academic calendar and event scheduling interface
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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TodayIcon from '@mui/icons-material/Today';
import PrevIcon from '@mui/icons-material/NavigateBefore';
import NextIcon from '@mui/icons-material/NavigateNext';
import MonthViewIcon from '@mui/icons-material/ViewModule';
import WeekViewIcon from '@mui/icons-material/ViewWeek';
import DayViewIcon from '@mui/icons-material/ViewDay';
import ExportIcon from '@mui/icons-material/Download';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ApproveIcon from '@mui/icons-material/CheckCircle';
import RejectIcon from '@mui/icons-material/Cancel';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'exam' | 'holiday' | 'meeting' | 'deadline' | 'activity' | 'maintenance' | 'other';
  category: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  organizer: string;
  attendees: string[];
  status: 'draft' | 'confirmed' | 'cancelled' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  resource?: any;
}

interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  eventTitle: string;
  startDateTime: Date;
  endDateTime: Date;
  bookedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
  attendeeCount: number;
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

const CalendarPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState<Partial<CalendarEvent>>({});
  const [bookingFormData, setBookingFormData] = useState<Partial<RoomBooking>>({});

  // Mock data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'New Student Orientation',
      description: 'Welcome week for new students',
      type: 'academic',
      category: 'Orientation',
      start: new Date(2024, 8, 1, 9, 0),
      end: new Date(2024, 8, 1, 17, 0),
      allDay: false,
      location: 'Main Auditorium',
      organizer: 'admin',
      attendees: [],
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Course Registration Deadline',
      description: 'Last day for course registration',
      type: 'deadline',
      category: 'Registration',
      start: new Date(2024, 8, 10),
      end: new Date(2024, 8, 10),
      allDay: true,
      organizer: 'registrar',
      attendees: [],
      status: 'confirmed',
      priority: 'urgent'
    },
    {
      id: '3',
      title: 'Faculty Meeting',
      description: 'Monthly faculty meeting',
      type: 'meeting',
      category: 'Faculty',
      start: new Date(2024, 8, 15, 14, 0),
      end: new Date(2024, 8, 15, 16, 0),
      allDay: false,
      location: 'Conference Room A',
      organizer: 'dean',
      attendees: ['faculty'],
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Thanksgiving Break',
      description: 'University closed for Thanksgiving',
      type: 'holiday',
      category: 'Holiday',
      start: new Date(2024, 10, 25),
      end: new Date(2024, 10, 29),
      allDay: true,
      organizer: 'system',
      attendees: [],
      status: 'confirmed',
      priority: 'low'
    }
  ];

  const mockBookings: RoomBooking[] = [
    {
      id: '1',
      roomId: 'room_101',
      roomName: 'Room 101',
      eventTitle: 'Computer Science Lecture',
      startDateTime: new Date(2024, 8, 5, 10, 0),
      endDateTime: new Date(2024, 8, 5, 11, 30),
      bookedBy: 'prof_smith',
      status: 'approved',
      purpose: 'Lecture',
      attendeeCount: 30
    },
    {
      id: '2',
      roomId: 'lab_a',
      roomName: 'Computer Lab A',
      eventTitle: 'Programming Workshop',
      startDateTime: new Date(2024, 8, 6, 14, 0),
      endDateTime: new Date(2024, 8, 6, 17, 0),
      bookedBy: 'prof_jones',
      status: 'pending',
      purpose: 'Workshop',
      attendeeCount: 25
    }
  ];

  const rooms = [
    { id: 'room_101', name: 'Room 101', capacity: 30, type: 'Classroom' },
    { id: 'room_102', name: 'Room 102', capacity: 25, type: 'Classroom' },
    { id: 'lab_a', name: 'Computer Lab A', capacity: 20, type: 'Laboratory' },
    { id: 'lab_b', name: 'Computer Lab B', capacity: 20, type: 'Laboratory' },
    { id: 'auditorium', name: 'Main Auditorium', capacity: 200, type: 'Auditorium' },
    { id: 'conf_a', name: 'Conference Room A', capacity: 15, type: 'Conference Room' }
  ];

  useEffect(() => {
    setEvents(mockEvents);
    setBookings(mockBookings);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventFormData(event);
    setEventDialogOpen(true);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setEventFormData({
      start,
      end,
      allDay: false,
      type: 'other',
      status: 'draft',
      priority: 'medium',
      organizer: 'current_user',
      attendees: []
    });
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...selectedEvent, ...eventFormData } : event
      ));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: `event_${Date.now()}`,
        title: eventFormData.title || 'New Event',
        description: eventFormData.description || '',
        type: eventFormData.type || 'other',
        category: eventFormData.category || 'General',
        start: eventFormData.start || new Date(),
        end: eventFormData.end || new Date(),
        allDay: eventFormData.allDay || false,
        location: eventFormData.location,
        organizer: eventFormData.organizer || 'current_user',
        attendees: eventFormData.attendees || [],
        status: eventFormData.status || 'draft',
        priority: eventFormData.priority || 'medium'
      };
      setEvents([...events, newEvent]);
    }
    setEventDialogOpen(false);
    setEventFormData({});
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setEventDialogOpen(false);
  };

  const handleApproveBooking = (bookingId: string) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'approved' as const } : booking
    ));
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'rejected' as const } : booking
    ));
  };

  const getEventColor = (event: CalendarEvent) => {
    const colors = {
      academic: '#1976d2',
      exam: '#d32f2f',
      holiday: '#388e3c',
      meeting: '#f57c00',
      deadline: '#e64a19',
      activity: '#7b1fa2',
      maintenance: '#616161',
      other: '#455a64'
    };
    return colors[event.type] || colors.other;
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = getEventColor(event);
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  const renderCalendarView = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => handleNavigate(moment(date).subtract(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate())}>
            <PrevIcon />
          </IconButton>
          <Typography variant="h5" sx={{ minWidth: 200, textAlign: 'center' }}>
            {moment(date).format(view === 'month' ? 'MMMM YYYY' : view === 'week' ? 'MMM DD, YYYY' : 'dddd, MMM DD, YYYY')}
          </Typography>
          <IconButton onClick={() => handleNavigate(moment(date).add(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate())}>
            <NextIcon />
          </IconButton>
          <Button onClick={() => setDate(new Date())} startIcon={<TodayIcon />}>
            Today
          </Button>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Month View">
            <IconButton 
              color={view === 'month' ? 'primary' : 'default'}
              onClick={() => handleViewChange('month')}
            >
              <MonthViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Week View">
            <IconButton 
              color={view === 'week' ? 'primary' : 'default'}
              onClick={() => handleViewChange('week')}
            >
              <WeekViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Day View">
            <IconButton 
              color={view === 'day' ? 'primary' : 'default'}
              onClick={() => handleViewChange('day')}
            >
              <DayViewIcon />
            </IconButton>
          </Tooltip>
          <Button startIcon={<ExportIcon />} variant="outlined">
            Export
          </Button>
        </Box>
      </Box>

      <Paper sx={{ height: 600, p: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }}
        />
      </Paper>

      <Fab
        color="primary"
        aria-label="add event"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          setSelectedEvent(null);
          setEventFormData({
            start: new Date(),
            end: moment().add(1, 'hour').toDate(),
            allDay: false,
            type: 'other',
            status: 'draft',
            priority: 'medium',
            organizer: 'current_user',
            attendees: []
          });
          setEventDialogOpen(true);
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );

  const renderRoomBookings = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Room Bookings</Typography>
        <Button
          variant="contained"
          startIcon={<RoomIcon />}
          onClick={() => setBookingDialogOpen(true)}
        >
          Book Room
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Approvals
              </Typography>
              <List>
                {bookings.filter(booking => booking.status === 'pending').map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemText
                      primary={`${booking.eventTitle} - ${booking.roomName}`}
                      secondary={`${moment(booking.startDateTime).format('MMM DD, YYYY HH:mm')} - ${moment(booking.endDateTime).format('HH:mm')} | ${booking.attendeeCount} attendees`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        color="success" 
                        onClick={() => handleApproveBooking(booking.id)}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRejectBooking(booking.id)}
                      >
                        <RejectIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {bookings.filter(booking => booking.status === 'pending').length === 0 && (
                  <ListItem>
                    <ListItemText primary="No pending bookings" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Availability
              </Typography>
              <List dense>
                {rooms.map((room) => {
                  const roomBookings = bookings.filter(b => b.roomId === room.id && b.status === 'approved');
                  const isAvailable = roomBookings.length === 0;
                  
                  return (
                    <ListItem key={room.id}>
                      <Avatar sx={{ mr: 2, bgcolor: isAvailable ? 'success.main' : 'warning.main' }}>
                        <RoomIcon />
                      </Avatar>
                      <ListItemText
                        primary={room.name}
                        secondary={`${room.type} • Capacity: ${room.capacity}`}
                      />
                      <Chip
                        label={isAvailable ? 'Available' : 'Booked'}
                        color={isAvailable ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              All Bookings
            </Typography>
            <List>
              {bookings.map((booking) => (
                <ListItem key={booking.id} divider>
                  <ListItemText
                    primary={`${booking.eventTitle} - ${booking.roomName}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {moment(booking.startDateTime).format('MMM DD, YYYY HH:mm')} - {moment(booking.endDateTime).format('HH:mm')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Booked by: {booking.bookedBy} | Purpose: {booking.purpose}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={booking.status}
                      color={
                        booking.status === 'approved' ? 'success' : 
                        booking.status === 'rejected' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  const renderAcademicCalendar = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Academic Calendar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Academic Year 2024-2025
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Fall Semester"
                    secondary="September 1, 2024 - December 15, 2024"
                  />
                  <Chip label="Active" color="success" size="small" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Spring Semester"
                    secondary="January 15, 2025 - May 15, 2025"
                  />
                  <Chip label="Upcoming" color="info" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Important Dates
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Course Registration"
                    secondary="August 15 - September 10, 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Classes Begin"
                    secondary="September 15, 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Midterm Exams"
                    secondary="October 15-22, 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Final Exams"
                    secondary="December 11-15, 2024"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Holidays & Breaks
              </Typography>
              <Grid container spacing={2}>
                {mockEvents.filter(event => event.type === 'holiday').map((holiday) => (
                  <Grid item xs={12} md={4} key={holiday.id}>
                    <Alert severity="info">
                      <Typography variant="subtitle2">{holiday.title}</Typography>
                      <Typography variant="body2">
                        {moment(holiday.start).format('MMM DD')} - {moment(holiday.end).format('MMM DD, YYYY')}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Academic Calendar
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Calendar" icon={<EventIcon />} />
            <Tab label="Room Bookings" icon={<RoomIcon />} />
            <Tab label="Academic Year" icon={<ScheduleIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderCalendarView()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderRoomBookings()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderAcademicCalendar()}
        </TabPanel>

        {/* Event Dialog */}
        <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={eventFormData.title || ''}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={eventFormData.description || ''}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={eventFormData.type || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value as any })}
                    label="Type"
                  >
                    <MenuItem value="academic">Academic</MenuItem>
                    <MenuItem value="exam">Exam</MenuItem>
                    <MenuItem value="holiday">Holiday</MenuItem>
                    <MenuItem value="meeting">Meeting</MenuItem>
                    <MenuItem value="deadline">Deadline</MenuItem>
                    <MenuItem value="activity">Activity</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={eventFormData.priority || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, priority: e.target.value as any })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={eventFormData.start}
                  onChange={(date) => setEventFormData({ ...eventFormData, start: date || undefined })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={eventFormData.end}
                  onChange={(date) => setEventFormData({ ...eventFormData, end: date || undefined })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={eventFormData.location || ''}
                  onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            {selectedEvent && (
              <Button onClick={() => handleDeleteEvent(selectedEvent.id)} color="error">
                Delete
              </Button>
            )}
            <Button onClick={handleSaveEvent} variant="contained">
              {selectedEvent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Room Booking Dialog */}
        <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Book Room</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={bookingFormData.eventTitle || ''}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, eventTitle: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={bookingFormData.roomId || ''}
                    onChange={(e) => setBookingFormData({ 
                      ...bookingFormData, 
                      roomId: e.target.value,
                      roomName: rooms.find(r => r.id === e.target.value)?.name || ''
                    })}
                    label="Room"
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.name} ({room.type} - {room.capacity} capacity)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expected Attendees"
                  type="number"
                  value={bookingFormData.attendeeCount || ''}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, attendeeCount: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date & Time"
                  value={bookingFormData.startDateTime}
                  onChange={(date) => setBookingFormData({ ...bookingFormData, startDateTime: date || undefined })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date & Time"
                  value={bookingFormData.endDateTime}
                  onChange={(date) => setBookingFormData({ ...bookingFormData, endDateTime: date || undefined })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  value={bookingFormData.purpose || ''}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, purpose: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                const newBooking: RoomBooking = {
                  id: `booking_${Date.now()}`,
                  roomId: bookingFormData.roomId || '',
                  roomName: bookingFormData.roomName || '',
                  eventTitle: bookingFormData.eventTitle || '',
                  startDateTime: bookingFormData.startDateTime || new Date(),
                  endDateTime: bookingFormData.endDateTime || new Date(),
                  bookedBy: 'current_user',
                  status: 'pending',
                  purpose: bookingFormData.purpose || '',
                  attendeeCount: bookingFormData.attendeeCount || 0
                };
                setBookings([...bookings, newBooking]);
                setBookingDialogOpen(false);
                setBookingFormData({});
              }} 
              variant="contained"
            >
              Book Room
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CalendarPage;
