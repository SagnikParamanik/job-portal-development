import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { getNotificationsByUser, markNotificationAsRead, getUnreadCount } from '../lib/notifications';
import { Notification } from '../lib/types';
import { Bell, CheckCircle, Briefcase, Mail, AlertCircle } from 'lucide-react';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    const userNotifications = getNotificationsByUser(user.id);
    setNotifications(userNotifications);
    setUnreadCount(getUnreadCount(user.id));
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Mark all as read when opened
    if (user) {
      notifications.forEach(n => {
        if (!n.read) {
          markNotificationAsRead(n.id);
        }
      });
      setUnreadCount(0);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Briefcase className="size-5 text-blue-600" />;
      case 'status_change':
        return <CheckCircle className="size-5 text-green-600" />;
      case 'new_job':
        return <Mail className="size-5 text-purple-600" />;
      case 'system':
        return <AlertCircle className="size-5 text-gray-600" />;
      default:
        return <Bell className="size-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" onClick={handleOpen}>
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
