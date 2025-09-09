// =====================================================
// OpenEducat ERP Frontend - Table Card Component
// Displays a data table with title and actions
// =====================================================

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { DataGrid } from '@mui/x-data-grid';
import { TableWidget } from '../../types/dashboard';

interface TableCardProps extends TableWidget {
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onDownload?: () => void;
  onFullscreen?: () => void;
  pageSize?: number;
}

const TableCard: React.FC<TableCardProps> = ({
  title,
  columns,
  rows,
  isLoading = false,
  error = null,
  onRefresh,
  onDownload,
  onFullscreen,
  pageSize = 5,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <Box>
            {onRefresh && (
              <IconButton onClick={onRefresh} size="small" sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            )}
            {onFullscreen && (
              <IconButton onClick={onFullscreen} size="small" sx={{ mr: 1 }}>
                <FullscreenIcon />
              </IconButton>
            )}
            <IconButton
              onClick={handleMenuOpen}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {onDownload && (
                <MenuItem onClick={() => { handleMenuClose(); onDownload(); }}>
                  <FileDownloadIcon sx={{ mr: 1 }} />
                  Download
                </MenuItem>
              )}
            </Menu>
          </Box>
        }
      />
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TableCard;

