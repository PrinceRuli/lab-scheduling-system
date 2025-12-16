import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <div className="flex">
          {/* Sidebar for authenticated users */}
          <Sidebar />
          
          {/* Main content area */}
          <div className="flex-1 ml-64">
            <Header />
            <main className="p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      ) : (
        /* Layout for non-authenticated users */
        <>
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default Layout;