import React from 'react';

const Articles = () => {
  const articles = [
    { id: 1, title: 'Best Practices for Lab Safety', category: 'Safety', readTime: '5 min' },
    { id: 2, title: 'Optimizing Lab Resources', category: 'Management', readTime: '8 min' },
    { id: 3, title: 'Digital Transformation in Education', category: 'Technology', readTime: '6 min' },
    { id: 4, title: 'Sustainable Lab Practices', category: 'Sustainability', readTime: '7 min' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-gray-500">{article.readTime} read</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">{article.title}</h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover essential tips and strategies for efficient lab management and safety protocols.
            </p>
            <button className="text-cyan-500 hover:text-cyan-600 font-medium text-sm">
              Read Article →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Articles;