import { getJobById, hasApplied, addApplication } from '../lib/mock-data';
import { Job, Application } from '../lib/types';
import { notifyApplicationReceived } from '../lib/notifications';
import { MapPin, DollarSign, Briefcase, Calendar, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundJob = getJobById(id);
      setJob(foundJob || null);

      if (foundJob && user) {
        setApplied(hasApplied(foundJob.id, user.id));
      }
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!job || !user) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const application: Application = {
      id: Date.now().toString(),
      jobId: job.id,
      candidateId: user.id,
      candidateName: user.name,
      candidateEmail: user.email,
      coverLetter,
      status: 'pending',
      appliedDate: new Date().toISOString(),
    };

    addApplication(application);
    
    // Send email notification to recruiter
    const recruiterEmail = 'recruiter@company.com'; // In real app, get from job.postedBy user data
    notifyApplicationReceived(
      user.name,
      user.email,
      job.title,
      recruiterEmail,
      job.postedBy
    );
    
    setApplied(true);
    setIsDialogOpen(false);
    setIsSubmitting(false);
    
    toast.success('Application submitted successfully!', {
      description: 'The recruiter will review your application soon. You will receive email updates.',
    });
  };

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Job not found</p>
        <Button onClick={() => navigate('/dashboard/jobs')} className="mt-4">
          Browse Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="text-xl mt-2">{job.company}</CardDescription>
            </div>
            <Badge className="text-base px-4 py-2">{job.type}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="size-5 mr-2 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="size-5 mr-2 text-gray-400" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="size-5 mr-2 text-gray-400" />
              <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Users className="size-5 mr-2 text-gray-400" />
              <span>{job.applicantCount} applicants</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {user?.role === 'candidate' && (
            <div>
              {applied ? (
                <Button disabled className="w-full md:w-auto">
                  <CheckCircle className="mr-2 size-4" />
                  Already Applied
                </Button>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto" size="lg">
                      <Briefcase className="mr-2 size-4" />
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Submit your application to {job.company}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell us why you're a great fit for this position..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          rows={8}
                        />
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          Your profile information and resume will be shared with the employer.
                        </p>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApply} disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-3">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="size-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="size-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}