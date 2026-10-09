import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WeddingProvider } from './context/WeddingContext';

import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import GuestRsvpPage from './pages/GuestRsvpPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-rose-300">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold">Loading MakeMyMarriage Workspace...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <WeddingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/rsvp/:token" element={<GuestRsvpPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </WeddingProvider>
    </AuthProvider>
  );
}
