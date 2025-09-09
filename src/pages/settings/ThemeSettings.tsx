// =====================================================
// Theme Settings Component
// Customizes theme appearance and dark mode
// =====================================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Slider,
  Stack,
  Alert,
  IconButton,
  useTheme,
  Paper,
  Tooltip,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import Crop32Icon from '@mui/icons-material/Crop32';
import RefreshIcon from '@mui/icons-material/Refresh';
// import { SketchPicker } from 'react-color';
import { useThemeContext } from '../../contexts/ThemeContext';

const ThemeSettings: React.FC = () => {
  const theme = useTheme();
  const {
    mode,
    toggleMode,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    borderRadius,
    setBorderRadius,
    fontSize,
    setFontSize,
  } = useThemeContext();

  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setPrimaryColor('#1976d2');
    setSecondaryColor('#dc004e');
    setBorderRadius(4);
    setFontSize(14);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const PreviewCard = () => (
    <Paper
      sx={{
        p: 2,
        borderRadius: `${borderRadius * 2}px !important`,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Theme Preview
      </Typography>
      <Stack spacing={2}>
        <Button variant="contained" color="primary">
          Primary Button
        </Button>
        <Button variant="contained" color="secondary">
          Secondary Button
        </Button>
        <Box display="flex" gap={1}>
          <Button variant="outlined" color="primary">
            Outlined
          </Button>
          <Button variant="text" color="primary">
            Text
          </Button>
        </Box>
        <Alert severity="success">
          This is how alerts will look
        </Alert>
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: borderRadius,
          }}
        >
          <Typography>
            Text will appear at {fontSize}px size
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Theme Customization
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Color Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Colors
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box position="relative">
                      <Typography gutterBottom>Primary Color</Typography>
                      <Box
                        onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                        sx={{
                          width: '100%',
                          height: 40,
                          bgcolor: primaryColor,
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: 1,
                          borderColor: 'divider',
                        }}
                      />
                      {showPrimaryPicker && (
                        <Box
                          position="absolute"
                          zIndex={1}
                          mt={1}
                        >
                          <Box
                            position="fixed"
                            top={0}
                            right={0}
                            bottom={0}
                            left={0}
                            onClick={() => setShowPrimaryPicker(false)}
                           />
                          {/* <SketchPicker
                            color={primaryColor}
                            onChange={(color: any) => setPrimaryColor(color.hex)}
                           /> */}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box position="relative">
                      <Typography gutterBottom>Secondary Color</Typography>
                      <Box
                        onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                        sx={{
                          width: '100%',
                          height: 40,
                          bgcolor: secondaryColor,
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: 1,
                          borderColor: 'divider',
                        }}
                      />
                      {showSecondaryPicker && (
                        <Box
                          position="absolute"
                          zIndex={1}
                          mt={1}
                        >
                          <Box
                            position="fixed"
                            top={0}
                            right={0}
                            bottom={0}
                            left={0}
                            onClick={() => setShowSecondaryPicker(false)}
                           />
                          {/* <SketchPicker
                            color={secondaryColor}
                            onChange={(color: any) => setSecondaryColor(color.hex)}
                           /> */}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Layout Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Layout
                </Typography>
                <Stack spacing={4}>
                  <Box>
                    <Typography gutterBottom>
                      Border Radius: {borderRadius}px
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Crop32Icon />
                      </Grid>
                      <Grid item xs>
                        <Slider
                          value={borderRadius}
                          onChange={(_, value) => setBorderRadius(value as number)}
                          min={0}
                          max={16}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Typography gutterBottom>
                      Font Size: {fontSize}px
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <FormatSizeIcon />
                      </Grid>
                      <Grid item xs>
                        <Slider
                          value={fontSize}
                          onChange={(_, value) => setFontSize(value as number)}
                          min={12}
                          max={20}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Mode Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mode
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleMode}
                      icon={<LightModeIcon />}
                      checkedIcon={<DarkModeIcon />}
                    />
                  }
                  label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                />
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">
                    Preview
                  </Typography>
                  <Tooltip title="Reset to defaults">
                    <IconButton onClick={handleReset} size="small">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <PreviewCard />
              </CardContent>
            </Card>

            {success && (
              <Alert severity="success" onClose={() => setSuccess(false)}>
                Theme settings reset to defaults
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThemeSettings;
