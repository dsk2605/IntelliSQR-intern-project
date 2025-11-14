// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- You imported this, good!
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { TodoPage } from './pages/TodoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthLayout } from './components/AuthLayout';
import { MainLayout } from './components/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    // 1. We must wrap everything in a React Fragment
    <>
      {/* 2. Add the Toaster component here, outside the routes */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {/* 3. Your Routes component is now *after* the Toaster */}
      <Routes>
        {/* Route group for protected main app routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/todos" element={<TodoPage />} />
        </Route>

        {/* Route group for public authentication routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Redirect root path to the todo page */}
        <Route path="/" element={<Navigate to="/todos" replace />} />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </> // 4. Close the fragment
  );
}

export default App;