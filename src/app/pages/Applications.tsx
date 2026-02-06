import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { getApplications, getJobById, getJobs, updateApplicationStatus } from '../lib/mock-data';
import { Application, Job } from '../lib/types';
import { notifyApplicationStatusChange } from '../lib/notifications';
import { Mail, Calendar, FileText, ExternalLink, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<(Application & { job?: Job })[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<(Application & { job?: Job }) | null>(null);
  const [filterStatus, setFilterStatus] = useState<Application['status'] | 'all'>('all');

  useEffect(() => {
    if (user) {
      const jobs = getJobs();
      const myJobs = jobs.filter(job => job.postedBy === user.id);
      const allApplications = getApplications();
      
      const myApplications = allApplications
        .filter(app => myJobs.some(job => job.id === app.jobId))
        .map(app => ({
          ...app,
          job: getJobById(app.jobId),
        }))
        .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
      
      setApplications(myApplications);
    }
  }, [user]);

  const handleStatusChange = (applicationId: string, newStatus: Application['status']) => {
    const application = applications.find(app => app.id === applicationId);
    
    updateApplicationStatus(applicationId, newStatus);
    setApplications(prev =>
      prev.map(app => (app.id === applicationId ? { ...app, status: newStatus } : app))
    );
    
    // Send email notification to candidate
    if (application && application.job) {
      notifyApplicationStatusChange(
        application.candidateEmail,
        application.candidateId,
        application.job.title,
        newStatus,
        application.job.company
      );
    }
    
    toast.success('Application status updated', {
      description: 'The candidate has been notified via email',
    });
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Application['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const applicationsByStatus = {
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{applicationsByStatus.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reviewing</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{applicationsByStatus.reviewing}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Shortlisted</CardDescription>
            <CardTitle className="text-2xl text-purple-600">{applicationsByStatus.shortlisted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-2xl text-green-600">{applicationsByStatus.accepted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">{applicationsByStatus.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'You haven\'t received any applications yet' 
                : `No applications with status: ${filterStatus}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{application.candidateName}</CardTitle>
                    <CardDescription className="mt-1">
                      Applied for: {application.job?.title || 'Unknown Position'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="size-4 mr-1.5 text-gray-400" />
                      {application.candidateEmail}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="size-4 mr-1.5 text-gray-400" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <FileText className="mr-2 size-4" />
                      View Details
                    </Button>
                    
                    <Select
                      value={application.status}
                      onValueChange={(value) => handleStatusChange(application.id, value as Application['status'])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/jobs/${application.jobId}`)}
                    >
                      <ExternalLink className="mr-2 size-4" />
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Application Details</DialogTitle>
                <DialogDescription>
                  Review complete application information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Candidate Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedApplication.candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedApplication.candidateEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Applied Date:</span>
                      <span>{new Date(selectedApplication.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedApplication.status)}>
                        {getStatusLabel(selectedApplication.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Position Applied For</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="font-medium text-lg">{selectedApplication.job?.title}</p>
                    <p className="text-gray-600">{selectedApplication.job?.company}</p>
                  </div>
                </div>

                {selectedApplication.coverLetter && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedApplication.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Select
                    value={selectedApplication.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedApplication.id, value as Application['status']);
                      if (selectedApplication) {
                        setSelectedApplication({ ...selectedApplication, status: value as Application['status'] });
                      }
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}