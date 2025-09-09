import React, { useState, useEffect } from 'react';
import { X, Save, Award } from 'lucide-react';
import { 
  Button, 
  Input, 
  Label, 
  Textarea, 
  Switch,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../ui';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface CertificateType {
  id?: number;
  name: string;
  code: string;
  description?: string;
  validity_period: number;
  is_digital: boolean;
  requires_signature: boolean;
  requires_seal: boolean;
  active: boolean;
}

interface CertificateTypeFormProps {
  certificateType?: CertificateType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CertificateTypeForm: React.FC<CertificateTypeFormProps> = ({ certificateType, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CertificateType>({
    name: '',
    code: '',
    description: '',
    validity_period: 365,
    is_digital: true,
    requires_signature: true,
    requires_seal: true,
    active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certificateType) {
      setFormData(certificateType);
    }
  }, [certificateType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (certificateType?.id) {
        await (api as any).certificate.updateCertificateType(certificateType.id, formData);
        toast.success('Certificate type updated successfully');
      } else {
        await (api as any).certificate.createCertificateType(formData);
        toast.success('Certificate type created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving certificate type:', error);
      toast.error('Failed to save certificate type');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CertificateType, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>{certificateType?.id ? 'Edit Certificate Type' : 'Create New Certificate Type'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certificate Type Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter certificate type name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Certificate Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                    placeholder="Enter certificate code (e.g., DEG, DIP)"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter certificate type description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity_period">Validity Period (Days) *</Label>
                <Input
                  id="validity_period"
                  type="number"
                  min="0"
                  value={formData.validity_period}
                  onChange={(e) => handleChange('validity_period', parseInt(e.target.value) || 0)}
                  placeholder="Enter validity period in days"
                  required
                />
                <p className="text-sm text-gray-500">
                  Set to 0 for certificates that never expire
                </p>
              </div>
            </div>

            {/* Certificate Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Certificate Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_digital">Digital Certificate</Label>
                    <p className="text-sm text-gray-500">
                      Enable digital certificate features
                    </p>
                  </div>
                  <Switch
                    id="is_digital"
                    checked={formData.is_digital}
                    onCheckedChange={(checked) => handleChange('is_digital', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requires_signature">Requires Signature</Label>
                    <p className="text-sm text-gray-500">
                      Certificate requires digital signature
                    </p>
                  </div>
                  <Switch
                    id="requires_signature"
                    checked={formData.requires_signature}
                    onCheckedChange={(checked) => handleChange('requires_signature', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requires_seal">Requires Seal</Label>
                    <p className="text-sm text-gray-500">
                      Certificate requires official seal
                    </p>
                  </div>
                  <Switch
                    id="requires_seal"
                    checked={formData.requires_seal}
                    onCheckedChange={(checked) => handleChange('requires_seal', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-gray-500">
                      Certificate type is active and available for use
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleChange('active', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Certificate Type'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateTypeForm;
