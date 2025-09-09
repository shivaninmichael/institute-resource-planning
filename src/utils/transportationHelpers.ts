// Transportation utility functions and constants

interface StatusOption {
  value: string;
  label: string;
  color?: string;
}

interface VehicleType {
  value: 'bus' | 'van' | 'car' | 'other';
  label: string;
}

interface FuelType {
  value: 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid';
  label: string;
}

interface LicenseType {
  value: 'light_motor_vehicle' | 'heavy_motor_vehicle' | 'transport_vehicle' | 'motorcycle' | 'commercial';
  label: string;
}

interface RouteType {
  value: 'pickup' | 'drop' | 'both';
  label: string;
}

interface VehicleStatus extends StatusOption {
  value: 'active' | 'maintenance' | 'retired';
  color: 'success' | 'warning' | 'error';
}

interface DriverStatus extends StatusOption {
  value: 'active' | 'on_leave' | 'inactive';
  color: 'success' | 'warning' | 'error';
}

interface MaintenanceStatus extends StatusOption {
  value: 'scheduled' | 'in_progress' | 'completed';
  color: 'info' | 'warning' | 'success';
}

interface PickupType {
  value: 'morning' | 'evening' | 'both';
  label: string;
}

interface PaymentTerm {
  value: 'monthly' | 'quarterly' | 'yearly';
  label: string;
}

export const VEHICLE_TYPES: VehicleType[] = [
  { value: 'bus', label: 'Bus' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
  { value: 'other', label: 'Other' },
];

export const FUEL_TYPES: FuelType[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const LICENSE_TYPES: LicenseType[] = [
  { value: 'light_motor_vehicle', label: 'Light Motor Vehicle (LMV)' },
  { value: 'heavy_motor_vehicle', label: 'Heavy Motor Vehicle (HMV)' },
  { value: 'transport_vehicle', label: 'Transport Vehicle' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'commercial', label: 'Commercial' },
];

export const ROUTE_TYPES: RouteType[] = [
  { value: 'pickup', label: 'Pickup Only' },
  { value: 'drop', label: 'Drop Only' },
  { value: 'both', label: 'Both Pickup & Drop' },
];

export const VEHICLE_STATUS: VehicleStatus[] = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'maintenance', label: 'Maintenance', color: 'warning' },
  { value: 'retired', label: 'Retired', color: 'error' },
];

export const DRIVER_STATUS: DriverStatus[] = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'on_leave', label: 'On Leave', color: 'warning' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
];

export const MAINTENANCE_STATUS: MaintenanceStatus[] = [
  { value: 'scheduled', label: 'Scheduled', color: 'info' },
  { value: 'in_progress', label: 'In Progress', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
];

export const PICKUP_TYPES: PickupType[] = [
  { value: 'morning', label: 'Morning Only' },
  { value: 'evening', label: 'Evening Only' },
  { value: 'both', label: 'Both Morning & Evening' },
];

export const PAYMENT_TERMS: PaymentTerm[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

// Utility functions
type StatusType = VehicleStatus['value'] | DriverStatus['value'] | MaintenanceStatus['value'];
type ColorType = VehicleStatus['color'] | DriverStatus['color'] | MaintenanceStatus['color'];

export const getStatusColor = (status: StatusType): ColorType => {
  const statusConfig = [
    ...VEHICLE_STATUS,
    ...DRIVER_STATUS,
    ...MAINTENANCE_STATUS
  ].find(s => s.value === status.toLowerCase());
  
  return statusConfig?.color || 'info';
};

export const formatTime = (time: string): string => {
  if (!time) return 'N/A';
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDistance = (distance: number): string => {
  if (!distance) return 'N/A';
  return `${distance} km`;
};

export const formatDuration = (minutes: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const calculateAge = (dateString: string): number => {
  if (!dateString) return 0;
  const today = new Date();
  const date = new Date(dateString);
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    return age - 1;
  }
  
  return age;
};

export const isExpiringSoon = (dateString: string, daysThreshold: number = 30): boolean => {
  if (!dateString) return false;
  
  const expiryDate = new Date(dateString);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= daysThreshold && diffDays >= 0;
};

export const isExpired = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const expiryDate = new Date(dateString);
  const today = new Date();
  
  return expiryDate < today;
};

export const generateVehicleCode = (type: string, index: number): string => {
  const typeCode = type.substring(0, 3).toUpperCase();
  return `${typeCode}${String(index).padStart(3, '0')}`;
};

export const generateRouteCode = (name: string, index: number): string => {
  const nameCode = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  return `${nameCode}${String(index).padStart(3, '0')}`;
};

export const validateVehicleNumber = (vehicleNumber: string): boolean => {
  // Basic Indian vehicle number format validation
  const pattern = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
  return pattern.test(vehicleNumber.replace(/\s/g, ''));
};

export const validateLicenseNumber = (licenseNumber: string): boolean => {
  // Basic Indian driving license format validation
  const pattern = /^[A-Z]{2}[0-9]{13}$/;
  return pattern.test(licenseNumber.replace(/\s|-/g, ''));
};

export const formatVehicleNumber = (vehicleNumber: string): string => {
  // Format vehicle number with proper spacing
  const clean = vehicleNumber.replace(/\s/g, '');
  if (clean.length >= 10) {
    return `${clean.substring(0, 2)} ${clean.substring(2, 4)} ${clean.substring(4, 6)} ${clean.substring(6)}`;
  }
  return vehicleNumber;
};

export const formatLicenseNumber = (licenseNumber: string): string => {
  // Format license number with proper spacing
  const clean = licenseNumber.replace(/\s|-/g, '');
  if (clean.length >= 15) {
    return `${clean.substring(0, 2)}-${clean.substring(2)}`;
  }
  return licenseNumber;
};
