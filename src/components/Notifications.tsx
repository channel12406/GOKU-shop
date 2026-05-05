import { useState, useEffect } from "react";
import { Bell, Trophy, X, CheckCircle, Clock, Eye } from "lucide-react";
import { getUserNotifications, markNotificationAsRead, deleteNotification, type Notification } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          const userNotifications = await getUserNotifications(user.uid);
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        await markNotificationAsRead(user.uid, notificationId);
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        await deleteNotification(user.uid, notificationId);
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  if (loading) {
    return (
      <div className="relative">
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <div className="w-2 h-2 bg-primary rounded-full absolute top-1 right-1 animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-secondary/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {notification.type === 'tournament' ? (
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Trophy className="w-4 h-4 text-blue-500" />
                          </div>
                        ) : (
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <Bell className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id!)}
                              className="p-1 hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3 text-destructive" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        {(notification.tournamentRoomId || notification.tournamentPassword) && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 mb-2 space-y-1">
                            {notification.tournamentRoomId && (
                              <p className="text-xs font-mono text-blue-400">
                                <span className="font-semibold">ID Chambre:</span> {notification.tournamentRoomId}
                              </p>
                            )}
                            {notification.tournamentPassword && (
                              <p className="text-xs font-mono text-blue-400">
                                <span className="font-semibold">Mot de passe:</span> {notification.tournamentPassword}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(notification.timestamp)}</span>
                          </div>
                          
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id!)}
                              className="text-xs text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
