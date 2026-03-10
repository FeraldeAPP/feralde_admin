import { login } from '@/features/auth/api';
import { isAxiosError } from '@/lib/api/client';
import { useAuthStore } from '@/stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { router } from '@/routes';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });
  const { isLoading, setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await login(values);
      if (res.success) {
        setUser(res.data);
        // The router will handle the redirect via beforeLoad + invalidate in App.tsx
        if (search.redirect) {
          router.history.push(search.redirect);
        } else {
          navigate({ to: '/' });
        }
      } else {
        setServerError(res.message);
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { message?: string };
        setServerError(data.message ?? 'Login failed');
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="min-h-screen flex font-[var(--font-bricolage)] selection:bg-[#A594F9]/30">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#A594F9] opacity-20 blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-[#008BFF] opacity-10 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center gap-2 ">
            <div className="relative w-12 h-12">
              <img
                src="/logo.jpg"
                alt="Feralde Logo"
                className="object-contain"
              />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight text-[#393939]">Feralde</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg mb-20">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#E5E5E5] text-[12px] font-bold tracking-wide uppercase">System Operational</span>
          </div> */}

          <h2 className="text-white text-[44px] font-bold leading-[1.1] tracking-tight">
            Manage your store<br />with absolute confidence.
          </h2>
          <p className="text-[#A5A5A5] text-[16px] leading-relaxed font-medium max-w-md">
            Full control over products, inventory, and analytics — seamlessly integrated into one powerful dashboard.
          </p>

        </div>

        <p className="relative z-10 text-[#A5A5A5] text-[13px] font-medium">&copy; {new Date().getFullYear()} Feralde Ecom</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 mx-auto lg:flex-none lg:w-1/2 xl:w-5/12 bg-white font-[var(--font-bricolage)] text-[#393939]">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}


          <h2 className="text-[28px] font-bold tracking-tight text-[#393939]">
            Welcome back
          </h2>
          <p className="mt-1.5 text-[15px] font-medium text-[#A5A5A5]">
            Enter your administrator credentials to access the dashboard.
          </p>

          {serverError && (
            <div role="alert" className="mt-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-4 py-3.5 text-[13px] font-bold text-[#EF4444] flex items-start gap-3">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span className="leading-snug">{serverError}</span>
            </div>
          )}

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <label htmlFor="email" className="block text-[14px] font-bold text-[#393939] mb-2">
                  Email address
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className={`block w-full pl-10 pr-3 h-12 border rounded-xl focus:ring-4 focus:ring-[#A594F9]/10 focus:border-[#A594F9] text-[14px] transition-all outline-none bg-[#FAFAFA] text-[#393939] placeholder:text-[#A5A5A5] ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="admin@feralde.com"
                  />
                </div>
                {errors.email && <p className="mt-2 text-[12px] font-bold text-[#EF4444]">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-[14px] font-bold text-[#393939] mb-2">
                  Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register('password')}
                    className={`block w-full pl-10 pr-10 h-12 border rounded-xl focus:ring-4 focus:ring-[#A594F9]/10 focus:border-[#A594F9] text-[14px] transition-all outline-none bg-[#FAFAFA] text-[#393939] placeholder:text-[#A5A5A5] ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="mt-2 text-[12px] font-bold text-[#EF4444]">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#A594F9] focus:ring-[#A594F9] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-[#71717A]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-bold text-[#008BFF] hover:text-[#008BFF]/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-[14px] font-bold text-white bg-[#393939] hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in to Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
