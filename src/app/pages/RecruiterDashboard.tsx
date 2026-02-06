import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getJobs, getApplications } from '../lib/mock-data';
import { Briefcase, Users, TrendingUp, PlusCircle, FileText } from 'lucide-react';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user) {
      const jobs = getJobs();
      const myJobs = jobs.filter(job => job.postedBy === user.id);
      setJobCount(myJobs.length);

      const applications = getApplications();
      const myApplications = applications.filter(app => 
        myJobs.some(job => job.id === app.jobId)
      );
      setApplicationCount(myApplications.length);
      setPendingCount(myApplications.filter(app => app.status === 'pending').length);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCount}</div>
            <p className="text-xs text-gray-500 mt-1">Jobs posted by you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationCount}</div>
            <p className="text-xs text-gray-500 mt-1">Candidates applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting your review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your recruitment process</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/dashboard/post-job')}>
            <PlusCircle className="mr-2 size-4" />
            Post New Job
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/applications')}>
            <Users className="mr-2 size-4" />
            View Applications
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/jobs')}>
            <Briefcase className="mr-2 size-4" />
            Browse All Jobs
          </Button>
        </CardContent>
      </Card>

      {/* Tips for Recruiters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 size-5 text-blue-600" />
            Recruitment Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              <span>Write clear and detailed job descriptions to attract the right candidates</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              <span>Respond to applications promptly to maintain candidate engagement</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              <span>Use the application status feature to keep your recruitment organized</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">•</span>
              <span>Provide feedback to candidates, even if they're not selected</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
