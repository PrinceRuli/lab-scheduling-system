// frontend/src/services/articleService.js
import api from './api';

export const articleService = {
  getAllArticles: async () => {
    try {
      // Demo data - replace with actual API call
      return [
        {
          _id: '1',
          title: 'Introduction to Data Science',
          content: 'Learn the basics of data science...',
          category: 'Tutorial',
          tags: ['Data Science', 'Python', 'Machine Learning'],
          status: 'published',
          featuredImage: null,
          author: { name: 'Dr. Smith' },
          createdAt: '2024-01-15T09:00:00Z'
        },
        // Add more demo articles...
      ];
    } catch (error) {
      throw error;
    }
  },

  createArticle: async (data) => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  updateArticle: async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  updateArticleStatus: async (id, status) => {
    const response = await api.patch(`/articles/${id}/status`, { status });
    return response.data;
  }
};