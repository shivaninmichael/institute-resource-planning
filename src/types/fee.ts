export interface Fee {
  id: string;
  name: string;
  student: string;
  course: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  category: string;
  studentId: string;
  studentName: string;
  feeType: string;
  paidAmount: number;
  createdAt: string;
}

export interface FeeFormData {
  name: string;
  studentId: string;
  courseId: string;
  amount: number;
  dueDate: Date | undefined;
  category: string;
  description?: string;
  recurring?: boolean;
  recurringPeriod?: 'monthly' | 'quarterly' | 'yearly';
  discountAmount?: number;
  discountType?: 'percentage' | 'fixed';
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
}

export interface FeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FeeFormData) => void;
  fee?: FeeFormData;
  title?: string;
}
