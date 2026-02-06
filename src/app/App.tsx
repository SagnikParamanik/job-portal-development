import { RouterProvider } from 'react-router';
import { AuthProvider } from './lib/auth-context';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { initializeMockData } from './lib/mock-data';

export default function App() {
  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Log info about email notifications
    console.log('%c🎉 JobPortal - Hiring Platform', 'color: #4F46E5; font-size: 20px; font-weight: bold;');
    console.log('%c📧 Email Notification System Active', 'color: #10B981; font-size: 14px; font-weight: bold;');
    console.log('%cEmail notifications will be logged to this console when:', 'color: #6B7280; font-size: 12px;');
    console.log('%c  • A candidate applies for a job', 'color: #6B7280; font-size: 12px;');
    console.log('%c  • Application status is updated', 'color: #6B7280; font-size: 12px;');
    console.log('%c  • New jobs matching interests are posted', 'color: #6B7280; font-size: 12px;');
    console.log('%c\nDemo Accounts:', 'color: #8B5CF6; font-size: 14px; font-weight: bold;');
    console.log('%c  Admin: admin@jobportal.com', 'color: #6B7280; font-size: 12px;');
    console.log('%c  Recruiter: recruiter@techcorp.com', 'color: #6B7280; font-size: 12px;');
    console.log('%c  Candidate: john@email.com', 'color: #6B7280; font-size: 12px;');
    console.log('%c  Password: any', 'color: #6B7280; font-size: 12px;');
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}