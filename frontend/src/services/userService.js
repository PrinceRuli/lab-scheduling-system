import api from './api';

const userService = {
  getAllUsers: async (params = {}) => {
    try {
      return await api.get('/users', { params });
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      return await api.get(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      return await api.put(`/users/${id}`, userData);
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      return await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwords) => {
    try {
      return await api.post('/users/change-password', passwords);
    } catch (error) {
      throw error;
    }
  },

  uploadProfileImage: async (formData) => {
    try {
      return await api.post('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getActivityLog: async (userId) => {
    try {
      return await api.get(`/users/${userId}/activity`);
    } catch (error) {
      throw error;
    }
  },

  updatePreferences: async (preferences) => {
    try {
      return await api.put('/users/preferences', preferences);
    } catch (error) {
      throw error;
    }
  },
};

export default userService;