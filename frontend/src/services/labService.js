import api from './api';

const labService = {
  getAllLabs: async (params = {}) => {
    try {
      return await api.get('/labs', { params });
    } catch (error) {
      throw error;
    }
  },

  getLabById: async (id) => {
    try {
      return await api.get(`/labs/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createLab: async (labData) => {
    try {
      return await api.post('/labs', labData);
    } catch (error) {
      throw error;
    }
  },

  updateLab: async (id, labData) => {
    try {
      return await api.put(`/labs/${id}`, labData);
    } catch (error) {
      throw error;
    }
  },

  deleteLab: async (id) => {
    try {
      return await api.delete(`/labs/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getLabAvailability: async (id, date) => {
    try {
      return await api.get(`/labs/${id}/availability`, { params: { date } });
    } catch (error) {
      throw error;
    }
  },

  getLabEquipment: async (id) => {
    try {
      return await api.get(`/labs/${id}/equipment`);
    } catch (error) {
      throw error;
    }
  },

  searchLabs: async (query, filters = {}) => {
    try {
      return await api.post('/labs/search', { query, filters });
    } catch (error) {
      throw error;
    }
  },

  getLabStats: async (id) => {
    try {
      return await api.get(`/labs/${id}/stats`);
    } catch (error) {
      throw error;
    }
  },

  getPopularLabs: async () => {
    try {
      return await api.get('/labs/popular');
    } catch (error) {
      throw error;
    }
  },

  checkAvailability: async (labId, startTime, endTime) => {
    try {
      return await api.post('/labs/check-availability', {
        labId,
        startTime,
        endTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default labService;