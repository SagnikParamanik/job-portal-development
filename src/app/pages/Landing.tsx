import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-indigo-600 p-4 rounded-2xl">
              <Briefcase className="size-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              JobPortal
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Connect talented professionals with amazing opportunities
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/signup')}>
              Get Started
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="size-8 text-blue-600" />
                </div>
              </div>
              <CardTitle>For Candidates</CardTitle>
              <CardDescription className="text-base">
                Find your dream job and track applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Browse thousands of jobs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Easy application process
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Track application status
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Upload and manage resume
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Briefcase className="size-8 text-purple-600" />
                </div>
              </div>
              <CardTitle>For Recruiters</CardTitle>
              <CardDescription className="text-base">
                Post jobs and find the perfect candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Post unlimited jobs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Review applications
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Manage candidates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Email notifications
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="size-8 text-green-600" />
                </div>
              </div>
              <CardTitle>For Admins</CardTitle>
              <CardDescription className="text-base">
                Powerful analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Platform analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  User management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Performance metrics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="size-4 text-green-500 mr-2 flex-shrink-0" />
                  Data visualization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Info */}
        <Card className="mt-16 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Try Demo Accounts</CardTitle>
            <CardDescription className="text-center text-base">
              Login with these accounts to explore different user roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="font-semibold text-purple-600">Admin</div>
                <div className="text-sm text-gray-600">admin@jobportal.com</div>
                <div className="text-xs text-gray-400">Full platform access</div>
              </div>
              <div className="text-center space-y-2">
                <div className="font-semibold text-blue-600">Recruiter</div>
                <div className="text-sm text-gray-600">recruiter@techcorp.com</div>
                <div className="text-xs text-gray-400">Post & manage jobs</div>
              </div>
              <div className="text-center space-y-2">
                <div className="font-semibold text-green-600">Candidate</div>
                <div className="text-sm text-gray-600">john@email.com</div>
                <div className="text-xs text-gray-400">Apply for jobs</div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">Password: any</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
