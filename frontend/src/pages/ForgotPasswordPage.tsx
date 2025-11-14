// src/pages/ForgotPasswordPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  forgotPasswordSchema,
  type TForgotPasswordSchema,
} from '../lib/schemas';
import api from '../api/apiService';
import authStyles from '../components/AuthLayout.module.css';
import toast from 'react-hot-toast'; // <-- 1. IMPORT TOAST

// API function
const requestPasswordReset = async (
  data: TForgotPasswordSchema
): Promise<{ message: string }> => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const ForgotPasswordPage = () => {
  // --- 2. 'successMessage' STATE IS GONE ---
  // const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // --- 3. 'setError' IS GONE ---
  } = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      // --- 4. USE TOAST INSTEAD OF 'setSuccessMessage' ---
      toast.success(
        `${data.message} Check your backend console for the link.`
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'An error occurred. Please try again.';
      // --- 5. USE TOAST INSTEAD OF 'setError' ---
      toast.error(message);
    },
  });

  const onSubmit = (data: TForgotPasswordSchema) => {
    // setSuccessMessage(''); // <-- This is gone
    mutation.mutate(data);
  };

  // --- 6. THIS IS THE SIMPLIFIED RETURN BLOCK ---
  return (
    <>
      <h2 className={authStyles.formtitle}>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            marginBottom: '1rem',
          }}
        >
          Enter your email and we'll send you a (mock) reset link.
        </p>
        
        {/* 'errors.root' JSX is removed */}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="form-input"
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className={authStyles.footerText}>
        Remember your password?{' '}
        <Link to="/login" className={authStyles.link}>
          Log In
        </Link>
      </p>
    </>
  );
};