import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Buat context
const AuthContext = createContext({});

// Custom hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('🔄 AuthProvider initialized');
  console.log('📊 Current state:', { user, loading });

  // Check authentication on mount
  useEffect(() => {
    console.log('🔍 Running checkAuth...');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('🔐 checkAuth called');
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? 'Exists' : 'Not found');
      
      if (token) {
        console.log('🔄 Fetching user profile...');
        // Untuk testing, gunakan mock data dulu
        const mockUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          institution: 'Universitas Contoh',
          createdAt: new Date().toISOString(),
        };
        
        // Simpan user ke state
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        console.log('✅ Mock user set:', mockUser);
      } else {
        console.log('❌ No token found');
      }
    } catch (err) {
      console.error('❌ Auth check failed:', err);
      localStorage.removeItem('token');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('🔐 Login attempt:', { email });
    setError(null);
    try {
      // Untuk DEMO - gunakan mock response
      console.log('🎭 Using mock login for demo');
      
      let mockUser;
      let mockToken;
      
      if (email === 'admin@example.com' && password === 'password123') {
        mockUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          institution: 'Universitas Contoh',
          createdAt: new Date().toISOString(),
        };
        mockToken = 'demo-jwt-token-admin';
      } else if (email === 'teacher@example.com' && password === 'password123') {
        mockUser = {
          id: '2',
          name: 'Teacher User',
          email: 'teacher@example.com',
          role: 'teacher',
          institution: 'Universitas Contoh',
          createdAt: new Date().toISOString(),
        };
        mockToken = 'demo-jwt-token-teacher';
      } else {
        // Simulate failed login
        throw new Error('Invalid credentials');
      }
      
      // Simpan ke localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      
      console.log('✅ Login successful:', mockUser);
      console.log('🔑 Token saved:', mockToken);
      
      // Redirect berdasarkan role
      setTimeout(() => {
        if (mockUser.role === 'admin') {
          console.log('🚀 Redirecting to /admin');
          navigate('/admin');
        } else if (mockUser.role === 'teacher') {
          console.log('🚀 Redirecting to /teacher');
          navigate('/teacher');
        } else {
          console.log('🚀 Redirecting to /');
          navigate('/');
        }
      }, 100);
      
      return { success: true, user: mockUser };
      
    } catch (err) {
      const errorMsg = 'Login failed. Please use demo credentials: admin@example.com / password123 or teacher@example.com / password123';
      console.error('❌ Login error:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (userData) => {
    console.log('📝 Register attempt:', userData);
    setError(null);
    try {
      // Mock registration
      const mockUser = {
        id: Date.now().toString(),
        ...userData,
        role: userData.role || 'teacher',
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'demo-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log('✅ Registration successful:', mockUser);
      
      // Redirect
      setTimeout(() => {
        if (mockUser.role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/');
        }
      }, 100);
      
      return { success: true, user: mockUser };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      console.error('❌ Registration error:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    navigate('/login');
  };

  const updateProfile = async (data) => {
    console.log('🔄 Updating profile:', data);
    try {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('✅ Profile updated:', updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMsg = err.message || 'Update failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  console.log('🎯 AuthContext value:', { 
    isAuthenticated: value.isAuthenticated,
    user: value.user,
    loading: value.loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;