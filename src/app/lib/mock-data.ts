import { Job, Application } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building the next generation of our web applications.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of modern frontend architectures',
      'Experience with state management libraries (Redux, Zustand)',
      'Excellent problem-solving skills',
      'Strong communication and teamwork abilities'
    ],
    responsibilities: [
      'Design and implement responsive user interfaces',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Mentor junior developers'
    ],
    postedBy: '2',
    postedDate: '2026-01-28',
    status: 'open',
    applicantCount: 24,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130,000 - $170,000',
    description: 'Join our product team to drive the vision and execution of our flagship products. You will work closely with engineering, design, and business teams.',
    requirements: [
      '3+ years of product management experience',
      'Strong analytical and strategic thinking',
      'Experience with agile methodologies',
      'Excellent stakeholder management',
      'Technical background preferred'
    ],
    responsibilities: [
      'Define product roadmap and strategy',
      'Gather and prioritize requirements',
      'Work with cross-functional teams',
      'Analyze product metrics and user feedback',
      'Present to executive leadership'
    ],
    postedBy: '2',
    postedDate: '2026-01-30',
    status: 'open',
    applicantCount: 18,
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90,000 - $130,000',
    description: 'We are seeking a talented UX/UI Designer to create beautiful and intuitive user experiences for our digital products.',
    requirements: [
      '4+ years of UX/UI design experience',
      'Proficiency in Figma and design tools',
      'Strong portfolio demonstrating design skills',
      'Understanding of user-centered design principles',
      'Experience with design systems'
    ],
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with product and engineering teams',
      'Maintain and evolve design system',
      'Present design concepts to stakeholders'
    ],
    postedBy: '2',
    postedDate: '2026-02-01',
    status: 'open',
    applicantCount: 31,
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'DataFlow Inc',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $150,000',
    description: 'Looking for a skilled Backend Engineer to build scalable APIs and services that power our platform.',
    requirements: [
      '4+ years of backend development experience',
      'Strong knowledge of Node.js or Python',
      'Experience with PostgreSQL or MongoDB',
      'Understanding of microservices architecture',
      'Experience with cloud platforms (AWS, GCP)'
    ],
    responsibilities: [
      'Design and develop RESTful APIs',
      'Optimize database queries and performance',
      'Implement security best practices',
      'Write comprehensive tests',
      'Participate in system architecture decisions'
    ],
    postedBy: '2',
    postedDate: '2026-02-02',
    status: 'open',
    applicantCount: 15,
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$140,000 - $180,000',
    description: 'Join our data science team to build machine learning models and derive insights from large datasets.',
    requirements: [
      'MS/PhD in Computer Science, Statistics, or related field',
      'Strong programming skills in Python',
      'Experience with ML frameworks (TensorFlow, PyTorch)',
      'Solid understanding of statistics and mathematics',
      'Experience with data visualization tools'
    ],
    responsibilities: [
      'Develop and deploy machine learning models',
      'Analyze complex datasets',
      'Collaborate with product teams',
      'Present findings to stakeholders',
      'Stay current with latest ML research'
    ],
    postedBy: '2',
    postedDate: '2026-02-03',
    status: 'open',
    applicantCount: 22,
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    description: 'We need a DevOps Engineer to improve our infrastructure, CI/CD pipelines, and deployment processes.',
    requirements: [
      '3+ years of DevOps experience',
      'Strong knowledge of Docker and Kubernetes',
      'Experience with CI/CD tools (Jenkins, GitLab CI)',
      'Proficiency in scripting (Bash, Python)',
      'AWS or Azure certification preferred'
    ],
    responsibilities: [
      'Manage cloud infrastructure',
      'Implement and maintain CI/CD pipelines',
      'Monitor system performance and reliability',
      'Automate deployment processes',
      'Ensure security compliance'
    ],
    postedBy: '2',
    postedDate: '2026-02-04',
    status: 'open',
    applicantCount: 12,
  },
];

// Initialize localStorage with mock data if not present
export function initializeMockData() {
  if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify(MOCK_JOBS));
  }
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
}

// Job management functions
export function getJobs(): Job[] {
  initializeMockData();
  const jobs = localStorage.getItem('jobs');
  return jobs ? JSON.parse(jobs) : [];
}

export function getJobById(id: string): Job | undefined {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
}

export function addJob(job: Job): void {
  const jobs = getJobs();
  jobs.unshift(job);
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }
}

// Application management functions
export function getApplications(): Application[] {
  const apps = localStorage.getItem('applications');
  return apps ? JSON.parse(apps) : [];
}

export function getApplicationsByCandidate(candidateId: string): Application[] {
  return getApplications().filter(app => app.candidateId === candidateId);
}

export function getApplicationsByJob(jobId: string): Application[] {
  return getApplications().filter(app => app.jobId === jobId);
}

export function addApplication(application: Application): void {
  const applications = getApplications();
  applications.push(application);
  localStorage.setItem('applications', JSON.stringify(applications));

  // Update job applicant count
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(job => job.id === application.jobId);
  if (jobIndex !== -1) {
    jobs[jobIndex].applicantCount += 1;
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }
}

export function updateApplicationStatus(id: string, status: Application['status']): void {
  const applications = getApplications();
  const index = applications.findIndex(app => app.id === id);
  if (index !== -1) {
    applications[index].status = status;
    localStorage.setItem('applications', JSON.stringify(applications));
  }
}

export function hasApplied(jobId: string, candidateId: string): boolean {
  const applications = getApplications();
  return applications.some(app => app.jobId === jobId && app.candidateId === candidateId);
}
