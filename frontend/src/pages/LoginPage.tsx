// src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema, type TLoginSchema } from '../lib/schemas';
import { useAuthStore } from '../store/authStore';
import api from '../api/apiService';
import toast from 'react-hot-toast';
import authStyles from '../components/AuthLayout.module.css'; // Import shared styles

// ... (keep the AuthResponse interface and loginUser function)
interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}
const loginUser = async (data: TLoginSchema): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(
        { _id: data._id, name: data.name, email: data.email },
        data.token
      );
      navigate('/todos');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
        toast.error(message);

    },
  });

  const onSubmit = (data: TLoginSchema) => {
    mutation.mutate(data);
  };

  return (
    <>
      <h2 className={authStyles.formtitle}>Log In</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

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

        {/* --- THIS IS THE UPDATED BLOCK --- */}
        <div className="form-group">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Link
              to="/forgot-password"
              className={authStyles.link}
              style={{ fontSize: '0.9rem' }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="form-input"
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>
        {/* --- END OF UPDATED BLOCK --- */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className={authStyles.footerText}>
        Don't have an account?{' '}
        <Link to="/signup" className={authStyles.link}>
          Sign Up
        </Link>
      </p>
    </>
  );
};