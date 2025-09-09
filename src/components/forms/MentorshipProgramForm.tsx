import React, { useState, useEffect } from 'react';
import { X, Save, Users, Calendar, FileText } from 'lucide-react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Switch, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';
import { ApiClient } from '../../types/api';

const typedApi = api as unknown as ApiClient;

interface MentorshipProgram {
  id?: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  max_mentees?: number;
  status: 'active' | 'completed' | 'cancelled';
  guidelines?: string;
  requirements?: string;
  active: boolean;
}

interface MentorshipProgramFormProps {
  program?: MentorshipProgram | null;
  onClose: () => void;
  onSuccess: () => void;
}

const MentorshipProgramForm: React.FC<MentorshipProgramFormProps> = ({ program, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<MentorshipProgram>({
    name: '',
    start_date: new Date().toISOString().split('T')[0],
    status: 'active',
    active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (program) {
      setFormData(program);
    }
  }, [program]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (program?.id) {
        await typedApi.alumni.updateMentorshipProgram(program.id, formData);
        toast.success('Mentorship program updated successfully');
      } else {
        await typedApi.alumni.createMentorshipProgram(formData);
        toast.success('Mentorship program created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving mentorship program:', error);
      toast.error('Failed to save mentorship program');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof MentorshipProgram, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Typography variant="h6" className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{program?.id ? 'Edit Mentorship Program' : 'Create New Mentorship Program'}</span>
          </Typography>
          <Button variant="text" size="small" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <TextField
                    fullWidth
                    id="name"
                    label="Program Name *"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                    placeholder="Enter program name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <TextField
                    fullWidth
                    id="description"
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('description', e.target.value)}
                    placeholder="Enter program description"
                    multiline
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      value={formData.status}
                      label="Status"
                      onChange={(e) => handleChange('status', e.target.value as 'active' | 'completed' | 'cancelled')}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Program Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Program Duration</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <TextField
                    fullWidth
                    id="start_date"
                    label="Start Date *"
                    type="date"
                    value={formData.start_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('start_date', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className="space-y-2">
                  <TextField
                    fullWidth
                    id="end_date"
                    label="End Date"
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('end_date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <p className="text-sm text-gray-500">Leave empty for ongoing program</p>
                </div>
              </div>
            </div>

            {/* Program Capacity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Program Capacity</span>
              </h3>
              
              <div className="space-y-2">
                <TextField
                  fullWidth
                  id="max_mentees"
                  label="Maximum Mentees"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={formData.max_mentees || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('max_mentees', parseInt(e.target.value) || 0)}
                  placeholder="Maximum number of mentees"
                />
                <p className="text-sm text-gray-500">Leave empty for unlimited mentees</p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Program Guidelines</span>
              </h3>
              
              <div className="space-y-2">
                <TextField
                  fullWidth
                  id="guidelines"
                  label="Guidelines"
                  value={formData.guidelines || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('guidelines', e.target.value)}
                  placeholder="Enter program guidelines and expectations"
                  multiline
                  rows={4}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Requirements</h3>
              
              <div className="space-y-2">
                <TextField
                  fullWidth
                  id="requirements"
                  label="Requirements"
                  value={formData.requirements || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('requirements', e.target.value)}
                  placeholder="Enter program requirements and prerequisites"
                  multiline
                  rows={4}
                />
              </div>
            </div>

            {/* Program Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Status</h3>
              
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Typography variant="subtitle1">Active</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Program is active and accepting applications
                    </Typography>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleChange('active', e.target.checked)}
                  />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading} startIcon={<Save />}>
                {loading ? 'Saving...' : 'Save Program'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorshipProgramForm;
