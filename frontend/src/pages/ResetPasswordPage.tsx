import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom'; 
import { resetPasswordSchema, type TResetPasswordSchema } from '../lib/schemas';
import { useAuthStore } from '../store/authStore';
import api from '../api/apiService';
import authStyles from '../components/AuthLayout.module.css';
import toast from 'react-hot-toast';


interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}


const resetPassword = async (
  data: TResetPasswordSchema & { token: string }
): Promise<AuthResponse> => {
  const { password, token } = data;
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { token } = useParams<{ token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },

  } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      login(
        { _id: data._id, name: data.name, email: data.email },
        data.token
      );
      navigate('/todos');
      toast.success('Password reset successfully!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(message);
    },
  });

  const onSubmit = (data: TResetPasswordSchema) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    mutation.mutate({ ...data, token });
  };

  return (
    <>
      <h2 className={authStyles.formtitle}>Reset Your Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>


        <div className="form-group">
          <label htmlFor="password" className="form-label">
            New Password
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
            Confirm New Password
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
          {isSubmitting ? 'Saving...' : 'Set New Password'}
        </button>
      </form>
    </>
  );
};