// frontend/src/services/testimonialService.js
import api from './api';

export const testimonialService = {
  getAllTestimonials: async () => {
    try {
      // Demo data
      return [
        {
          _id: '1',
          content: 'Great lab facilities! Very helpful for my research.',
          rating: 5,
          status: 'approved',
          user: { name: 'Dr. Johnson', position: 'Professor' },
          lab: { name: 'Lab A' },
          createdAt: '2024-01-14T14:30:00Z'
        },
        // Add more demo testimonials...
      ];
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/testimonials/${id}/status`, { status });
    return response.data;
  },

  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};