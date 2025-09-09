// =====================================================
// Chart Card Component
// Displays charts with title and actions
// =====================================================

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  useTheme,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  chart: React.ReactNode;
  height?: number | string;
  onRefresh?: () => void;
  onDownload?: () => void;
  actions?: React.ReactNode;
  loading?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  chart,
  height = 300,
  onRefresh,
  onDownload,
  actions,
  loading,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    handleMenuClose();
    onRefresh?.();
  };

  const handleDownload = () => {
    handleMenuClose();
    onDownload?.();
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{title}</Typography>
            {loading && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  animation: 'pulse 1.5s infinite'
                }}
              />
            )}
          </Box>
        }
        subheader={subtitle}
        action={
          <Box display="flex" alignItems="center">
            {actions}
            {(onRefresh || onDownload) && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label="chart options"
              >
                <MoreVertIcon />
              </IconButton>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {onRefresh && (
                <MenuItem onClick={handleRefresh}>
                  <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
                  Refresh
                </MenuItem>
              )}
              {onDownload && (
                <MenuItem onClick={handleDownload}>
                  <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
                  Download
                </MenuItem>
              )}
            </Menu>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height,
            width: '100%',
            opacity: loading ? 0.5 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          {chart}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;