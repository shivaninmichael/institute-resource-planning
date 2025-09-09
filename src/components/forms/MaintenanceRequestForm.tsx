import React, { useState, useEffect } from 'react';
import { X, Save, Wrench } from 'lucide-react';
import { 
  Button, 
  Input, 
  Label, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../ui';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';


interface MaintenanceRequestFormData {
  id?: number;
  title?: string;
  description: string;
  hostel_id: number;
  room_id: number;
  priority: string;
  status: string;
  requested_date: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string;
  notes?: string;
}

interface MaintenanceRequest extends MaintenanceRequestFormData {
  id?: number;
  requested_date: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string;
  notes?: string;
}

interface Hostel {
  id: number;
  name: string;
  code: string;
}

interface Room {
  id: number;
  room_number: string;
  hostel_id: number;
  hostel_name: string;
}

interface MaintenanceRequestFormProps {
  request?: MaintenanceRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({ request, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<any>({
    id: 0,
    title: '',
    hostel_id: 0,
    room_id: 0,
    description: '',
    priority: 'medium',
    status: 'pending',
    requested_date: new Date().toISOString().split('T')[0],
    completed_date: '',
    estimated_cost: 0,
    actual_cost: 0,
    assigned_to: '',
    notes: ''
  });
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHostels();
    if (request) {
      setFormData(request);
      if ((request as any).hostel_id) {
        loadRooms((request as any).hostel_id);
      }
    }
  }, [request]);

  const loadHostels = async () => {
    try {
      const data = await api.hostel.getAllHostels();
      setHostels(data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    }
  };

  const loadRooms = async (hostelId: number) => {
    try {
      const data = await api.hostel.getAllRooms();
      const hostelRooms = data.filter((room: any) => room.hostel_id === hostelId);
      setRooms(hostelRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (request?.id) {
        await api.hostel.updateMaintenanceRequest(request.id, formData);
        toast.success('Maintenance request updated successfully');
      } else {
        await api.hostel.createMaintenanceRequest(formData);
        toast.success('Maintenance request created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving maintenance request:', error);
      toast.error('Failed to save maintenance request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));

    // Load rooms when hostel changes
    if (field === 'hostel_id' && typeof value === 'number') {
      loadRooms(value);
      setFormData((prev: any) => ({
        ...prev,
        room_id: 0 // Reset room selection
      }));
    }
  };

  const selectedHostel = hostels.find(hostel => hostel.id === formData.hostel_id);
  const selectedRoom = rooms.find(room => room.id === formData.room_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>{request?.id ? 'Edit Maintenance Request' : 'Create Maintenance Request'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Request Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter maintenance request title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the maintenance issue in detail"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hostel_id">Hostel *</Label>
                  <Select 
                    value={formData.hostel_id.toString()} 
                    onValueChange={(value) => handleChange('hostel_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostels.map((hostel) => (
                        <SelectItem key={hostel.id} value={hostel.id.toString()}>
                          {hostel.name} ({hostel.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room_id">Room (Optional)</Label>
                  <Select 
                    value={formData.room_id?.toString() || ''} 
                    onValueChange={(value) => handleChange('room_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">General Area</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          Room {room.room_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => handleChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Dates and Costs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline & Costs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requested_date">Requested Date *</Label>
                  <Input
                    id="requested_date"
                    type="date"
                    value={formData.requested_date}
                    onChange={(e) => handleChange('requested_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completed_date">Completed Date</Label>
                  <Input
                    id="completed_date"
                    type="date"
                    value={formData.completed_date || ''}
                    onChange={(e) => handleChange('completed_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Estimated Cost</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.estimated_cost || ''}
                    onChange={(e) => handleChange('estimated_cost', parseFloat(e.target.value) || 0)}
                    placeholder="Enter estimated cost"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual_cost">Actual Cost</Label>
                  <Input
                    id="actual_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.actual_cost || ''}
                    onChange={(e) => handleChange('actual_cost', parseFloat(e.target.value) || 0)}
                    placeholder="Enter actual cost"
                  />
                </div>
              </div>
            </div>

            {/* Assignment and Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignment & Notes</h3>
              
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to || ''}
                  onChange={(e) => handleChange('assigned_to', e.target.value)}
                  placeholder="Enter assigned person/team"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>

            {/* Request Summary */}
            {selectedHostel && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Request Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Hostel:</span> {selectedHostel.name}
                  </div>
                  <div>
                    <span className="font-medium">Room:</span> {selectedRoom ? `Room ${selectedRoom.room_number}` : 'General Area'}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span> {formData.priority}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {formData.status}
                  </div>
                  <div>
                    <span className="font-medium">Requested:</span> {formData.requested_date}
                  </div>
                  <div>
                    <span className="font-medium">Assigned:</span> {formData.assigned_to || 'Not assigned'}
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Request'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceRequestForm;
