import React from 'react';
import { X, Bed, Building2, Users, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Room {
  id: number;
  hostel_id: number;
  room_number: string;
  category_id: number;
  capacity: number;
  current_occupancy: number;
  status: string;
  description?: string;
  floor?: number;
  block?: string;
  hostel_name: string;
  category_name: string;
  created_at?: string;
  updated_at?: string;
}

interface RoomViewDialogProps {
  room: Room;
  onClose: () => void;
}

const RoomViewDialog: React.FC<RoomViewDialogProps> = ({ room, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const occupancyPercentage = room.capacity > 0 ? (room.current_occupancy / room.capacity) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Bed className="h-5 w-5" />
            <span>Room Details</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Information */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Room {room.room_number}</h2>
              <p className="text-gray-600">{room.hostel_name}</p>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(room.status)}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bed className="h-4 w-4" />
                <span>Room Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Room Number</label>
                  <p className="text-sm">{room.room_number}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Hostel</label>
                  <p className="text-sm">{room.hostel_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-sm">{room.category_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </Badge>
                </div>
                {room.floor && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Floor</label>
                    <p className="text-sm">{room.floor}</p>
                  </div>
                )}
                {room.block && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Block</label>
                    <p className="text-sm">{room.block}</p>
                  </div>
                )}
              </div>
              
              {room.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm">{room.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capacity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Capacity & Occupancy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{room.capacity}</div>
                  <div className="text-sm text-gray-500">Total Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{room.current_occupancy}</div>
                  <div className="text-sm text-gray-500">Current Occupancy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{room.capacity - room.current_occupancy}</div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy Rate</span>
                  <span>{occupancyPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      occupancyPercentage >= 100 ? 'bg-red-500' :
                      occupancyPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Hostel</label>
                  <p className="text-sm">{room.hostel_name}</p>
                </div>
                {room.floor && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Floor</label>
                    <p className="text-sm">Floor {room.floor}</p>
                  </div>
                )}
                {room.block && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Block</label>
                    <p className="text-sm">{room.block}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Room Number</label>
                  <p className="text-sm">{room.room_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          {room.created_at && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Timestamps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm">{new Date(room.created_at).toLocaleString()}</p>
                  </div>
                  {room.updated_at && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm">{new Date(room.updated_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomViewDialog;
