import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

interface AlumniEvent {
  id: number;
  name: string;
  event_type: 'reunion' | 'workshop' | 'seminar' | 'networking' | 'conference' | 'other';
  description?: string;
  start_datetime: string;
  end_datetime: string;
  venue?: string;
  capacity?: number;
  registration_deadline?: string;
  registration_fee?: number;
  organizer_id?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  agenda?: string;
  special_guests?: string[];
  organizer_name?: string;
  organizer_email?: string;
  created_at: string;
  updated_at: string;
}

interface AlumniEventViewDialogProps {
  event: AlumniEvent;
  onClose: () => void;
}

const AlumniEventViewDialog: React.FC<AlumniEventViewDialogProps> = ({ event, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reunion': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'seminar': return 'bg-green-100 text-green-800';
      case 'networking': return 'bg-orange-100 text-orange-800';
      case 'conference': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventDuration = () => {
    const start = new Date(event.start_datetime);
    const end = new Date(event.end_datetime);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}${diffHours > 0 ? ` and ${diffHours} hour${diffHours > 1 ? 's' : ''}` : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const isRegistrationOpen = () => {
    if (!event.registration_deadline) return true;
    return new Date(event.registration_deadline) > new Date();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon />
          <Typography variant="h6">Event Details</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {event.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={event.event_type} color="primary" size="small" />
                <Chip label={event.status} color={getStatusColor(event.status) as any} size="small" />
                {event.registration_fee && event.registration_fee > 0 && (
                  <Chip 
                    icon={<AttachMoneyIcon />} 
                    label={`$${event.registration_fee}`} 
                    variant="outlined" 
                    size="small" 
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {getEventDuration()}
              </Typography>
            </Box>
          </Box>
          
          {event.description && (
            <Typography color="text.secondary">
              {event.description}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Event Schedule */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AccessTimeIcon />
            Event Schedule
          </Typography>
            
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Start Date & Time
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(event.start_datetime)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  End Date & Time
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(event.end_datetime)}
                </Typography>
              </Box>
            </Grid>
            {event.registration_deadline && (
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Registration Deadline
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(event.registration_deadline)}
                  </Typography>
                  <Chip 
                    label={isRegistrationOpen() ? 'Open' : 'Closed'} 
                    color={isRegistrationOpen() ? 'success' : 'error'} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Venue and Capacity */}
        {(event.venue || event.capacity) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnIcon />
              Venue Information
            </Typography>
              
            <Grid container spacing={2}>
              {event.venue && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Venue
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16 }} />
                      {event.venue}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {event.capacity && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Capacity
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 16 }} />
                      {event.capacity} attendees
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Organizer Information */}
        {event.organizer_name && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon />
              Organizer
            </Typography>
            
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                Organizer Name
              </Typography>
              <Typography variant="body2">
                {event.organizer_name}
              </Typography>
              {event.organizer_email && (
                <Typography variant="body2" color="text.secondary">
                  {event.organizer_email}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Special Guests */}
        {event.special_guests && event.special_guests.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PeopleIcon />
              Special Guests
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {event.special_guests.map((guest, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                  <Typography variant="body2">{guest}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Event Agenda */}
        {event.agenda && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Event Agenda
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {event.agenda}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Registration Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AttachMoneyIcon />
            Registration Information
          </Typography>
            
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Registration Fee
                </Typography>
                <Typography variant="body2">
                  {event.registration_fee && event.registration_fee > 0 
                    ? `$${event.registration_fee}` 
                    : 'Free'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Registration Status
                </Typography>
                <Chip 
                  label={isRegistrationOpen() ? 'Open for Registration' : 'Registration Closed'} 
                  color={isRegistrationOpen() ? 'success' : 'error'} 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Timestamps */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Record Information
          </Typography>
            
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Created
                </Typography>
                <Typography variant="body2">
                  {formatDate(event.created_at)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDate(event.updated_at)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Actions */}
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          {isRegistrationOpen() && (
            <Button variant="contained">
              Register for Event
            </Button>
          )}
          <Button variant="outlined">
            Edit Event
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniEventViewDialog;
