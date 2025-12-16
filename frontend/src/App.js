import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';

// Layout Components
import Layout from './components/common/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LabsPage from './pages/LabsPage';
import SchedulePage from './pages/SchedulePage';
import ArticlesPage from './pages/ArticlesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <NotificationProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><LandingPage /></Layout>} />
              <Route path="/login" element={<Layout><LoginPage /></Layout>} />
              <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
              <Route path="/labs" element={<Layout><LabsPage /></Layout>} />
              <Route path="/schedule" element={<Layout><SchedulePage /></Layout>} />
              <Route path="/articles" element={<Layout><ArticlesPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

              {/* Protected Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
              } />

              {/* Admin Dashboard Route */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              } />

              {/* Teacher Dashboard Route */}
              <Route path="/teacher" element={
                <ProtectedRoute requiredRole="teacher">
                  <Layout><TeacherDashboard /></Layout>
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="/404" element={<Layout><NotFoundPage /></Layout>} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AuthProvider>
        </NotificationProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;