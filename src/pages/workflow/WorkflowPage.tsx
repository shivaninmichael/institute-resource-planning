// =====================================================
// Workflow Management Page
// Main page for workflow management and monitoring
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
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  LinearProgress,
  Avatar,
  Tooltip,
} from '@mui/material';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import StatsIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import { useWorkflow } from '../../contexts/WorkflowContext';

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

const WorkflowPage: React.FC = () => {
  const {
    workflows,
    instances,
    tasks,
    statistics,
    selectedWorkflow,
    selectedInstance,
    isLoading,
    error,
    loadWorkflows,
    loadInstances,
    loadMyTasks,
    loadStatistics,
    startWorkflow,
    completeStep,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    completeTask,
    selectWorkflow,
    selectInstance,
    clearError
  } = useWorkflow();

  const [tabValue, setTabValue] = useState(0);
  const [startWorkflowDialog, setStartWorkflowDialog] = useState(false);
  const [taskDialog, setTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  
  interface WorkflowTask {
    id: number;
    name: string;
    description: string;
    status: string;
    assigned_to: string;
    due_date: string;
    created_at: string;
  }
  
  interface WorkflowStartData {
    workflowId: string;
    entityId: string;
    entityType: string;
    initialData: Record<string, unknown>;
  }

  const [workflowData, setWorkflowData] = useState<WorkflowStartData>({
    workflowId: '',
    entityId: '',
    entityType: '',
    initialData: {}
  });

  useEffect(() => {
    loadWorkflows();
    loadInstances();
    loadMyTasks();
    loadStatistics();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  type WorkflowStatus = 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  type StatusColor = 'primary' | 'success' | 'error' | 'warning' | 'default';

  const getStatusColor = (status: WorkflowStatus): StatusColor => {
    switch (status) {
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'paused': return 'warning';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
  type PriorityColor = 'error' | 'warning' | 'info' | 'default';

  const getPriorityColor = (priority: TaskPriority): PriorityColor => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const handleStartWorkflow = async () => {
    if (workflowData.workflowId && workflowData.entityId && workflowData.entityType) {
      await startWorkflow(
        workflowData.workflowId,
        workflowData.entityId,
        workflowData.entityType,
        workflowData.initialData
      );
      setStartWorkflowDialog(false);
      setWorkflowData({ workflowId: '', entityId: '', entityType: '', initialData: {} });
    }
  };

  const handleCompleteTask = async (taskData: Record<string, unknown>) => {
    if (selectedTask) {
      await completeTask(selectedTask.id.toString(), taskData);
      setTaskDialog(false);
      setSelectedTask(null);
    }
  };

  const renderWorkflowDefinitions = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Workflow Definitions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setStartWorkflowDialog(true)}
        >
          Start Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {workflow.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {workflow.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Chip
                    label={workflow.isActive ? 'Active' : 'Inactive'}
                    color={workflow.isActive ? 'success' : 'default'}
                    size="small"
                  />
                  <Box>
                    <IconButton size="small" onClick={() => selectWorkflow(workflow)}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" display="block" mt={1}>
                  {workflow.steps.length} steps • v{workflow.version}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderWorkflowInstances = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Workflow Instances
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instance ID</TableCell>
              <TableCell>Workflow</TableCell>
              <TableCell>Entity</TableCell>
              <TableCell>Current Step</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Started</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>{instance.id.slice(-8)}</TableCell>
                <TableCell>
                  {workflows.find(w => w.id === instance.workflowId)?.name || instance.workflowId}
                </TableCell>
                <TableCell>
                  {instance.entityType} - {instance.entityId}
                </TableCell>
                <TableCell>{instance.currentStep || 'Completed'}</TableCell>
                <TableCell>
                  <Chip
                    label={instance.status}
                    color={getStatusColor(instance.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(instance.startedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => selectInstance(instance)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  {instance.status === 'running' && (
                    <Tooltip title="Pause">
                      <IconButton size="small" onClick={() => pauseWorkflow(instance.id)}>
                        <PauseIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {instance.status === 'paused' && (
                    <Tooltip title="Resume">
                      <IconButton size="small" onClick={() => resumeWorkflow(instance.id)}>
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(instance.status === 'running' || instance.status === 'paused') && (
                    <Tooltip title="Cancel">
                      <IconButton size="small" onClick={() => cancelWorkflow(instance.id)}>
                        <StopIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMyTasks = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Tasks
      </Typography>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} lg={4} key={task.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {task.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="caption">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<TaskIcon />}
                    onClick={() => {
                      setSelectedTask(task as any);
                      setTaskDialog(true);
                    }}
                  >
                    Complete
                  </Button>
                </Box>
                {task.dueDate && (
                  <Typography variant="caption" color="error">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderStatistics = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Workflow Statistics
      </Typography>

      {statistics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {statistics.totalWorkflows}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Workflows
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="info.main">
                  {statistics.activeInstances}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Instances
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {statistics.pendingTasks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pending Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="error.main">
                  {statistics.overdueTasks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Overdue Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Workflow Management
        </Typography>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Definitions" />
            <Tab label="Instances" />
            <Tab label="My Tasks" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderWorkflowDefinitions()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderWorkflowInstances()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderMyTasks()}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {renderStatistics()}
        </TabPanel>

        {/* Start Workflow Dialog */}
        <Dialog open={startWorkflowDialog} onClose={() => setStartWorkflowDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Start Workflow</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Workflow</InputLabel>
                  <Select
                    value={workflowData.workflowId}
                    onChange={(e) => setWorkflowData({ ...workflowData, workflowId: e.target.value })}
                    label="Workflow"
                  >
                    {workflows.filter(w => w.isActive).map((workflow) => (
                      <MenuItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Entity Type"
                  value={workflowData.entityType}
                  onChange={(e) => setWorkflowData({ ...workflowData, entityType: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Entity ID"
                  value={workflowData.entityId}
                  onChange={(e) => setWorkflowData({ ...workflowData, entityId: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStartWorkflowDialog(false)}>Cancel</Button>
            <Button onClick={handleStartWorkflow} variant="contained">Start</Button>
          </DialogActions>
        </Dialog>

        {/* Complete Task Dialog */}
        <Dialog open={taskDialog} onClose={() => setTaskDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Complete Task</DialogTitle>
          <DialogContent>
            {selectedTask && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedTask.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {selectedTask.description}
                </Typography>
                <TextField
                  fullWidth
                  label="Comments"
                  multiline
                  rows={4}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTaskDialog(false)}>Cancel</Button>
            <Button onClick={() => handleCompleteTask({})} variant="contained">Complete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default WorkflowPage;
