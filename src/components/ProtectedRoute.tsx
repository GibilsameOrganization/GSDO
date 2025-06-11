
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  console.log('ProtectedRoute render:', { user: user?.email, loading, isAdmin, adminOnly });

  // Show loading only if we don't have user info yet
  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // For admin-only routes, check admin status
  // Note: We allow access if user exists, even if admin check is still pending
  // The admin check happens asynchronously and shouldn't block access for valid admins
  if (adminOnly && !isAdmin) {
    // Give a brief moment for admin status to load if user just authenticated
    console.log('ProtectedRoute: Admin required but isAdmin is false');
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gsdo-black mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-gray-500 text-sm mt-2">If you believe this is an error, please contact an administrator.</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
