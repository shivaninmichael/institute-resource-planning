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
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Alumni {
  id: number;
  graduation_year: number;
  degree?: string;
  department_id?: number;
  program_id?: number;
  batch_id?: number;
  roll_number?: string;
  final_gpa?: number;
  achievements?: string[];
  current_company?: string;
  current_position?: string;
  industry?: string;
  work_location?: string;
  linkedin_profile?: string;
  other_social_media?: any;
  willing_to_mentor: boolean;
  expertise_areas?: string[];
  status: 'active' | 'inactive';
  student_first_name?: string;
  student_last_name?: string;
  student_gr_no?: string;
  student_email?: string;
  partner_name?: string;
  partner_email?: string;
  department_name?: string;
  program_name?: string;
  batch_name?: string;
  created_at: string;
  updated_at: string;
}

interface AlumniViewDialogProps {
  alumni: Alumni;
  onClose: () => void;
}

const AlumniViewDialog: React.FC<AlumniViewDialogProps> = ({ alumni, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayName = () => {
    if (alumni.student_first_name && alumni.student_last_name) {
      return `${alumni.student_first_name} ${alumni.student_last_name}`;
    }
    return alumni.partner_name || 'Alumni';
  };

  const getDisplayEmail = () => {
    return alumni.student_email || alumni.partner_email || 'No email available';
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon />
          <Typography variant="h6">Alumni Profile</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              {getDisplayName()}
            </Typography>
            <Typography color="text.secondary">
              {getDisplayEmail()}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip label={alumni.status} color={getStatusColor(alumni.status) as any} size="small" />
              {alumni.willing_to_mentor && (
                <Chip 
                  icon={<PeopleIcon />} 
                  label="Mentor" 
                  variant="outlined" 
                  size="small" 
                />
              )}
            </Box>
          </Box>
          {alumni.linkedin_profile && (
            <Button 
              variant="outlined" 
              size="small" 
              href={alumni.linkedin_profile} 
              target="_blank" 
              rel="noopener noreferrer"
              startIcon={<LinkedInIcon />}
            >
              LinkedIn
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Academic Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon />
            Academic Information
          </Typography>
            
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Graduation Year
                </Typography>
                <Typography variant="body2">
                  {alumni.graduation_year}
                </Typography>
              </Box>
            </Grid>
              
            {alumni.degree && (
              <Grid item xs={12} md={6} lg={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Degree
                  </Typography>
                  <Typography variant="body2">
                    {alumni.degree}
                  </Typography>
                </Box>
              </Grid>
            )}
              
            {alumni.roll_number && (
              <Grid item xs={12} md={6} lg={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Roll Number
                  </Typography>
                  <Typography variant="body2">
                    {alumni.roll_number}
                  </Typography>
                </Box>
              </Grid>
            )}
              
            {alumni.final_gpa && (
              <Grid item xs={12} md={6} lg={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Final GPA
                  </Typography>
                  <Typography variant="body2">
                    {alumni.final_gpa}
                  </Typography>
                </Box>
              </Grid>
            )}
              
            {alumni.department_name && (
              <Grid item xs={12} md={6} lg={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Department
                  </Typography>
                  <Typography variant="body2">
                    {alumni.department_name}
                  </Typography>
                </Box>
              </Grid>
            )}
              
            {alumni.program_name && (
              <Grid item xs={12} md={6} lg={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Program
                  </Typography>
                  <Typography variant="body2">
                    {alumni.program_name}
                  </Typography>
                </Box>
              </Grid>
            )}
              
            {alumni.batch_name && (
              <Grid item xs={12} md={6} lg={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Batch
                  </Typography>
                  <Typography variant="body2">
                    {alumni.batch_name}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Professional Information */}
        {(alumni.current_company || alumni.current_position || alumni.industry || alumni.work_location) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BusinessIcon />
              Professional Information
            </Typography>
              
            <Grid container spacing={2}>
              {alumni.current_company && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Current Company
                    </Typography>
                    <Typography variant="body2">
                      {alumni.current_company}
                    </Typography>
                  </Box>
                </Grid>
              )}
                
              {alumni.current_position && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Current Position
                    </Typography>
                    <Typography variant="body2">
                      {alumni.current_position}
                    </Typography>
                  </Box>
                </Grid>
              )}
                
              {alumni.industry && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Industry
                    </Typography>
                    <Typography variant="body2">
                      {alumni.industry}
                    </Typography>
                  </Box>
                </Grid>
              )}
                
              {alumni.work_location && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Work Location
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16 }} />
                      {alumni.work_location}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Achievements */}
        {alumni.achievements && alumni.achievements.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmojiEventsIcon />
              Achievements
            </Typography>
              
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {alumni.achievements.map((achievement, index) => (
                <Chip 
                  key={index} 
                  label={achievement} 
                  color="warning" 
                  size="small" 
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Expertise Areas */}
        {alumni.expertise_areas && alumni.expertise_areas.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PeopleIcon />
              Expertise Areas
            </Typography>
              
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {alumni.expertise_areas.map((expertise, index) => (
                <Chip 
                  key={index} 
                  label={expertise} 
                  color="success" 
                  size="small" 
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Social Media */}
        {alumni.other_social_media && Object.keys(alumni.other_social_media).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <OpenInNewIcon />
              Social Media
            </Typography>
              
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(alumni.other_social_media).map(([platform, url]) => (
                <Box key={platform} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium', minWidth: 80, textTransform: 'capitalize' }}>
                    {platform}:
                  </Typography>
                  <Button 
                    href={url as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    {url as string}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}

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
                  {formatDate(alumni.created_at)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDate(alumni.updated_at)}
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
          <Button variant="contained">
            Edit Profile
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniViewDialog;
