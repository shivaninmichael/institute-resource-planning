// =====================================================
// OpenEducat ERP Frontend - File Manager
// Document upload, management and attachment functionality
// =====================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Breadcrumbs,
  Link,
  LinearProgress,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import VideoIcon from '@mui/icons-material/VideoLibrary';
import AudioIcon from '@mui/icons-material/AudioFile';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreIcon from '@mui/icons-material/MoreVert';
import NewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../services/supabase';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  extension?: string;
  path: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  isShared: boolean;
  downloadUrl?: string;
  thumbnailUrl?: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const FileManagerPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  // Dialogs
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    file: FileItem | null;
  }>({ open: false, file: null });
  const [shareDialog, setShareDialog] = useState<{
    open: boolean;
    file: FileItem | null;
  }>({ open: false, file: null });

  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [renameName, setRenameName] = useState('');

  useEffect(() => {
    loadFiles();
  }, [currentFolder]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await filesApi.getFiles(currentFolder);
      setFiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load files');
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploads: UploadProgress[] = acceptedFiles.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    
    setUploadProgress(uploads);

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parentId', currentFolder);

      try {
        await filesApi.uploadFile(formData, (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          setUploadProgress(prev => 
            prev.map((item, index) => 
              index === i ? { ...item, progress } : item
            )
          );
        });

        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, status: 'completed' } : item
          )
        );
      } catch (err) {
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, status: 'error' } : item
          )
        );
        console.error('Error uploading file:', err);
      }
    }

    // Clear upload progress after 3 seconds
    setTimeout(() => {
      setUploadProgress([]);
      loadFiles(); // Refresh file list
    }, 3000);
  }, [currentFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleCreateFolder = async () => {
    try {
      await filesApi.createFolder({
        name: newFolderName,
        parentId: currentFolder,
      });
      
      loadFiles();
      setNewFolderDialog(false);
      setNewFolderName('');
    } catch (err) {
      setError('Failed to create folder');
      console.error('Error creating folder:', err);
    }
  };

  const handleRenameFile = async () => {
    if (!renameDialog.file) return;

    try {
      await filesApi.renameFile(renameDialog.file.id, renameName);
      
      loadFiles();
      setRenameDialog({ open: false, file: null });
      setRenameName('');
    } catch (err) {
      setError('Failed to rename file');
      console.error('Error renaming file:', err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await filesApi.deleteFile(fileId);
      loadFiles();
    } catch (err) {
      setError('Failed to delete file');
      console.error('Error deleting file:', err);
    }
  };

  const handleDownloadFile = async (file: FileItem) => {
    try {
      const response = await filesApi.downloadFile(file.id);
      
      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download file');
      console.error('Error downloading file:', err);
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    if (folderId === 'root') {
      setCurrentPath(['root']);
    } else {
      setCurrentPath(prev => [...prev, folderName]);
    }
  };

  const navigateToPath = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    if (index === 0) {
      setCurrentFolder('root');
    } else {
      // In a real implementation, you'd need to track folder IDs
      // For now, we'll just navigate to root
      setCurrentFolder('root');
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <FolderIcon color="primary" />;
    }

    const extension = file.extension?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'doc':
      case 'docx':
        return <DocIcon color="info" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon color="success" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoIcon color="secondary" />;
      case 'mp3':
      case 'wav':
        return <AudioIcon color="warning" />;
      case 'zip':
      case 'rar':
        return <ArchiveIcon />;
      default:
        return <FileIcon />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && files.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          File Manager
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<NewFolderIcon />}
            onClick={() => setNewFolderDialog(true)}
          >
            New Folder
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Progress
            </Typography>
            {uploadProgress.map((upload, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{upload.fileName}</Typography>
                  <Typography variant="body2">{upload.progress}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={upload.progress}
                  color={upload.status === 'error' ? 'error' : 'primary'}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Breadcrumbs>
                {currentPath.map((path, index) => (
                  <Link
                    key={index}
                    component="button"
                    variant="body1"
                    onClick={() => navigateToPath(index)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {path}
                  </Link>
                ))}
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card sx={{ mb: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            p: 4,
            border: 2,
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderStyle: 'dashed',
            borderRadius: 1,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'transparent',
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select files
          </Typography>
        </Box>
      </Card>

      {/* Files List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Files ({filteredFiles.length})
          </Typography>
          
          <List>
            {filteredFiles.map((file) => (
              <ListItem
                key={file.id}
                divider
                sx={{
                  cursor: file.type === 'folder' ? 'pointer' : 'default',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
                onClick={file.type === 'folder' ? () => navigateToFolder(file.id, file.name) : undefined}
              >
                <ListItemIcon>
                  {getFileIcon(file)}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption">
                        {formatFileSize(file.size)}
                      </Typography>
                      <Typography variant="caption">
                        {new Date(file.updatedAt).toLocaleDateString()}
                      </Typography>
                      {file.isShared && (
                        <Chip label="Shared" size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEl(e.currentTarget);
                      setSelectedFile(file);
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            
            {filteredFiles.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No files found"
                  secondary="Upload some files to get started"
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {selectedFile?.type === 'file' && (
          <MenuItem onClick={() => {
            if (selectedFile) handleDownloadFile(selectedFile);
            setAnchorEl(null);
          }}>
            <DownloadIcon sx={{ mr: 1 }} />
            Download
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (selectedFile) {
            setRenameDialog({ open: true, file: selectedFile });
            setRenameName(selectedFile.name);
          }
          setAnchorEl(null);
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedFile) setShareDialog({ open: true, file: selectedFile });
          setAnchorEl(null);
        }}>
          <ViewIcon sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (selectedFile) handleDeleteFile(selectedFile.id);
          setAnchorEl(null);
        }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* New Folder Dialog */}
      <Dialog
        open={newFolderDialog}
        onClose={() => setNewFolderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            variant="contained"
            disabled={!newFolderName.trim()}
          >
            Create Folder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialog.open}
        onClose={() => setRenameDialog({ open: false, file: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rename {renameDialog.file?.type}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Name"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialog({ open: false, file: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleRenameFile}
            variant="contained"
            disabled={!renameName.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialog.open}
        onClose={() => setShareDialog({ open: false, file: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share {shareDialog.file?.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            File sharing functionality will be implemented here.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog({ open: false, file: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileManagerPage;
