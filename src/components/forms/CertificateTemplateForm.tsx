import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Upload, Image } from 'lucide-react';
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

interface CertificateTemplate {
  id?: number;
  name: string;
  certificate_type_id: number;
  template_data: any;
  background_image?: string;
  signature_image?: string;
  seal_image?: string;
  font_family: string;
  font_size: number;
  active: boolean;
}

interface CertificateType {
  id: number;
  name: string;
  code: string;
}

interface CertificateTemplateFormProps {
  template?: CertificateTemplate | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CertificateTemplateForm: React.FC<CertificateTemplateFormProps> = ({ template, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CertificateTemplate>({
    name: '',
    certificate_type_id: 0,
    template_data: {
      layout: 'portrait',
      title: 'CERTIFICATE',
      subtitle: 'This is to certify that',
      signature_line: 'Principal',
      seal_position: 'bottom_right'
    },
    background_image: '',
    signature_image: '',
    seal_image: '',
    font_family: 'Arial',
    font_size: 12,
    active: true
  });
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCertificateTypes();
    if (template) {
      setFormData(template);
    }
  }, [template]);

  const loadCertificateTypes = async () => {
    try {
      const data = await (api as any).certificate.getAllCertificateTypes();
      setCertificateTypes(data);
    } catch (error) {
      console.error('Error loading certificate types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (template?.id) {
        await (api as any).certificate.updateCertificateTemplate(template.id, formData);
        toast.success('Certificate template updated successfully');
      } else {
        await (api as any).certificate.createCertificateTemplate(formData);
        toast.success('Certificate template created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving certificate template:', error);
      toast.error('Failed to save certificate template');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CertificateTemplate, value: string | number | boolean | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (field: 'background_image' | 'signature_image' | 'seal_image', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleChange(field, result);
    };
    reader.readAsDataURL(file);
  };

  const fontFamilies = [
    'Arial', 'Times New Roman', 'Calibri', 'Georgia', 'Verdana', 
    'Helvetica', 'Courier New', 'Trebuchet MS', 'Arial Black', 'Comic Sans MS'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{template?.id ? 'Edit Certificate Template' : 'Create New Certificate Template'}</span>
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
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter template name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate_type_id">Certificate Type *</Label>
                  <Select 
                    value={formData.certificate_type_id.toString()} 
                    onValueChange={(value) => handleChange('certificate_type_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificateTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name} ({type.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font_family">Font Family *</Label>
                  <Select 
                    value={formData.font_family} 
                    onValueChange={(value) => handleChange('font_family', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font_size">Font Size *</Label>
                  <Input
                    id="font_size"
                    type="number"
                    min="8"
                    max="72"
                    value={formData.font_size}
                    onChange={(e) => handleChange('font_size', parseInt(e.target.value) || 12)}
                    placeholder="Enter font size"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active</Label>
                  <p className="text-sm text-gray-500">
                    Template is active and available for use
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleChange('active', checked)}
                />
              </div>
            </div>

            {/* Template Design */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Template Design</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select 
                    value={formData.template_data.layout} 
                    onValueChange={(value) => handleTemplateDataChange('layout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title</Label>
                  <Input
                    id="title"
                    value={formData.template_data.title}
                    onChange={(e) => handleTemplateDataChange('title', e.target.value)}
                    placeholder="Enter certificate title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.template_data.subtitle}
                    onChange={(e) => handleTemplateDataChange('subtitle', e.target.value)}
                    placeholder="Enter subtitle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature_line">Signature Line</Label>
                  <Input
                    id="signature_line"
                    value={formData.template_data.signature_line}
                    onChange={(e) => handleTemplateDataChange('signature_line', e.target.value)}
                    placeholder="Enter signature line text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seal_position">Seal Position</Label>
                <Select 
                  value={formData.template_data.seal_position} 
                  onValueChange={(value) => handleTemplateDataChange('seal_position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select seal position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Seal</SelectItem>
                    <SelectItem value="top_left">Top Left</SelectItem>
                    <SelectItem value="top_right">Top Right</SelectItem>
                    <SelectItem value="bottom_left">Bottom Left</SelectItem>
                    <SelectItem value="bottom_right">Bottom Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('background_image', file);
                      }}
                      className="hidden"
                      id="background-upload"
                    />
                    <label htmlFor="background-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Background</p>
                    </label>
                    {formData.background_image && (
                      <div className="mt-2">
                        <Image className="h-4 w-4 mx-auto text-green-500" />
                        <p className="text-xs text-green-500">Image uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Signature Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('signature_image', file);
                      }}
                      className="hidden"
                      id="signature-upload"
                    />
                    <label htmlFor="signature-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Signature</p>
                    </label>
                    {formData.signature_image && (
                      <div className="mt-2">
                        <Image className="h-4 w-4 mx-auto text-green-500" />
                        <p className="text-xs text-green-500">Image uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Seal Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('seal_image', file);
                      }}
                      className="hidden"
                      id="seal-upload"
                    />
                    <label htmlFor="seal-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Seal</p>
                    </label>
                    {formData.seal_image && (
                      <div className="mt-2">
                        <Image className="h-4 w-4 mx-auto text-green-500" />
                        <p className="text-xs text-green-500">Image uploaded</p>
                      </div>
                    )}
                  </div>
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
                <span>{loading ? 'Saving...' : 'Save Template'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateTemplateForm;
