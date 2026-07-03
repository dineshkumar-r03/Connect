import api from './api';

const userService = {
  getUser: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  checkFollowStatus: (id) => api.get(`/users/${id}/follow/status`),
};

export default userService;
