import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getApplicationsByCandidate, getJobById } from '../lib/mock-data';
import { Application, Job } from '../lib/types';
import { FileText, Calendar, Briefcase, ExternalLink } from 'lucide-react';

export default function MyApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<(Application & { job?: Job })[]>([]);

  useEffect(() => {
    if (user) {
      const userApplications = getApplicationsByCandidate(user.id);
      const applicationsWithJobs = userApplications.map(app => ({
        ...app,
        job: getJobById(app.jobId),
      }));
      setApplications(applicationsWithJobs);
    }
  }, [user]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{applications.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl">
              {applications.filter(a => a.status === 'pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reviewing</CardDescription>
            <CardTitle className="text-2xl">
              {applications.filter(a => a.status === 'reviewing').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Shortlisted</CardDescription>
            <CardTitle className="text-2xl text-purple-600">
              {applications.filter(a => a.status === 'shortlisted').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
            <Button onClick={() => navigate('/dashboard/jobs')}>
              <Briefcase className="mr-2 size-4" />
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {application.job?.title || 'Job Title'}
                    </CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {application.job?.company || 'Company Name'}
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
                      <Calendar className="size-4 mr-1.5 text-gray-400" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                    {application.job && (
                      <>
                        <div className="flex items-center">
                          <Briefcase className="size-4 mr-1.5 text-gray-400" />
                          {application.job.type}
                        </div>
                      </>
                    )}
                  </div>

                  {application.coverLetter && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
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
    </div>
  );
}
