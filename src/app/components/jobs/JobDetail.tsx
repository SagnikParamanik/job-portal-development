import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { projectId } from '/utils/supabase/info';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  createdAt: string;
  postedByName: string;
}

export function JobDetail() {
  const { id } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJob();
    checkIfApplied();
  }, [id]);

  async function fetchJob() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37fbc87c/jobs/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const { job } = await response.json();
      setJob(job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkIfApplied() {
    if (user?.role !== 'candidate') return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37fbc87c/applications`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const { applications } = await response.json();
      const applied = applications.some((app: any) => app.jobId === id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  }

  async function handleViewApplications() {
    navigate(`/jobs/${id}/applications`);
  }

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/jobs')}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Jobs
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{job.title}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {job.type}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5" />
                  <span className="text-lg">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-5" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <Clock className="size-4" />
                Posted {new Date(job.createdAt).toLocaleDateString()} by {job.postedByName}
              </div>
            </div>

            <div className="flex gap-2">
              {user?.role === 'candidate' && (
                <Button
                  size="lg"
                  disabled={hasApplied}
                  onClick={() => navigate(`/jobs/${id}/apply`)}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle2 className="size-4 mr-2" />
                      Already Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </Button>
              )}
              {(user?.role === 'admin' || user?.role === 'recruiter') && (
                <Button onClick={handleViewApplications}>
                  View Applications
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Employment Type</div>
                <div className="font-medium capitalize">{job.type}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-gray-600 mb-1">Location</div>
                <div className="font-medium">{job.location}</div>
              </div>
              {job.salary && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Salary Range</div>
                    <div className="font-medium">{job.salary}</div>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <div className="text-sm text-gray-600 mb-1">Posted Date</div>
                <div className="font-medium">
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'candidate' && !hasApplied && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Ready to apply?
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Submit your application and take the next step in your career.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/jobs/${id}/apply`)}
                >
                  Apply for this Position
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
