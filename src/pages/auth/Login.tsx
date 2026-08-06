import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { loginFormSchema, type LoginFormValues } from '@/utils/authValidation';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const result = await login(values);
    setIsSubmitting(false);

    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string) ?? 'Login failed');
      return;
    }

    toast.success('Welcome back!');
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue shopping">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-brand-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-brand-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
