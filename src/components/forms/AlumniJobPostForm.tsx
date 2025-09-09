import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';
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

interface AlumniJobPost {
  id?: number;
  alumni_id: number;
  company_name: string;
  job_title: string;
  job_description?: string;
  job_location?: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_required?: string;
  salary_range?: string;
  application_deadline?: string;
  application_link?: string;
  skills_required?: string[];
  status: 'active' | 'filled' | 'expired';
}

interface AlumniJobPostFormProps {
  jobPost?: AlumniJobPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlumniJobPostForm: React.FC<AlumniJobPostFormProps> = ({ jobPost, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AlumniJobPost>({
    alumni_id: 0,
    company_name: '',
    job_title: '',
    employment_type: 'full-time',
    status: 'active',
    skills_required: []
  });
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    loadAlumni();
    if (jobPost) {
      setFormData(jobPost);
    }
  }, [jobPost]);

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
      if (jobPost?.id) {
        await (api as any).alumni.updateAlumniJobPost(jobPost.id, formData);
        toast.success('Job post updated successfully');
      } else {
        await (api as any).alumni.createAlumniJobPost(formData);
        toast.success('Job post created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving job post:', error);
      toast.error('Failed to save job post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AlumniJobPost, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkills = [...(formData.skills_required || []), skillInput.trim()];
      handleChange('skills_required', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills_required?.filter((_, i) => i !== index) || [];
    handleChange('skills_required', newSkills);
  };

  const getSelectedAlumnus = () => {
    return alumni.find(a => a.id === formData.alumni_id);
  };

  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'filled', label: 'Filled' },
    { value: 'expired', label: 'Expired' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>{jobPost?.id ? 'Edit Job Post' : 'Create New Job Post'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Poster Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Poster Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="alumni_id">Posted by Alumni *</Label>
                <Select 
                  value={formData.alumni_id?.toString() || ''} 
                  onValueChange={(value) => handleChange('alumni_id', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alumni" />
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
                    <p><strong>Current Company:</strong> {getSelectedAlumnus()?.current_company || 'Not specified'}</p>
                    <p><strong>Current Position:</strong> {getSelectedAlumnus()?.current_position || 'Not specified'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Job Details</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={(e) => handleChange('job_title', e.target.value)}
                    placeholder="Enter job title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_description">Job Description</Label>
                <Textarea
                  id="job_description"
                  value={formData.job_description || ''}
                  onChange={(e) => handleChange('job_description', e.target.value)}
                  placeholder="Enter detailed job description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_location">Job Location</Label>
                  <Input
                    id="job_location"
                    value={formData.job_location || ''}
                    onChange={(e) => handleChange('job_location', e.target.value)}
                    placeholder="City, State/Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type *</Label>
                  <Select 
                    value={formData.employment_type} 
                    onValueChange={(value) => handleChange('employment_type', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Requirements and Compensation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements and Compensation</h3>
              
              <div className="space-y-2">
                <Label htmlFor="experience_required">Experience Required</Label>
                <Input
                  id="experience_required"
                  value={formData.experience_required || ''}
                  onChange={(e) => handleChange('experience_required', e.target.value)}
                  placeholder="e.g., 2-5 years, Entry level, Senior level"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range || ''}
                  onChange={(e) => handleChange('salary_range', e.target.value)}
                  placeholder="e.g., $50,000 - $70,000, Competitive, Negotiable"
                />
              </div>
            </div>

            {/* Skills Required */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills Required</h3>
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add required skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills_required?.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Application Details</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={formData.application_deadline || ''}
                    onChange={(e) => handleChange('application_deadline', e.target.value)}
                  />
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
                <Label htmlFor="application_link">Application Link</Label>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <Input
                    id="application_link"
                    type="url"
                    value={formData.application_link || ''}
                    onChange={(e) => handleChange('application_link', e.target.value)}
                    placeholder="https://company.com/careers/job-application"
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
                <span>{loading ? 'Saving...' : 'Save Job Post'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniJobPostForm;
