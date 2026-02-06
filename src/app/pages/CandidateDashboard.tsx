import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getJobs, getApplicationsByCandidate } from '../lib/mock-data';
import { Job } from '../lib/types';
import { Briefcase, MapPin, DollarSign, TrendingUp, FileText, CheckCircle } from 'lucide-react';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    // Get recent jobs
    const jobs = getJobs();
    setRecentJobs(jobs.slice(0, 6));

    // Get application count
    if (user) {
      const applications = getApplicationsByCandidate(user.id);
      setApplicationCount(applications.length);
    }
  }, [user]);

  // Redirect recruiters and admins to appropriate dashboard
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/dashboard/jobs');
    } else if (user?.role === 'admin') {
      navigate('/dashboard/admin');
    }
  }, [user, navigate]);

  if (user?.role !== 'candidate') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Find your dream job today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
            <Briefcase className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentJobs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active job postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Applications</CardTitle>
            <FileText className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationCount}</div>
            <p className="text-xs text-gray-500 mt-1">Total applications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-gray-500 mt-1">Your profile is visible</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/dashboard/jobs')}>
            <Briefcase className="mr-2 size-4" />
            Browse All Jobs
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/my-applications')}>
            <FileText className="mr-2 size-4" />
            View My Applications
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/profile')}>
            <TrendingUp className="mr-2 size-4" />
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Job Postings</h2>
          <Button variant="link" onClick={() => navigate('/dashboard/jobs')}>
            View all →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.company}</CardDescription>
                  </div>
                  <Badge>{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="size-4 mr-2 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="size-4 mr-2 text-gray-400" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-3">
                    <span>{job.applicantCount} applicants</span>
                    <span className="mx-2">•</span>
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
