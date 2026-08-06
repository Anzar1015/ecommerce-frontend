import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { registerFormSchema, type RegisterFormValues } from '@/utils/authValidation';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    const result = await registerUser(values);
    setIsSubmitting(false);

    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string) ?? 'Registration failed');
      return;
    }

    toast.success('Account created! Welcome aboard.');
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start shopping in less than a minute">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
