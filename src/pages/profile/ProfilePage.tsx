// =====================================================
// Profile Page Component
// Displays and manages user profile information
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationIcon from '@mui/icons-material/LocationOn';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API data
  const profileData = {
    id: '12345',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@s-erp.com',
    phone: '+1-555-0123',
    studentId: 'STU2024001',
    department: 'Computer Science',
    course: 'B.Tech',
    semester: '4th',
    joinDate: '2022-09-01',
    address: '123 Student Housing, Campus Road',
    city: 'Academic City',
    state: 'Knowledge State',
    country: 'Education Land',
    avatar: null,
    status: 'active',
    academicDetails: {
      cgpa: 3.8,
      attendance: 85,
      completedCredits: 80,
      totalCredits: 120,
    },
    currentCourses: [
      { code: 'CS401', name: 'Advanced Algorithms', credits: 4 },
      { code: 'CS402', name: 'Database Systems', credits: 4 },
      { code: 'CS403', name: 'Software Engineering', credits: 3 },
    ],
    recentActivities: [
      {
        type: 'assignment',
        title: 'Algorithm Assignment 3',
        date: '2024-01-15',
        status: 'submitted',
      },
      {
        type: 'exam',
        title: 'Database Mid-term',
        date: '2024-01-10',
        status: 'completed',
      },
      {
        type: 'attendance',
        title: 'Software Engineering Lab',
        date: '2024-01-08',
        status: 'present',
      },
    ],
  };

  const [editData, setEditData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    address: profileData.address,
    city: profileData.city,
    state: profileData.state,
    country: profileData.country,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle avatar upload
      console.log('Uploading avatar:', file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box position="relative">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: theme.palette.primary.main,
                  }}
                  src={profileData.avatar || undefined}
                >
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
            </Grid>
            <Grid item xs>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h4">
                    {profileData.firstName} {profileData.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profileData.studentId}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={profileData.role.toUpperCase()}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={profileData.status.toUpperCase()}
                      color="success"
                      size="small"
                    />
                  </Stack>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Grid container spacing={3}>
        {/* Left Column - Basic Info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={profileData.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={profileData.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={`${profileData.address}, ${profileData.city}, ${profileData.state}, ${profileData.country}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Joined"
                      secondary={new Date(profileData.joinDate).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Academic Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Department"
                      secondary={profileData.department}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BookIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Course"
                      secondary={profileData.course}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Semester"
                      secondary={profileData.semester}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GradeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="CGPA"
                      secondary={profileData.academicDetails.cgpa}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Detailed Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Overview" />
                <Tab label="Courses" />
                <Tab label="Activities" />
              </Tabs>

              <TabPanel value={currentTab} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Academic Progress
                        </Typography>
                        <Typography variant="h3" color="primary">
                          {Math.round((profileData.academicDetails.completedCredits / profileData.academicDetails.totalCredits) * 100)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {profileData.academicDetails.completedCredits} of {profileData.academicDetails.totalCredits} credits completed
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Attendance Rate
                        </Typography>
                        <Typography variant="h3" color="primary">
                          {profileData.academicDetails.attendance}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overall attendance rate
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <Typography variant="h6" gutterBottom>
                  Current Courses
                </Typography>
                <Grid container spacing={2}>
                  {profileData.currentCourses.map((course) => (
                    <Grid item xs={12} key={course.code}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="subtitle1">
                                {course.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {course.code}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${course.credits || 0} Credits`}
                              color="primary"
                              size="small"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {profileData.recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {activity.type === 'assignment' ? (
                            <AssignmentIcon color="primary" />
                          ) : activity.type === 'exam' ? (
                            <GradeIcon color="error" />
                          ) : (
                            <CalendarIcon color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.secondary">
                                {new Date(activity.date).toLocaleDateString()}
                              </Typography>
                              {' • '}
                              <Chip
                                label={activity.status}
                                size="small"
                                color={
                                  activity.status === 'submitted' || activity.status === 'present'
                                    ? 'success'
                                    : activity.status === 'pending'
                                    ? 'warning'
                                    : 'default'
                                }
                              />
                            </>
                          }
                        />
                      </ListItem>
                      {index < profileData.recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Address"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              multiline
              rows={2}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={editData.state}
                  onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={editData.country}
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            onClick={handleEditSubmit}
            variant="contained"
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
