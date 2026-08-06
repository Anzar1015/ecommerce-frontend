import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/services/auth.service';
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@/utils/authValidation';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordFormSchema) });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ token, password: values.password });
      toast.success('Password reset successfully. Please log in.');
      navigate('/login', { replace: true });
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'This reset link is invalid or has expired';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link to="/login" className="font-medium text-brand-primary hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
