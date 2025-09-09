export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'academic' | 'attendance' | 'exam' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
  data?: any;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
  };
  status: 'draft' | 'generated' | 'error';
  error?: string;
}

export interface ReportFormData {
  title: string;
  description: string;
  type: string;
  format: string;
  filters: Record<string, any>;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    recipients?: string[];
  };
}

export interface ReportFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
  report?: ReportFormData;
  title?: string;
}

export interface FinancialReportProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: () => void;
}
