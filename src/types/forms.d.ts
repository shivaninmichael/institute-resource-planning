import { Status, Role } from './models';

// Common Form Props
export interface BaseFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
}

// Form Data Types
export interface MaintenanceRequestFormData {
  hostel_id: number;
  room_id: number;
  issue_type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  requested_by: number;
  status: Status;
}

export interface MentorshipProgramFormData {
  title: string;
  description: string;
  mentor_id: number;
  mentee_id: number;
  start_date: string;
  end_date: string;
  goals: string[];
  status: Status;
}

export interface RoomFormData {
  hostel_id: number;
  room_number: string;
  capacity: number;
  type: string;
  floor: number;
  status: Status;
  facilities: string[];
}

export interface VehicleFormData {
  name: string;
  vehicle_no: string;
  type: string;
  capacity: string;
  make: string;
  model: string;
  year: string;
  registration_date: string;
  insurance_expiry: string;
  fitness_expiry: string;
  permit_expiry: string;
  gps_device_id: string;
  fuel_type: string;
  fuel_capacity: string;
  mileage: string;
  status: Status;
}

export interface VisitorLogFormData {
  visitor_name: string;
  purpose: string;
  contact_number: string;
  id_proof_type: string;
  id_proof_number: string;
  visit_date: string;
  check_in_time: string;
  check_out_time?: string;
  host_id: number;
  hostel_id: number;
  room_id: number;
  status: Status;
}

export interface PayrollFormData {
  employee_id: number;
  pay_period_start: Date | undefined;
  pay_period_end: Date | undefined;
  basic_salary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  net_salary: number;
  payment_method: string;
  status: Status;
}

export interface StaffFormData {
  name: string;
  employee_id: string;
  department_id: number;
  role: Role;
  hire_date: Date | undefined;
  email: string;
  phone: string;
  status: Status;
}

// Form Props Types
export interface MaintenanceRequestFormProps extends BaseFormProps {
  onSubmit: (data: MaintenanceRequestFormData) => void;
  initialData?: MaintenanceRequestFormData;
}

export interface MentorshipProgramFormProps extends BaseFormProps {
  onSubmit: (data: MentorshipProgramFormData) => void;
  initialData?: MentorshipProgramFormData;
}

export interface RoomFormProps extends BaseFormProps {
  onSubmit: (data: RoomFormData) => void;
  initialData?: RoomFormData;
}

export interface VehicleFormProps extends BaseFormProps {
  onSubmit: (data: VehicleFormData) => void;
  initialData?: VehicleFormData;
}

export interface VisitorLogFormProps extends BaseFormProps {
  onSubmit: (data: VisitorLogFormData) => void;
  initialData?: VisitorLogFormData;
}

export interface PayrollFormProps extends BaseFormProps {
  onSubmit: (data: PayrollFormData) => void;
  initialData?: PayrollFormData;
}

export interface StaffFormProps extends BaseFormProps {
  onSubmit: (data: StaffFormData) => void;
  initialData?: StaffFormData;
}
