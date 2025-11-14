import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { token } = useAuthStore();

  if (!token) {

    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};