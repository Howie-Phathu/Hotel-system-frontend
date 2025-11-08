import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FaBell, FaCheck, FaCheckDouble, FaTimes } from 'react-icons/fa';
import './NotificationsPage.css';

interface Notification {
  notification_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    loadNotifications();
  }, [page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getNotifications(false, page, limit);
      const notificationsData = response.data?.notifications || [];
      setNotifications(notificationsData);
      setUnreadCount(response.data?.unreadCount || 0);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await userAPI.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => userAPI.markNotificationAsRead(n.notification_id))
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-page">
        <div className="container">
          <div className="loading-state">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <div className="header-content">
            <h1>
              <FaBell /> Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
              <FaCheckDouble /> Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <FaBell className="empty-icon" />
              <h2>No notifications</h2>
              <p>You're all caught up! You'll see new notifications here.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.notification_id}
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <div className="notification-header-item">
                    <h3>{notification.title}</h3>
                    {!notification.is_read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification.notification_id)}
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

