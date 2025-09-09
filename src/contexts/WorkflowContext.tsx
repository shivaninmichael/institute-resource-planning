// =====================================================
// OpenEducat ERP Frontend - Workflow Context
// Manages workflow state and operations
// =====================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// =====================================================
// Types
// =====================================================

interface WorkflowStep {
  id: string;
  name: string;
  type: 'manual' | 'automatic' | 'approval' | 'notification' | 'condition';
  config: {
    form?: {
      fields: {
        name: string;
        type: 'text' | 'select' | 'date' | 'number' | 'checkbox';
        label: string;
        required?: boolean;
        options?: { value: string; label: string }[];
      }[];
      submitLabel?: string;
    };
    notifications?: {
      email?: boolean;
      inApp?: boolean;
      template?: string;
    };
    timeouts?: {
      duration: number;
      action: 'notify' | 'escalate' | 'auto_complete';
    };
    permissions?: {
      roles: string[];
      conditions?: Record<string, unknown>;
    };
  };
  nextSteps: string[];
  conditions?: WorkflowCondition[];
  assignees?: string[];
  timeoutDuration?: number;
}

interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: string | number | boolean | string[] | number[];
  logicalOperator?: 'AND' | 'OR';
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  entityType: string;
  steps: WorkflowStep[];
  isActive: boolean;
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowInstance {
  id: string;
  workflowId: string;
  entityId: string;
  entityType: string;
  currentStep: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  data: Record<string, unknown>;
  history: WorkflowHistoryEntry[];
  startedAt: Date;
  completedAt?: Date;
  startedBy: string;
}

interface WorkflowHistoryEntry {
  stepId: string;
  stepName: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  data: Record<string, unknown>;
  comments?: string;
}

interface WorkflowTask {
  id: string;
  workflowInstanceId: string;
  stepId: string;
  assigneeId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  data: Record<string, unknown>;
}

interface WorkflowStatistics {
  totalWorkflows: number;
  activeInstances: number;
  completedInstances: number;
  failedInstances: number;
  pendingTasks: number;
  overdueTasks: number;
  completedTasks: number;
}

interface WorkflowState {
  workflows: WorkflowDefinition[];
  instances: WorkflowInstance[];
  tasks: WorkflowTask[];
  statistics: WorkflowStatistics | null;
  selectedWorkflow: WorkflowDefinition | null;
  selectedInstance: WorkflowInstance | null;
  isLoading: boolean;
  error: string | null;
}

type WorkflowAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS' }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_WORKFLOWS'; payload: WorkflowDefinition[] }
  | { type: 'SET_INSTANCES'; payload: WorkflowInstance[] }
  | { type: 'SET_TASKS'; payload: WorkflowTask[] }
  | { type: 'SET_STATISTICS'; payload: WorkflowStatistics }
  | { type: 'SET_SELECTED_WORKFLOW'; payload: WorkflowDefinition | null }
  | { type: 'SET_SELECTED_INSTANCE'; payload: WorkflowInstance | null }
  | { type: 'UPDATE_INSTANCE'; payload: WorkflowInstance }
  | { type: 'UPDATE_TASK'; payload: WorkflowTask }
  | { type: 'CLEAR_ERROR' };

interface WorkflowContextType extends WorkflowState {
  // Workflow Management
  loadWorkflows: () => Promise<void>;
  createWorkflow: (workflowData: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  startWorkflow: (workflowId: string, entityId: string, entityType: string, initialData: any) => Promise<void>;
  
  // Instance Management
  loadInstances: (entityType?: string, entityId?: string) => Promise<void>;
  loadInstance: (instanceId: string) => Promise<void>;
  completeStep: (instanceId: string, stepId: string, data: any, comments?: string) => Promise<void>;
  pauseWorkflow: (instanceId: string) => Promise<void>;
  resumeWorkflow: (instanceId: string) => Promise<void>;
  cancelWorkflow: (instanceId: string, reason?: string) => Promise<void>;
  
  // Task Management
  loadMyTasks: () => Promise<void>;
  completeTask: (taskId: string, data: any, comments?: string) => Promise<void>;
  
  // Statistics and History
  loadStatistics: () => Promise<void>;
  loadWorkflowHistory: (entityType: string, entityId: string) => Promise<WorkflowHistoryEntry[]>;
  
  // Event Triggers
  triggerWorkflow: (event: string, entityType: string, entityId: string, data: any) => Promise<void>;
  
  // UI State Management
  selectWorkflow: (workflow: WorkflowDefinition | null) => void;
  selectInstance: (instance: WorkflowInstance | null) => void;
  clearError: () => void;
}

// =====================================================
// Initial State
// =====================================================

const initialState: WorkflowState = {
  workflows: [],
  instances: [],
  tasks: [],
  statistics: null,
  selectedWorkflow: null,
  selectedInstance: null,
  isLoading: false,
  error: null,
};

// =====================================================
// Reducer
// =====================================================

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, error: null };
    
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload };
    
    case 'SET_INSTANCES':
      return { ...state, instances: action.payload };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    case 'SET_SELECTED_WORKFLOW':
      return { ...state, selectedWorkflow: action.payload };
    
    case 'SET_SELECTED_INSTANCE':
      return { ...state, selectedInstance: action.payload };
    
    case 'UPDATE_INSTANCE':
      return {
        ...state,
        instances: state.instances.map(instance =>
          instance.id === action.payload.id ? action.payload : instance
        ),
        selectedInstance: state.selectedInstance?.id === action.payload.id ? action.payload : state.selectedInstance
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// =====================================================
// Context
// =====================================================

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// =====================================================
// Provider Component
// =====================================================

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Mock API calls - replace with actual API service
  interface MockApiOptions {
    method?: string;
    body?: string;
    params?: Record<string, string>;
  }

  const mockApiCall = async (endpoint: string, options?: MockApiOptions): Promise<{ success: boolean; data: unknown }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: [] });
      }, 1000);
    });
  };

  const loadWorkflows = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall('/api/workflow/definitions');
      dispatch({ type: 'SET_WORKFLOWS', payload: response.data as WorkflowDefinition[] });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workflows';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const createWorkflow = async (workflowData: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall('/api/workflow/definitions', {
        method: 'POST',
        body: JSON.stringify(workflowData)
      });
      
      if (response.success) {
        await loadWorkflows();
        toast.success('Workflow created successfully');
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create workflow';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const startWorkflow = async (workflowId: string, entityId: string, entityType: string, initialData: Record<string, unknown>): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall('/api/workflow/start', {
        method: 'POST',
        body: JSON.stringify({ workflowId, entityId, entityType, initialData })
      });
      
      if (response.success) {
        toast.success('Workflow started successfully');
        await loadInstances();
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start workflow';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadInstances = async (entityType?: string, entityId?: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const queryParams = new URLSearchParams();
      if (entityType) queryParams.append('entityType', entityType);
      if (entityId) queryParams.append('entityId', entityId);
      
      const response = await mockApiCall(`/api/workflow/instances?${queryParams.toString()}`);
      dispatch({ type: 'SET_INSTANCES', payload: response.data as WorkflowInstance[] });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workflow instances';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadInstance = async (instanceId: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall(`/api/workflow/instances/${instanceId}`);
      dispatch({ type: 'SET_SELECTED_INSTANCE', payload: response.data as WorkflowInstance });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workflow instance';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const completeStep = async (instanceId: string, stepId: string, data: Record<string, unknown>, comments?: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall(`/api/workflow/instances/${instanceId}/steps/${stepId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ data, comments })
      });
      
      if (response.success) {
        dispatch({ type: 'UPDATE_INSTANCE', payload: response.data as WorkflowInstance });
        toast.success('Step completed successfully');
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete step';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const pauseWorkflow = async (instanceId: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall(`/api/workflow/instances/${instanceId}/pause`, {
        method: 'POST'
      });
      
      if (response.success) {
        dispatch({ type: 'UPDATE_INSTANCE', payload: response.data as WorkflowInstance });
        toast.success('Workflow paused');
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pause workflow';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const resumeWorkflow = async (instanceId: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall(`/api/workflow/instances/${instanceId}/resume`, {
        method: 'POST'
      });
      
      if (response.success) {
        dispatch({ type: 'UPDATE_INSTANCE', payload: response.data as WorkflowInstance });
        toast.success('Workflow resumed');
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resume workflow';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const cancelWorkflow = async (instanceId: string, reason?: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall(`/api/workflow/instances/${instanceId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
      
      if (response.success) {
        dispatch({ type: 'UPDATE_INSTANCE', payload: response.data as WorkflowInstance });
        toast.success('Workflow cancelled');
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel workflow';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadMyTasks = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall('/api/workflow/tasks/my');
      dispatch({ type: 'SET_TASKS', payload: response.data as WorkflowTask[] });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tasks';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const completeTask = async (taskId: string, data: Record<string, unknown>, comments?: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall(`/api/workflow/tasks/${taskId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ data, comments })
      });
      
      if (response.success) {
        dispatch({ type: 'UPDATE_TASK', payload: response.data as WorkflowTask });
        toast.success('Task completed successfully');
        await loadMyTasks();
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete task';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadStatistics = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall('/api/workflow/statistics');
      dispatch({ type: 'SET_STATISTICS', payload: response.data as WorkflowStatistics });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load statistics';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadWorkflowHistory = async (entityType: string, entityId: string): Promise<WorkflowHistoryEntry[]> => {
    try {
      const response = await mockApiCall(`/api/workflow/history/${entityType}/${entityId}`);
      return response.data as WorkflowHistoryEntry[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workflow history';
      toast.error(errorMessage);
      return [];
    }
  };

  const triggerWorkflow = async (event: string, entityType: string, entityId: string, data: Record<string, unknown>): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await mockApiCall('/api/workflow/trigger', {
        method: 'POST',
        body: JSON.stringify({ event, entityType, entityId, data })
      });
      
      if (response.success) {
        toast.success('Workflow triggered successfully');
        await loadInstances();
      }
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger workflow';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const selectWorkflow = (workflow: WorkflowDefinition | null): void => {
    dispatch({ type: 'SET_SELECTED_WORKFLOW', payload: workflow });
  };

  const selectInstance = (instance: WorkflowInstance | null): void => {
    dispatch({ type: 'SET_SELECTED_INSTANCE', payload: instance });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: WorkflowContextType = {
    ...state,
    loadWorkflows,
    createWorkflow,
    startWorkflow,
    loadInstances,
    loadInstance,
    completeStep,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    loadMyTasks,
    completeTask,
    loadStatistics,
    loadWorkflowHistory,
    triggerWorkflow,
    selectWorkflow,
    selectInstance,
    clearError,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};

// =====================================================
// Hook
// =====================================================

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

export type {
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowTask,
  WorkflowStep,
  WorkflowCondition,
  WorkflowHistoryEntry,
  WorkflowStatistics
};
