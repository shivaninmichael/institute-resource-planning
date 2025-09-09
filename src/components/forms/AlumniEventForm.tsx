import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
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
  Switch,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../ui';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface AlumniEvent {
  id?: number;
  name: string;
  event_type: 'reunion' | 'workshop' | 'seminar' | 'networking' | 'conference' | 'other';
  description?: string;
  start_datetime: string;
  end_datetime: string;
  venue?: string;
  capacity?: number;
  registration_deadline?: string;
  registration_fee?: number;
  organizer_id?: number;
  agenda?: string;
  special_guests?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  active: boolean;
}

interface Partner {
  id: number;
  name: string;
  email: string;
}

interface AlumniEventFormProps {
  event?: AlumniEvent | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlumniEventForm: React.FC<AlumniEventFormProps> = ({ event, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AlumniEvent>({
    name: '',
    event_type: 'reunion',
    start_datetime: '',
    end_datetime: '',
    status: 'upcoming',
    active: true,
    special_guests: []
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestInput, setGuestInput] = useState('');

  useEffect(() => {
    loadPartners();
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const loadPartners = async () => {
    try {
      const data = await (api as any).partner.getAllPartners();
      setPartners(data);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (event?.id) {
        await (api as any).alumni.updateAlumniEvent(event.id, formData);
        toast.success('Event updated successfully');
      } else {
        await (api as any).alumni.createAlumniEvent(formData);
        toast.success('Event created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AlumniEvent, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addGuest = () => {
    if (guestInput.trim()) {
      const newGuests = [...(formData.special_guests || []), guestInput.trim()];
      handleChange('special_guests', newGuests);
      setGuestInput('');
    }
  };

  const removeGuest = (index: number) => {
    const newGuests = formData.special_guests?.filter((_, i) => i !== index) || [];
    handleChange('special_guests', newGuests);
  };

  const eventTypes = [
    { value: 'reunion', label: 'Reunion' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'networking', label: 'Networking' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{event?.id ? 'Edit Event' : 'Create New Event'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter event name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_type">Event Type *</Label>
                    <Select 
                      value={formData.event_type} 
                      onValueChange={(value) => handleChange('event_type', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleChange('status', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Date and Time</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_datetime">Start Date & Time *</Label>
                  <Input
                    id="start_datetime"
                    type="datetime-local"
                    value={formData.start_datetime}
                    onChange={(e) => handleChange('start_datetime', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_datetime">End Date & Time *</Label>
                  <Input
                    id="end_datetime"
                    type="datetime-local"
                    value={formData.end_datetime}
                    onChange={(e) => handleChange('end_datetime', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input
                  id="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline || ''}
                  onChange={(e) => handleChange('registration_deadline', e.target.value)}
                />
              </div>
            </div>

            {/* Venue and Capacity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Venue and Capacity</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue || ''}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    placeholder="Event venue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity || ''}
                    onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                    placeholder="Maximum attendees"
                  />
                </div>
              </div>
            </div>

            {/* Registration and Fees */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Registration and Fees</span>
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="registration_fee">Registration Fee</Label>
                <Input
                  id="registration_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.registration_fee || ''}
                  onChange={(e) => handleChange('registration_fee', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500">Leave empty for free events</p>
              </div>
            </div>

            {/* Organizer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Organizer</span>
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="organizer_id">Event Organizer</Label>
                <Select 
                  value={formData.organizer_id?.toString() || ''} 
                  onValueChange={(value) => handleChange('organizer_id', value ? parseInt(value) : 0)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organizer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Organizer</SelectItem>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id.toString()}>
                        {partner.name} ({partner.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Guests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Special Guests</h3>
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={guestInput}
                    onChange={(e) => setGuestInput(e.target.value)}
                    placeholder="Add special guest"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGuest())}
                  />
                  <Button type="button" onClick={addGuest} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.special_guests?.map((guest, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      <span>{guest}</span>
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Agenda</h3>
              
              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda || ''}
                  onChange={(e) => handleChange('agenda', e.target.value)}
                  placeholder="Enter event agenda or schedule"
                  rows={4}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Status</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active</Label>
                  <p className="text-sm text-gray-500">
                    Event is active and visible to alumni
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleChange('active', checked)}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Event'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniEventForm;
