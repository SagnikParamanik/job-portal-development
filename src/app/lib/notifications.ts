import { Notification } from './types';

/**
 * Email Notification System
 * 
 * This system simulates email notifications by logging to the browser console.
 * In a production environment, this would integrate with an email service like:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Postmark
 * 
 * Email notifications are sent when:
 * 1. A candidate applies for a job (notifies recruiter)
 * 2. Application status changes (notifies candidate)
 * 3. New jobs are posted matching candidate interests
 * 
 * To see email notifications in action:
 * 1. Open the browser console (F12)
 * 2. Apply for a job as a candidate
 * 3. Change application status as a recruiter
 * 4. Look for the "📧 Email Notification Sent:" logs
 */

// Email notification simulator
export function sendEmailNotification(to: string, subject: string, message: string) {
  console.log('📧 Email Notification Sent:');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log('---');
  
  // In a real app, this would call an email service API
  // For demo, we'll just log to console
  return true;
}

// Notification management
export function addNotification(userId: string, notification: Omit<Notification, 'id'>) {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
  };
  notifications.unshift(newNotification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  return newNotification;
}

export function getNotifications(): Notification[] {
  const notifications = localStorage.getItem('notifications');
  return notifications ? JSON.parse(notifications) : [];
}

export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications().filter(n => n.userId === userId);
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
}

export function getUnreadCount(userId: string): number {
  return getNotificationsByUser(userId).filter(n => !n.read).length;
}

// Application notification helpers
export function notifyApplicationReceived(
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  recruiterEmail: string,
  recruiterId: string
) {
  // Email to recruiter
  sendEmailNotification(
    recruiterEmail,
    `New Application for ${jobTitle}`,
    `${candidateName} has applied for the position of ${jobTitle}. Please review the application in your dashboard.`
  );

  // In-app notification for recruiter
  addNotification(recruiterId, {
    userId: recruiterId,
    type: 'application',
    message: `${candidateName} applied for ${jobTitle}`,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export function notifyApplicationStatusChange(
  candidateEmail: string,
  candidateId: string,
  jobTitle: string,
  status: string,
  companyName: string
) {
  const statusMessages: Record<string, string> = {
    reviewing: `Your application for ${jobTitle} at ${companyName} is now being reviewed.`,
    shortlisted: `Great news! You've been shortlisted for ${jobTitle} at ${companyName}.`,
    accepted: `Congratulations! Your application for ${jobTitle} at ${companyName} has been accepted.`,
    rejected: `Thank you for your interest in ${jobTitle} at ${companyName}. Unfortunately, we've decided to move forward with other candidates.`,
  };

  const message = statusMessages[status] || `Your application status has been updated to: ${status}`;

  // Email to candidate
  sendEmailNotification(
    candidateEmail,
    `Application Update: ${jobTitle}`,
    message
  );

  // In-app notification for candidate
  addNotification(candidateId, {
    userId: candidateId,
    type: 'status_change',
    message: `Application status updated for ${jobTitle}: ${status}`,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export function notifyNewJob(candidateEmail: string, candidateId: string, jobTitle: string, companyName: string) {
  // Email to candidate
  sendEmailNotification(
    candidateEmail,
    `New Job Posted: ${jobTitle}`,
    `A new position matching your interests has been posted: ${jobTitle} at ${companyName}. Check it out on our platform!`
  );

  // In-app notification
  addNotification(candidateId, {
    userId: candidateId,
    type: 'new_job',
    message: `New job posted: ${jobTitle} at ${companyName}`,
    read: false,
    createdAt: new Date().toISOString(),
  });
}