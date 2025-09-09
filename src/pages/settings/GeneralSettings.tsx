// =====================================================
// General Settings Component
// Basic system configuration settings
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

interface GeneralSettingsProps {
  onSave?: (settings: any) => Promise<void>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [settings, setSettings] = useState({
    instituteName: 'S-ERP University',
    instituteCode: 'SERP-001',
    address: '123 Education Street',
    city: 'Academic City',
    state: 'Knowledge State',
    country: 'Education Land',
    phone: '+1-555-0100',
    email: 'admin@s-erp.com',
    website: 'https://www.s-erp.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'en',
    academicYear: '2024',
    enableNotifications: true,
    enableSMS: false,
    enableEmails: true,
    enableAttendanceReminders: true,
    enableFeeReminders: true,
    enableExamReminders: true,
  });

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = (event.target as HTMLInputElement).type === 'checkbox' 
      ? (event.target as HTMLInputElement).checked
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
        {/* Institution Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Institution Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution Name"
                  value={settings.instituteName}
                  onChange={handleChange('instituteName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution Code"
                  value={settings.instituteCode}
                  onChange={handleChange('instituteCode')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={settings.address}
                  onChange={handleChange('address')}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={settings.city}
                  onChange={handleChange('city')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={settings.state}
                  onChange={handleChange('state')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={settings.country}
                  onChange={handleChange('country')}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={settings.phone}
                  onChange={handleChange('phone')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={handleChange('email')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Website"
                  value={settings.website}
                  onChange={handleChange('website')}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">EST</MenuItem>
                    <MenuItem value="PST">PST</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.dateFormat}
                    label="Date Format"
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Time Format</InputLabel>
                  <Select
                    value={settings.timeFormat}
                    label="Time Format"
                    onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                  >
                    <MenuItem value="12">12 Hour</MenuItem>
                    <MenuItem value="24">24 Hour</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.currency}
                    label="Currency"
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Academic Year</InputLabel>
                  <Select
                    value={settings.academicYear}
                    label="Academic Year"
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  >
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableNotifications}
                      onChange={handleChange('enableNotifications')}
                    />
                  }
                  label="Enable Notifications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableSMS}
                      onChange={handleChange('enableSMS')}
                    />
                  }
                  label="Enable SMS Notifications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableEmails}
                      onChange={handleChange('enableEmails')}
                    />
                  }
                  label="Enable Email Notifications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAttendanceReminders}
                      onChange={handleChange('enableAttendanceReminders')}
                    />
                  }
                  label="Enable Attendance Reminders"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableFeeReminders}
                      onChange={handleChange('enableFeeReminders')}
                    />
                  }
                  label="Enable Fee Reminders"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableExamReminders}
                      onChange={handleChange('enableExamReminders')}
                    />
                  }
                  label="Enable Exam Reminders"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => setSettings({
              instituteName: 'S-ERP University',
              instituteCode: 'SERP-001',
              address: '123 Education Street',
              city: 'Academic City',
              state: 'Knowledge State',
              country: 'Education Land',
              phone: '+1-555-0100',
              email: 'admin@s-erp.com',
              website: 'https://www.s-erp.com',
              timezone: 'UTC',
              dateFormat: 'MM/DD/YYYY',
              timeFormat: '12',
              currency: 'USD',
              language: 'en',
              academicYear: '2024',
              enableNotifications: true,
              enableSMS: false,
              enableEmails: true,
              enableAttendanceReminders: true,
              enableFeeReminders: true,
              enableExamReminders: true,
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

export default GeneralSettings;
