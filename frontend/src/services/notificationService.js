import api from './api';

const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAllAsRead: () => api.post('/notifications/mark-read'),
  markAsRead: (id) => api.post(`/notifications/${id}/mark-read`),
};

export default notificationService;
