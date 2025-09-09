// =====================================================
// KPI Card Component
// Displays key performance indicators with trends
// =====================================================

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  trendLabel?: string;
  progress?: number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  description,
  trend,
  trendLabel,
  progress,
  icon,
  color = 'primary'
}) => {
  const theme = useTheme();

  const getTrendColor = (trend: number) => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUpIcon sx={{ color: getTrendColor(trend) }} />;
    if (trend < 0) return <TrendingDownIcon sx={{ color: getTrendColor(trend) }} />;
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: theme.palette[color].light,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { color: theme.palette[color].main }
              })}
            </Box>
          )}
        </Box>

        {description && (
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            {description && (
              <Tooltip title={description}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        {typeof trend === 'number' && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {getTrendIcon(trend)}
            <Typography
              variant="body2"
              sx={{ color: getTrendColor(trend) }}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
            {trendLabel && (
              <Typography variant="body2" color="text.secondary">
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}

        {typeof progress === 'number' && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette[color].light,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                }
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}
            >
              {progress}% Complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;