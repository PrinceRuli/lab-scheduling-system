import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials);
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      return await api.get('/auth/profile');
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      return await api.put('/auth/profile', data);
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      return await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, passwords) => {
    try {
      return await api.post(`/auth/reset-password/${token}`, passwords);
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwords) => {
    try {
      return await api.post('/auth/change-password', passwords);
    } catch (error) {
      throw error;
    }
  },
};

export default authService;