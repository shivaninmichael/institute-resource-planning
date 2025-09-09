import React, { useState, useEffect } from 'react';
import { X, Save, Users } from 'lucide-react';
import { 
  Button, 
  Input, 
  Label, 
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

interface RoomAllocation {
  id?: number;
  room_id: number;
  student_id: number;
  allocation_date: string;
  status: string;
  notes?: string;
}

interface Room {
  id: number;
  room_number: string;
  hostel_name: string;
  capacity: number;
  current_occupancy: number;
  status: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  gr_no: string;
  course_name?: string;
}

interface RoomAllocationFormProps {
  allocation?: RoomAllocation | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoomAllocationForm: React.FC<RoomAllocationFormProps> = ({ allocation, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RoomAllocation>({
    room_id: 0,
    student_id: 0,
    allocation_date: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: ''
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRooms();
    loadStudents();
    if (allocation) {
      setFormData(allocation);
    }
  }, [allocation]);

  const loadRooms = async () => {
    try {
      const data = await api.hostel.getAllRooms();
      // Filter only available rooms
      const availableRooms = data.filter((room: any) => 
        room.status === 'available' || room.status === 'occupied'
      );
      setRooms(availableRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await api.students.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (allocation?.id) {
        await api.hostel.updateRoomAllocation(allocation.id, formData);
        toast.success('Room allocation updated successfully');
      } else {
        await api.hostel.createRoomAllocation(formData);
        toast.success('Room allocated successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving room allocation:', error);
      toast.error('Failed to save room allocation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof RoomAllocation, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedRoom = rooms.find(room => room.id === formData.room_id);
  const selectedStudent = students.find(student => student.id === formData.student_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{allocation?.id ? 'Edit Room Allocation' : 'Allocate Room'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Allocation Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Allocation Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="room_id">Room *</Label>
                <Select 
                  value={formData.room_id.toString()} 
                  onValueChange={(value: string) => handleChange('room_id', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.room_number} - {room.hostel_name} 
                        ({room.current_occupancy}/{room.capacity} occupied)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRoom && (
                  <p className="text-sm text-gray-600">
                    Available capacity: {selectedRoom.capacity - selectedRoom.current_occupancy} beds
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_id">Student *</Label>
                <Select 
                  value={formData.student_id.toString()} 
                  onValueChange={(value: string) => handleChange('student_id', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.first_name} {student.last_name} ({student.gr_no})
                        {student.course_name && ` - ${student.course_name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStudent && (
                  <p className="text-sm text-gray-600">
                    Student: {selectedStudent.first_name} {selectedStudent.last_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allocation_date">Allocation Date *</Label>
                  <Input
                    id="allocation_date"
                    type="date"
                    value={formData.allocation_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('allocation_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: string) => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="transferred">Transferred</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('notes', e.target.value)}
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>

            {/* Allocation Summary */}
            {selectedRoom && selectedStudent && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Allocation Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Room:</span> {selectedRoom.room_number}
                  </div>
                  <div>
                    <span className="font-medium">Hostel:</span> {selectedRoom.hostel_name}
                  </div>
                  <div>
                    <span className="font-medium">Student:</span> {selectedStudent.first_name} {selectedStudent.last_name}
                  </div>
                  <div>
                    <span className="font-medium">GR No:</span> {selectedStudent.gr_no}
                  </div>
                  <div>
                    <span className="font-medium">Allocation Date:</span> {formData.allocation_date}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {formData.status}
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
                <span>{loading ? 'Saving...' : 'Save Allocation'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomAllocationForm;
