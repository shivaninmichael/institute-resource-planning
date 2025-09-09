import React, { useState, useEffect } from 'react';
import { X, Save, Heart, DollarSign, Calendar, User } from 'lucide-react';
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

interface Alumni {
  id: number;
  graduation_year: number;
  degree?: string;
  current_company?: string;
  current_position?: string;
  student_first_name?: string;
  student_last_name?: string;
  partner_name?: string;
}

interface AlumniDonation {
  id?: number;
  alumni_id: number;
  donation_date: string;
  amount: number;
  purpose?: string;
  payment_method?: string;
  transaction_id?: string;
  tax_receipt_no?: string;
  status: 'pending' | 'completed' | 'failed';
  anonymous: boolean;
  notes?: string;
}

interface AlumniDonationFormProps {
  donation?: AlumniDonation | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlumniDonationForm: React.FC<AlumniDonationFormProps> = ({ donation, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AlumniDonation>({
    alumni_id: 0,
    donation_date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'pending',
    anonymous: false
  });
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlumni();
    if (donation) {
      setFormData(donation);
    }
  }, [donation]);

  const loadAlumni = async () => {
    try {
      const data = await (api as any).alumni.getAllAlumni();
      setAlumni(data);
    } catch (error) {
      console.error('Error loading alumni:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (donation?.id) {
        await (api as any).alumni.updateAlumniDonation(donation.id, formData);
        toast.success('Donation updated successfully');
      } else {
        await (api as any).alumni.createAlumniDonation(formData);
        toast.success('Donation recorded successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving donation:', error);
      toast.error('Failed to save donation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AlumniDonation, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedAlumnus = () => {
    return alumni.find(a => a.id === formData.alumni_id);
  };

  const paymentMethods = [
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Check',
    'Cash',
    'Online Payment',
    'Other'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>{donation?.id ? 'Edit Donation' : 'Record New Donation'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Donor Information</span>
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="alumni_id">Alumni Donor *</Label>
                <Select 
                  value={formData.alumni_id?.toString() || ''} 
                  onValueChange={(value) => handleChange('alumni_id', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alumni donor" />
                  </SelectTrigger>
                  <SelectContent>
                    {alumni.map((alumnus) => (
                      <SelectItem key={alumnus.id} value={alumnus.id.toString()}>
                        {alumnus.student_first_name && alumnus.student_last_name 
                          ? `${alumnus.student_first_name} ${alumnus.student_last_name}`
                          : alumnus.partner_name || 'Alumni'
                        } (Class of {alumnus.graduation_year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getSelectedAlumnus() && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <p><strong>Name:</strong> {getSelectedAlumnus()?.student_first_name} {getSelectedAlumnus()?.student_last_name || getSelectedAlumnus()?.partner_name}</p>
                    <p><strong>Graduation Year:</strong> {getSelectedAlumnus()?.graduation_year}</p>
                    {getSelectedAlumnus()?.degree && <p><strong>Degree:</strong> {getSelectedAlumnus()?.degree}</p>}
                    {getSelectedAlumnus()?.current_company && <p><strong>Company:</strong> {getSelectedAlumnus()?.current_company}</p>}
                    {getSelectedAlumnus()?.current_position && <p><strong>Position:</strong> {getSelectedAlumnus()?.current_position}</p>}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous">Anonymous Donation</Label>
                  <p className="text-sm text-gray-500">
                    Hide donor identity in public records
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => handleChange('anonymous', checked)}
                />
              </div>
            </div>

            {/* Donation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Donation Details</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Donation Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donation_date">Donation Date *</Label>
                  <Input
                    id="donation_date"
                    type="date"
                    value={formData.donation_date}
                    onChange={(e) => handleChange('donation_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Donation Purpose</Label>
                <Input
                  id="purpose"
                  value={formData.purpose || ''}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="e.g., Scholarship Fund, Building Fund, General"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Payment Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select 
                    value={formData.payment_method || ''} 
                    onValueChange={(value) => handleChange('payment_method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Payment Status</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_id">Transaction ID</Label>
                  <Input
                    id="transaction_id"
                    value={formData.transaction_id || ''}
                    onChange={(e) => handleChange('transaction_id', e.target.value)}
                    placeholder="Payment transaction reference"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_receipt_no">Tax Receipt Number</Label>
                  <Input
                    id="tax_receipt_no"
                    value={formData.tax_receipt_no || ''}
                    onChange={(e) => handleChange('tax_receipt_no', e.target.value)}
                    placeholder="Tax receipt number"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional notes about the donation"
                  rows={3}
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
                <span>{loading ? 'Saving...' : 'Save Donation'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniDonationForm;
