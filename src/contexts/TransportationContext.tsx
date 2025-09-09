import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { transportationAPI } from '../services/api';

// Types
interface Vehicle {
  id: number;
  name: string;
  vehicle_no: string;
  type: string;
  capacity: number;
  make?: string;
  model?: string;
  year?: number;
  status: string;
  driver_name?: string;
  route_name?: string;
  next_maintenance_date?: string;
}

interface Driver {
  id: number;
  partner_id: number;
  license_no: string;
  license_type?: string;
  license_expiry?: string;
  experience_years?: number;
  status: string;
  driver_name?: string;
}

interface Route {
  id: number;
  name: string;
  code: string;
  start_point: string;
  end_point: string;
  distance?: number;
  estimated_time?: number;
  type?: string;
  stops?: RouteStop[];
  total_students?: number;
}

interface RouteStop {
  id: number;
  route_id: number;
  name: string;
  sequence: number;
  latitude?: number;
  longitude?: number;
  morning_time?: string;
  evening_time?: string;
}

interface StudentTransport {
  id: number;
  student_id: number;
  route_id: number;
  route_stop_id: number;
  pickup_type: string;
  start_date: string;
  end_date?: string;
  fee_amount?: number;
  status: string;
  student_name: string;
  route_name: string;
  stop_name: string;
}

interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  maintenance_type: string;
  description?: string;
  scheduled_date?: string;
  completion_date?: string;
  cost?: number;
  status: string;
  vehicle_name?: string;
  vehicle_no?: string;
}

interface DashboardStats {
  total_vehicles: number;
  active_vehicles: number;
  vehicles_in_maintenance: number;
  total_drivers: number;
  active_drivers: number;
  total_routes: number;
  total_students_using_transport: number;
  pending_maintenance: number;
}

interface TransportationState {
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: Route[];
  studentTransports: StudentTransport[];
  maintenanceRecords: MaintenanceRecord[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

type TransportationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VEHICLES'; payload: Vehicle[] }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'DELETE_VEHICLE'; payload: number }
  | { type: 'SET_DRIVERS'; payload: Driver[] }
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'SET_ROUTES'; payload: Route[] }
  | { type: 'ADD_ROUTE'; payload: Route }
  | { type: 'SET_STUDENT_TRANSPORTS'; payload: StudentTransport[] }
  | { type: 'ADD_STUDENT_TRANSPORT'; payload: StudentTransport }
  | { type: 'SET_MAINTENANCE_RECORDS'; payload: MaintenanceRecord[] }
  | { type: 'ADD_MAINTENANCE_RECORD'; payload: MaintenanceRecord }
  | { type: 'UPDATE_MAINTENANCE_RECORD'; payload: MaintenanceRecord }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: TransportationState = {
  vehicles: [],
  drivers: [],
  routes: [],
  studentTransports: [],
  maintenanceRecords: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

function transportationReducer(state: TransportationState, action: TransportationAction): TransportationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload, loading: false };
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v)
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(v => v.id !== action.payload)
      };
    case 'SET_DRIVERS':
      return { ...state, drivers: action.payload, loading: false };
    case 'ADD_DRIVER':
      return { ...state, drivers: [...state.drivers, action.payload] };
    case 'SET_ROUTES':
      return { ...state, routes: action.payload, loading: false };
    case 'ADD_ROUTE':
      return { ...state, routes: [...state.routes, action.payload] };
    case 'SET_STUDENT_TRANSPORTS':
      return { ...state, studentTransports: action.payload, loading: false };
    case 'ADD_STUDENT_TRANSPORT':
      return { ...state, studentTransports: [...state.studentTransports, action.payload] };
    case 'SET_MAINTENANCE_RECORDS':
      return { ...state, maintenanceRecords: action.payload, loading: false };
    case 'ADD_MAINTENANCE_RECORD':
      return { ...state, maintenanceRecords: [...state.maintenanceRecords, action.payload] };
    case 'UPDATE_MAINTENANCE_RECORD':
      return {
        ...state,
        maintenanceRecords: state.maintenanceRecords.map(m => 
          m.id === action.payload.id ? action.payload : m
        )
      };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload, loading: false };
    default:
      return state;
  }
}

interface TransportationContextType {
  state: TransportationState;
  // Vehicle actions
  fetchVehicles: () => Promise<void>;
  createVehicle: (vehicleData: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: number, vehicleData: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  // Driver actions
  fetchDrivers: () => Promise<void>;
  createDriver: (driverData: Omit<Driver, 'id'>) => Promise<void>;
  // Route actions
  fetchRoutes: () => Promise<void>;
  createRoute: (routeData: Omit<Route, 'id' | 'stops'>) => Promise<void>;
  createRouteStop: (stopData: Omit<RouteStop, 'id'>) => Promise<void>;
  // Student transport actions
  fetchStudentTransports: () => Promise<void>;
  createStudentTransport: (transportData: Omit<StudentTransport, 'id' | 'student_name' | 'route_name' | 'stop_name'>) => Promise<void>;
  // Maintenance actions
  fetchMaintenanceRecords: () => Promise<void>;
  createMaintenanceRecord: (maintenanceData: Omit<MaintenanceRecord, 'id' | 'vehicle_name' | 'vehicle_no'>) => Promise<void>;
  updateMaintenanceStatus: (id: number, status: MaintenanceRecord['status']) => Promise<void>;
  // Dashboard actions
  fetchDashboardStats: () => Promise<void>;
}

const TransportationContext = createContext<TransportationContextType | undefined>(undefined);

export const useTransportation = () => {
  const context = useContext(TransportationContext);
  if (context === undefined) {
    throw new Error('useTransportation must be used within a TransportationProvider');
  }
  return context;
};

interface TransportationProviderProps {
  children: ReactNode;
}

export const TransportationProvider: React.FC<TransportationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(transportationReducer, initialState);

  // Vehicle actions
  const fetchVehicles = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await transportationAPI.getVehicles();
      dispatch({ type: 'SET_VEHICLES', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch vehicles' });
    }
  };

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const response = await transportationAPI.createVehicle(vehicleData);
      dispatch({ type: 'ADD_VEHICLE', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create vehicle' });
      throw error;
    }
  };

  const updateVehicle = async (id: number, vehicleData: Partial<Vehicle>) => {
    try {
      const response = await transportationAPI.updateVehicle(id, vehicleData);
      dispatch({ type: 'UPDATE_VEHICLE', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update vehicle' });
      throw error;
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      await transportationAPI.deleteVehicle(id);
      dispatch({ type: 'DELETE_VEHICLE', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete vehicle' });
      throw error;
    }
  };

  // Driver actions
  const fetchDrivers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await transportationAPI.getDrivers();
      dispatch({ type: 'SET_DRIVERS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch drivers' });
    }
  };

  const createDriver = async (driverData: Omit<Driver, 'id'>) => {
    try {
      const response = await transportationAPI.createDriver(driverData);
      dispatch({ type: 'ADD_DRIVER', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create driver' });
      throw error;
    }
  };

  // Route actions
  const fetchRoutes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await transportationAPI.getRoutes();
      dispatch({ type: 'SET_ROUTES', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch routes' });
    }
  };

  const createRoute = async (routeData: Omit<Route, 'id' | 'stops'>) => {
    try {
      const response = await transportationAPI.createRoute(routeData);
      dispatch({ type: 'ADD_ROUTE', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create route' });
      throw error;
    }
  };

  const createRouteStop = async (stopData: Omit<RouteStop, 'id'>) => {
    try {
      await transportationAPI.createRouteStop(stopData);
      // Refresh routes to get updated stops
      await fetchRoutes();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create route stop' });
      throw error;
    }
  };

  // Student transport actions
  const fetchStudentTransports = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await transportationAPI.getStudentTransports();
      dispatch({ type: 'SET_STUDENT_TRANSPORTS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch student transports' });
    }
  };

  const createStudentTransport = async (transportData: Omit<StudentTransport, 'id' | 'student_name' | 'route_name' | 'stop_name'>) => {
    try {
      const response = await transportationAPI.createStudentTransport(transportData);
      dispatch({ type: 'ADD_STUDENT_TRANSPORT', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create student transport' });
      throw error;
    }
  };

  // Maintenance actions
  const fetchMaintenanceRecords = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await transportationAPI.getMaintenanceRecords();
      dispatch({ type: 'SET_MAINTENANCE_RECORDS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch maintenance records' });
    }
  };

  const createMaintenanceRecord = async (maintenanceData: Omit<MaintenanceRecord, 'id' | 'vehicle_name' | 'vehicle_no'>) => {
    try {
      const response = await transportationAPI.createMaintenanceRecord(maintenanceData);
      dispatch({ type: 'ADD_MAINTENANCE_RECORD', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create maintenance record' });
      throw error;
    }
  };

  const updateMaintenanceStatus = async (id: number, status: MaintenanceRecord['status']) => {
    try {
      const response = await transportationAPI.updateMaintenanceStatus(id, status);
      dispatch({ type: 'UPDATE_MAINTENANCE_RECORD', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update maintenance status' });
      throw error;
    }
  };

  // Dashboard actions
  const fetchDashboardStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await transportationAPI.getDashboardStats();
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch dashboard stats' });
    }
  };

  const value: TransportationContextType = {
    state,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    fetchDrivers,
    createDriver,
    fetchRoutes,
    createRoute,
    createRouteStop,
    fetchStudentTransports,
    createStudentTransport,
    fetchMaintenanceRecords,
    createMaintenanceRecord,
    updateMaintenanceStatus,
    fetchDashboardStats,
  };

  return (
    <TransportationContext.Provider value={value}>
      {children}
    </TransportationContext.Provider>
  );
};
