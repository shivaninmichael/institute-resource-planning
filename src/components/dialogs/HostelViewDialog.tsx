import React from 'react';
import { X, Building2, MapPin, Users, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Hostel {
  id: number;
  name: string;
  code: string;
  type: string;
  address: string;
  capacity: number;
  current_occupancy: number;
  status: string;
  description?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at: string;
  updated_at?: string;
}

interface HostelViewDialogProps {
  hostel: Hostel;
  onClose: () => void;
}

const HostelViewDialog: React.FC<HostelViewDialogProps> = ({ hostel, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'boys': return 'bg-blue-100 text-blue-800';
      case 'girls': return 'bg-pink-100 text-pink-800';
      case 'mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const occupancyPercentage = hostel.capacity > 0 ? (hostel.current_occupancy / hostel.capacity) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Hostel Details</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Information */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{hostel.name}</h2>
              <p className="text-gray-600">Code: {hostel.code}</p>
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(hostel.type)}>
                  {hostel.type.charAt(0).toUpperCase() + hostel.type.slice(1)} Hostel
                </Badge>
                <Badge className={getStatusColor(hostel.status)}>
                  {hostel.status.charAt(0).toUpperCase() + hostel.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Hostel Name</label>
                  <p className="text-sm">{hostel.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Hostel Code</label>
                  <p className="text-sm">{hostel.code}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <Badge className={getTypeColor(hostel.type)}>
                    {hostel.type.charAt(0).toUpperCase() + hostel.type.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(hostel.status)}>
                    {hostel.status.charAt(0).toUpperCase() + hostel.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {hostel.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm">{hostel.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Full Address</label>
                <p className="text-sm">{hostel.address}</p>
              </div>
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
                  <div className="text-2xl font-bold text-blue-600">{hostel.capacity}</div>
                  <div className="text-sm text-gray-500">Total Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{hostel.current_occupancy}</div>
                  <div className="text-sm text-gray-500">Current Occupancy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{hostel.capacity - hostel.current_occupancy}</div>
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
                      occupancyPercentage >= 90 ? 'bg-red-500' :
                      occupancyPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(hostel.contact_person || hostel.contact_phone || hostel.contact_email) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostel.contact_person && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-sm">{hostel.contact_person}</p>
                    </div>
                  )}
                  {hostel.contact_phone && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm">{hostel.contact_phone}</p>
                    </div>
                  )}
                  {hostel.contact_email && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm">{hostel.contact_email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Timestamps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{new Date(hostel.created_at).toLocaleString()}</p>
                </div>
                {hostel.updated_at && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm">{new Date(hostel.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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

export default HostelViewDialog;
