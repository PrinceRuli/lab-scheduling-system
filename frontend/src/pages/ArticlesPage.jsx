import React from 'react';

const ArticlesPage = () => {
  const articles = [
    { id: 1, title: 'Lab Safety Guidelines', category: 'Safety', date: '2024-01-15' },
    { id: 2, title: 'Equipment Maintenance', category: 'Maintenance', date: '2024-01-10' },
    { id: 3, title: 'Digital Transformation in Labs', category: 'Technology', date: '2024-01-05' },
    { id: 4, title: 'Sustainable Lab Practices', category: 'Sustainability', date: '2024-01-01' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Articles & Resources</h1>
      <p className="text-gray-600 mb-8">Latest articles and resources for lab management</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.date}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover essential tips and strategies for efficient lab management and safety protocols.
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                Read Article →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;