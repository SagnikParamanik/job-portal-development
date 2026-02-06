import { useState, useRef } from 'react';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Upload, FileText, CheckCircle, User, Mail, Phone, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    bio: '',
    skills: '',
    experience: '',
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast.error('Only PDF and DOC files are supported');
        return;
      }

      setResumeFile(file);
      toast.success('Resume selected', {
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error('Please select a file first');
      return;
    }

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would upload to storage here
    setResumeUploaded(true);
    toast.success('Resume uploaded successfully!', {
      description: 'Your resume is now attached to your profile',
    });

    // Send notification
    const notification = {
      type: 'system',
      message: `Resume "${resumeFile.name}" uploaded successfully`,
      timestamp: new Date().toISOString(),
    };
    
    // Store notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone,
      company: formData.company,
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    setIsSaving(false);
    setIsEditing(false);
    
    toast.success('Profile updated successfully!');

    // Send notification
    const notification = {
      type: 'system',
      message: 'Your profile has been updated',
      timestamp: new Date().toISOString(),
    };
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and resume</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="size-20">
              <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <Badge className="mt-2" variant="secondary">
                {user?.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  <Save className="mr-2 size-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="inline size-4 mr-1" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline size-4 mr-1" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline size-4 mr-1" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {user?.role === 'recruiter' && (
              <div className="space-y-2">
                <Label htmlFor="company">
                  <Building2 className="inline size-4 mr-1" />
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>

          {user?.role === 'candidate' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell recruiters about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g., React, TypeScript, Node.js, etc."
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Brief summary of your work experience..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Resume Upload (Candidates only) */}
      {user?.role === 'candidate' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 size-5" />
              Resume / CV
            </CardTitle>
            <CardDescription>Upload your resume to apply for jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {resumeUploaded ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="size-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Resume Uploaded</p>
                    <p className="text-sm text-gray-600 mt-1">{resumeFile?.name}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResumeUploaded(false);
                      setResumeFile(null);
                    }}
                  >
                    Upload Different File
                  </Button>
                </div>
              ) : resumeFile ? (
                <div className="space-y-3">
                  <FileText className="size-12 text-indigo-600 mx-auto" />
                  <div>
                    <p className="font-medium">{resumeFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleResumeUpload}>
                      <Upload className="mr-2 size-4" />
                      Upload Resume
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setResumeFile(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="size-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="font-medium">Upload your resume</p>
                    <p className="text-sm text-gray-600">PDF or DOC file, max 5MB</p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select File
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Keep your resume updated to increase your chances of getting hired. 
                Recruiters will see your resume when you apply for jobs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Email Preferences
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
