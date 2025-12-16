import React, { useState } from 'react';

const ArticleReport = () => {
  const [articles, setArticles] = useState([
    { id: 1, title: 'Lab Safety Best Practices', status: 'published', views: 125, date: '2024-01-10' },
    { id: 2, title: 'Equipment Maintenance Guide', status: 'draft', views: 0, date: '2024-01-12' },
    { id: 3, title: 'Effective Lab Management', status: 'published', views: 89, date: '2024-01-08' },
    { id: 4, title: 'Digital Tools for Educators', status: 'published', views: 156, date: '2024-01-05' },
  ]);

  const [newArticle, setNewArticle] = useState({ title: '', content: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newArticle.title && newArticle.content) {
      const newArticleObj = {
        id: articles.length + 1,
        title: newArticle.title,
        status: 'draft',
        views: 0,
        date: new Date().toISOString().split('T')[0]
      };
      setArticles([newArticleObj, ...articles]);
      setNewArticle({ title: '', content: '' });
      alert('Article saved as draft!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Article Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Article Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{articles.length}</p>
            <p className="text-sm text-gray-600">Total Articles</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {articles.filter(a => a.status === 'published').length}
            </p>
            <p className="text-sm text-gray-600">Published</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {articles.reduce((sum, article) => sum + article.views, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
        </div>
      </div>

      {/* Create New Article */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Article</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Title
            </label>
            <input
              type="text"
              name="title"
              value={newArticle.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter article title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={newArticle.content}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Write your article content here..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setNewArticle({ title: '', content: '' })}
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">My Articles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.views}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.date}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900 mr-4">View</button>
                    {article.status === 'draft' && (
                      <button className="text-green-600 hover:text-green-900">Publish</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArticleReport;