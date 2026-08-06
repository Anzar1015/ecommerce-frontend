import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/services/auth.service';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@/utils/authValidation';

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordFormSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(values);
      setSubmitted(true);
    } catch {
      // We intentionally show the same success state even on failure,
      // so we don't leak which emails are registered.
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Check your inbox" subtitle="">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <MailCheck className="h-10 w-10 text-brand-primary" aria-hidden="true" />
          <p className="text-sm text-text-secondary">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
            It expires in 15 minutes.
          </p>
          <Link to="/login" className="mt-2 text-sm font-medium text-brand-primary hover:underline">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-brand-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
