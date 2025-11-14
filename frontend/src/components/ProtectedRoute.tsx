// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // --- THIS IS THE FIX ---
  // We changed useAuthStore.getState() to useAuthStore()
  // The .getState() version is a one-time check.
  // The () version is a hook that subscribes to all changes.
  const { token } = useAuthStore();

  if (!token) {
    // When you log out, 'token' will become null, this component
    // will re-render, and this line will run instantly.
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the children (e.g., <MainLayout />)
  return <>{children}</>;
};