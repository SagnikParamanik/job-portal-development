import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Briefcase, FileText, TrendingUp, Clock } from 'lucide-react';
import { projectId } from '/utils/supabase/info';

interface Stats {
  totalJobs?: number;
  totalApplications?: number;
  activeJobs?: number;
  pendingApplications?: number;
}

export function Dashboard() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({});
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    try {
      if (user?.role === 'admin') {
        // Fetch analytics for admin
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-37fbc87c/analytics`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        const { analytics } = await response.json();
        setStats({
          totalJobs: analytics.totalJobs,
          totalApplications: analytics.totalApplications,
          activeJobs: analytics.activeJobs,
          pendingApplications: analytics.applicationsByStatus.pending,
        });
        setRecentJobs(analytics.recentJobs);
        setRecentApplications(analytics.recentApplications);
      } else {
        // Fetch basic stats for recruiter/candidate
        const [jobsRes, appsRes] = await Promise.all([
          fetch(`https://${projectId}.supabase.co/functions/v1/make-server-37fbc87c/jobs`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }),
          fetch(`https://${projectId}.supabase.co/functions/v1/make-server-37fbc87c/applications`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }),
        ]);

        const { jobs } = await jobsRes.json();
        const { applications } = await appsRes.json();

        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          activeJobs: jobs.filter((j: any) => j.status === 'active').length,
          pendingApplications: applications.filter((a: any) => a.status === 'pending').length,
        });
        setRecentJobs(jobs.slice(0, 5));
        setRecentApplications(applications.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'admin' && 'Manage your platform and view analytics'}
          {user?.role === 'recruiter' && 'Manage job postings and review applications'}
          {user?.role === 'candidate' && 'Find your dream job and track applications'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Jobs
            </CardTitle>
            <Briefcase className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Jobs
            </CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applications
            </CardTitle>
            <FileText className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Review
            </CardTitle>
            <Clock className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {user?.role !== 'candidate' && (
            <Button onClick={() => navigate('/post-job')}>
              Post New Job
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </Button>
          <Button variant="outline" onClick={() => navigate('/applications')}>
            View Applications
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-600">{job.company}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No jobs yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="font-medium text-gray-900">{app.jobTitle}</div>
                    <div className="text-sm text-gray-600">{app.candidateName}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No applications yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
