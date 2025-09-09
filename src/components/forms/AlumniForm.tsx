import React, { useState, useEffect } from 'react';
import { X, Save, GraduationCap, User, Building, MapPin, Linkedin } from 'lucide-react';
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
import { api, departmentApi } from '../../services/api';

interface Alumni {
  id?: number;
  student_id?: number;
  partner_id?: number;
  graduation_year: number;
  degree?: string;
  department_id?: number;
  program_id?: number;
  batch_id?: number;
  roll_number?: string;
  final_gpa?: number;
  achievements?: string[];
  current_company?: string;
  current_position?: string;
  industry?: string;
  work_location?: string;
  linkedin_profile?: string;
  other_social_media?: any;
  willing_to_mentor: boolean;
  expertise_areas?: string[];
  status: 'active' | 'inactive';
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  gr_no: string;
}

interface Partner {
  id: number;
  name: string;
  email: string;
}

interface Department {
  id: number;
  name: string;
}

interface Program {
  id: number;
  name: string;
}

interface Batch {
  id: number;
  name: string;
}

interface AlumniFormProps {
  alumni?: Alumni | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AlumniForm: React.FC<AlumniFormProps> = ({ alumni, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Alumni>({
    graduation_year: new Date().getFullYear(),
    willing_to_mentor: false,
    status: 'active',
    achievements: [],
    expertise_areas: []
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [achievementInput, setAchievementInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');

  useEffect(() => {
    loadInitialData();
    if (alumni) {
      setFormData(alumni);
    }
  }, [alumni]);

  const loadInitialData = async () => {
    try {
      const [studentsData, partnersData, departmentsData, programsData, batchesData] = await Promise.all([
        api.students.getStudents(),
        (api as any).partner.getAllPartners(),
        departmentApi.getDepartments(),
        (api as any).program.getAllPrograms(),
        (api as any).course.getAllBatches()
      ]);
      
      setStudents(studentsData);
      setPartners(partnersData);
      setDepartments(departmentsData);
      setPrograms(programsData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (alumni?.id) {
        await (api as any).alumni.updateAlumni(alumni.id, formData);
        toast.success('Alumni updated successfully');
      } else {
        await (api as any).alumni.createAlumni(formData);
        toast.success('Alumni created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving alumni:', error);
      toast.error('Failed to save alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Alumni, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      const newAchievements = [...(formData.achievements || []), achievementInput.trim()];
      handleChange('achievements', newAchievements);
      setAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements?.filter((_, i) => i !== index) || [];
    handleChange('achievements', newAchievements);
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      const newExpertise = [...(formData.expertise_areas || []), expertiseInput.trim()];
      handleChange('expertise_areas', newExpertise);
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    const newExpertise = formData.expertise_areas?.filter((_, i) => i !== index) || [];
    handleChange('expertise_areas', newExpertise);
  };

  const getSelectedStudent = () => {
    return students.find(s => s.id === formData.student_id);
  };

  const getSelectedPartner = () => {
    return partners.find(p => p.id === formData.partner_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>{alumni?.id ? 'Edit Alumni' : 'Create New Alumni'}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student (Optional)</Label>
                  <Select 
                    value={formData.student_id?.toString() || ''} 
                    onValueChange={(value: string) => handleChange('student_id', value ? parseInt(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Student</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.first_name} {student.last_name} ({student.gr_no})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner_id">Partner (Optional)</Label>
                  <Select 
                    value={formData.partner_id?.toString() || ''} 
                    onValueChange={(value: string) => handleChange('partner_id', value ? parseInt(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Partner</SelectItem>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id.toString()}>
                          {partner.name} ({partner.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduation_year">Graduation Year *</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.graduation_year}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('graduation_year', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={formData.degree || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('degree', e.target.value)}
                    placeholder="e.g., Bachelor of Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roll_number">Roll Number</Label>
                  <Input
                    id="roll_number"
                    value={formData.roll_number || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('roll_number', e.target.value)}
                    placeholder="Student roll number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department_id">Department</Label>
                  <Select 
                    value={formData.department_id?.toString() || ''} 
                    onValueChange={(value: string) => handleChange('department_id', value ? parseInt(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Department</SelectItem>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program_id">Program</Label>
                  <Select 
                    value={formData.program_id?.toString() || ''} 
                    onValueChange={(value: string) => handleChange('program_id', value ? parseInt(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Program</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id.toString()}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch_id">Batch</Label>
                  <Select 
                    value={formData.batch_id?.toString() || ''} 
                    onValueChange={(value: string) => handleChange('batch_id', value ? parseInt(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Batch</SelectItem>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="final_gpa">Final GPA</Label>
                <Input
                  id="final_gpa"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={formData.final_gpa || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('final_gpa', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 3.75"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Professional Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_company">Current Company</Label>
                  <Input
                    id="current_company"
                    value={formData.current_company || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('current_company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_position">Current Position</Label>
                  <Input
                    id="current_position"
                    value={formData.current_position || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('current_position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('industry', e.target.value)}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_location">Work Location</Label>
                  <Input
                    id="work_location"
                    value={formData.work_location || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('work_location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                <div className="flex items-center space-x-2">
                  <Linkedin className="h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedin_profile"
                    type="url"
                    value={formData.linkedin_profile || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('linkedin_profile', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Achievements</h3>
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={achievementInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAchievementInput(e.target.value)}
                    placeholder="Add achievement"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                  <Button type="button" onClick={addAchievement} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      <span>{achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Expertise Areas</h3>
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpertiseInput(e.target.value)}
                    placeholder="Add expertise area"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                  />
                  <Button type="button" onClick={addExpertise} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.expertise_areas?.map((expertise, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      <span>{expertise}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status and Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status and Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="willing_to_mentor">Willing to Mentor</Label>
                    <p className="text-sm text-gray-500">
                      Alumni is available to mentor current students
                    </p>
                  </div>
                  <Switch
                    id="willing_to_mentor"
                    checked={formData.willing_to_mentor}
                    onCheckedChange={(checked: boolean) => handleChange('willing_to_mentor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Status</Label>
                    <p className="text-sm text-gray-500">
                      Alumni account status
                    </p>
                  </div>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: string) => handleChange('status', value as 'active' | 'inactive')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
                <span>{loading ? 'Saving...' : 'Save Alumni'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniForm;
