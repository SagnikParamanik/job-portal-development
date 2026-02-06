// User roles
export type UserRole = 'admin' | 'recruiter' | 'candidate';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  phone?: string;
  createdAt: string;
}

// Job interface
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedBy: string;
  postedDate: string;
  status: 'open' | 'closed';
  applicantCount: number;
}

// Application interface
export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  resumeUrl?: string;
  coverLetter: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  appliedDate: string;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'status_change' | 'new_job' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
}
