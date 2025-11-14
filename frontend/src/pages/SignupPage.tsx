// src/pages/SignupPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { signupSchema, type TSignupSchema } from '../lib/schemas';
import { useAuthStore } from '../store/authStore';
import api from '../api/apiService';
import authStyles from '../components/AuthLayout.module.css'; // Import shared styles
import toast from 'react-hot-toast';

// ... (keep the AuthResponse interface and registerUser function)
interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}
const registerUser = async (data: TSignupSchema): Promise<AuthResponse> => {
  const { name, email, password } = data;
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema), 
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(
        { _id: data._id, name: data.name, email: data.email },
        data.token
      );
      navigate('/todos');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Signup failed. Please try again.';
        toast.error(message);
    },
  });

  const onSubmit = (data: TSignupSchema) => {
    mutation.mutate(data);
  };

  return (
    <>
      <h2 className={authStyles.formtitle}>Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="form-input"
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

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
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
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

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="form-input"
          />
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className={authStyles.footerText}>
        Already have an account?{' '}
        <Link to="/login" className={authStyles.link}>
          Log In
        </Link>
      </p>
    </>
  );
};