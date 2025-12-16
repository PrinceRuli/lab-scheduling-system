import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../hooks/useNotification';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('🔒 ProtectedRoute triggered:', {
    path: location.pathname,
    user,
    loading,
    isAuthenticated,
    requiredRole
  });

  useEffect(() => {
    console.log('📊 ProtectedRoute useEffect:', {
      loading,
      isAuthenticated,
      userRole: user?.role,
      requiredRole
    });

    // Check if user is trying to access a protected route without authentication
    if (!loading && !isAuthenticated) {
      console.log('⚠️ No authentication, redirecting to login');
      showNotification('warning', 'Please login to access this page');
    }
    
    // Check role permissions
    if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      console.log('🚫 Role mismatch:', {
        userRole: user?.role,
        requiredRole
      });
      showNotification('error', 'You do not have permission to access this page');
      navigate('/');
    }
  }, [loading, isAuthenticated, user, requiredRole, showNotification, navigate]);

  if (loading) {
    console.log('⏳ ProtectedRoute loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    // Save the attempted location for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('🚫 Role check failed:', {
      userRole: user?.role,
      requiredRole
    });
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute passed, rendering children');
  return children;
};

export default ProtectedRoute;