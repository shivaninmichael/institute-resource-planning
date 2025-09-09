// =====================================================
// Documents Page Component
// File management, versioning, and templates interface
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
  CardActions,
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
  ListItemAvatar,
  Avatar,
  Badge,
  Divider,
  InputAdornment,
  LinearProgress,
  Alert,
  Tooltip,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import FolderIcon from '@mui/icons-material/Folder';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import VersionIcon from '@mui/icons-material/History';
import TemplateIcon from '@mui/icons-material/Template';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreIcon from '@mui/icons-material/MoreVert';
import DocumentIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import VideoIcon from '@mui/icons-material/VideoLibrary';
import AudioIcon from '@mui/icons-material/AudioFile';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  name: string;
  originalName: string;
  description: string;
  mimeType: string;
  size: number;
  category: string;
  tags: string[];
  version: number;
  isTemplate: boolean;
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  variables: TemplateVariable[];
  previewUrl: string;
  usageCount: number;
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'table';
  label: string;
  description: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

interface DocumentVersion {
  id: string;
  version: number;
  name: string;
  description: string;
  size: number;
  changes: string;
  createdBy: string;
  createdAt: Date;
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

const DocumentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [versionDialog, setVersionDialog] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Student Handbook 2024',
      originalName: 'student_handbook_2024.pdf',
      description: 'Official student handbook for academic year 2024',
      mimeType: 'application/pdf',
      size: 2048000,
      category: 'Academic',
      tags: ['handbook', 'students', '2024'],
      version: 2,
      isTemplate: false,
      uploadedBy: 'admin',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Course Syllabus Template',
      originalName: 'syllabus_template.docx',
      description: 'Template for creating course syllabi',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 512000,
      category: 'Templates',
      tags: ['template', 'syllabus', 'course'],
      version: 1,
      isTemplate: true,
      uploadedBy: 'faculty',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Budget Report Q3 2024',
      originalName: 'budget_q3_2024.xlsx',
      description: 'Quarterly budget report for Q3 2024',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1024000,
      category: 'Financial',
      tags: ['budget', 'report', 'q3', '2024'],
      version: 1,
      isTemplate: false,
      uploadedBy: 'finance',
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockTemplates: DocumentTemplate[] = [
    {
      id: '1',
      name: 'Student Certificate',
      description: 'Certificate template for student achievements',
      category: 'Academic',
      variables: [
        {
          name: 'studentName',
          type: 'text',
          label: 'Student Name',
          description: 'Full name of the student',
          required: true
        },
        {
          name: 'courseName',
          type: 'text',
          label: 'Course Name',
          description: 'Name of the course',
          required: true
        },
        {
          name: 'completionDate',
          type: 'date',
          label: 'Completion Date',
          description: 'Date of course completion',
          required: true
        }
      ],
      previewUrl: '/templates/preview/certificate.png',
      usageCount: 45
    },
    {
      id: '2',
      name: 'Academic Transcript',
      description: 'Official academic transcript template',
      category: 'Academic',
      variables: [
        {
          name: 'studentName',
          type: 'text',
          label: 'Student Name',
          description: 'Full name of the student',
          required: true
        },
        {
          name: 'studentId',
          type: 'text',
          label: 'Student ID',
          description: 'Student identification number',
          required: true
        },
        {
          name: 'gpa',
          type: 'number',
          label: 'GPA',
          description: 'Grade Point Average',
          required: true
        }
      ],
      previewUrl: '/templates/preview/transcript.png',
      usageCount: 23
    }
  ];

  const mockVersions: DocumentVersion[] = [
    {
      id: 'v1',
      version: 1,
      name: 'Initial version',
      description: 'First version of the document',
      size: 1800000,
      changes: 'Initial upload',
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'v2',
      version: 2,
      name: 'Updated content',
      description: 'Updated with latest policies',
      size: 2048000,
      changes: 'Updated policies section, added new guidelines',
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  const categories = ['All', 'Academic', 'Financial', 'Administrative', 'Templates', 'Personal'];

  useEffect(() => {
    setDocuments(mockDocuments);
    setTemplates(mockTemplates);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadDialog(false);
            
            // Add mock document
            const newDoc: Document = {
              id: `doc_${Date.now()}`,
              name: file.name,
              originalName: file.name,
              description: '',
              mimeType: file.type,
              size: file.size,
              category: 'General',
              tags: [],
              version: 1,
              isTemplate: false,
              uploadedBy: 'current_user',
              uploadedAt: new Date(),
              updatedAt: new Date()
            };
            
            setDocuments([newDoc, ...documents]);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    console.log(`Downloading ${document.name}`);
  };

  const handleViewVersions = (document: Document) => {
    setSelectedDocument(document);
    setVersions(mockVersions);
    setVersionDialog(true);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon />;
    if (mimeType.startsWith('video/')) return <VideoIcon />;
    if (mimeType.startsWith('audio/')) return <AudioIcon />;
    if (mimeType === 'application/pdf') return <PdfIcon />;
    return <DocumentIcon />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderDocuments = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Documents</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialog(true)}
        >
          Upload Document
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredDocuments.map((document) => (
          <Grid item xs={12} md={6} lg={4} key={document.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {getFileIcon(document.mimeType)}
                  </Avatar>
                  <Box flex={1} minWidth={0}>
                    <Typography variant="h6" noWrap>
                      {document.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {document.description || 'No description'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Chip label={document.category} size="small" />
                      {document.version > 1 && (
                        <Chip label={`v${document.version}`} size="small" color="info" />
                      )}
                      {document.isTemplate && (
                        <Chip label="Template" size="small" color="secondary" />
                      )}
                    </Box>
                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                      {formatFileSize(document.size)} • {formatDistanceToNow(document.uploadedAt, { addSuffix: true })}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setSelectedDocument(document);
                      setAnchorEl(e.currentTarget);
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                  {document.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<ViewIcon />}>
                  View
                </Button>
                <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownload(document)}>
                  Download
                </Button>
                <Button size="small" startIcon={<ShareIcon />}>
                  Share
                </Button>
                {document.version > 1 && (
                  <Button size="small" startIcon={<VersionIcon />} onClick={() => handleViewVersions(document)}>
                    Versions
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTemplates = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Document Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTemplateDialog(true)}
        >
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <TemplateIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6">
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {template.description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Chip label={template.category} size="small" />
                      <Badge badgeContent={template.usageCount} color="primary">
                        <Chip label="Used" size="small" variant="outlined" />
                      </Badge>
                    </Box>
                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                      {template.variables.length} variables
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<ViewIcon />}>
                  Preview
                </Button>
                <Button size="small" startIcon={<AddIcon />}>
                  Use Template
                </Button>
                <Button size="small" startIcon={<EditIcon />}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderStatistics = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Document Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {documents.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="secondary">
                {templates.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Size
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {documents.filter(doc => doc.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Recent Updates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Documents by Category
            </Typography>
            <List>
              {categories.slice(1).map((category) => {
                const count = documents.filter(doc => doc.category === category).length;
                return (
                  <ListItem key={category}>
                    <ListItemText
                      primary={category}
                      secondary={`${count} documents`}
                    />
                    <ListItemSecondaryAction>
                      <Chip label={count} size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Document Management
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Documents" icon={<FileIcon />} />
            <Tab label="Templates" icon={<TemplateIcon />} />
            <Tab label="Statistics" icon={<FolderIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderDocuments()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderTemplates()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderStatistics()}
        </TabPanel>

        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <input
                  type="file"
                  onChange={handleUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<UploadIcon />}
                    sx={{ height: 100 }}
                  >
                    Click to select file or drag and drop
                  </Button>
                </label>
              </Grid>
              {isUploading && (
                <Grid item xs={12}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Uploading... {uploadProgress}%
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  placeholder="Enter document description"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category">
                    {categories.slice(1).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tags"
                  placeholder="Enter tags separated by commas"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
            <Button variant="contained" disabled={isUploading}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        {/* Versions Dialog */}
        <Dialog open={versionDialog} onClose={() => setVersionDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Document Versions - {selectedDocument?.name}
          </DialogTitle>
          <DialogContent>
            <List>
              {versions.map((version) => (
                <ListItem key={version.id} divider>
                  <ListItemAvatar>
                    <Avatar>{version.version}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Version ${version.version}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">{version.changes}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatFileSize(version.size)} • Created by {version.createdBy} • {formatDistanceToNow(version.createdAt, { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVersionDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Document Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItemComponent onClick={() => setAnchorEl(null)}>
            <ViewIcon sx={{ mr: 1 }} /> View
          </MenuItemComponent>
          <MenuItemComponent onClick={() => setAnchorEl(null)}>
            <DownloadIcon sx={{ mr: 1 }} /> Download
          </MenuItemComponent>
          <MenuItemComponent onClick={() => setAnchorEl(null)}>
            <ShareIcon sx={{ mr: 1 }} /> Share
          </MenuItemComponent>
          <MenuItemComponent onClick={() => setAnchorEl(null)}>
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItemComponent>
          <MenuItemComponent onClick={() => setAnchorEl(null)}>
            <CommentIcon sx={{ mr: 1 }} /> Comments
          </MenuItemComponent>
          <Divider />
          <MenuItemComponent onClick={() => setAnchorEl(null)}>
            <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
          </MenuItemComponent>
        </Menu>
      </Box>
    </Container>
  );
};

export default DocumentsPage;
