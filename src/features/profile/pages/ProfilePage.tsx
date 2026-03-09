import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { changePassword, resendVerificationEmail, resetPasswordWithToken } from '@/api/endpoints';
import type { ChangePasswordPayload, ResetPasswordPayload } from '@/api/types';

export default function ProfilePage(): React.ReactElement {
  const { user } = useAuthStore();

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <header>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Account settings and security options.</p>
      </header>

      <AccountSection />
      <EmailVerificationSection />
      <ChangePasswordSection />
      <ResetPasswordSection />

      {/* Consume user to satisfy usage if needed */}
      {user && null}
    </div>
  );
}

function AccountSection(): React.ReactElement {
  const { user } = useAuthStore();

  if (!user) return <></>;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex gap-8">
          <dt className="w-28 text-gray-500 shrink-0">Name</dt>
          <dd className="text-gray-900 font-medium">{user.name}</dd>
        </div>
        <div className="flex gap-8">
          <dt className="w-28 text-gray-500 shrink-0">Email</dt>
          <dd className="text-gray-900">{user.email}</dd>
        </div>
        <div className="flex gap-8">
          <dt className="w-28 text-gray-500 shrink-0">Email status</dt>
          <dd>
            {user.email_verified_at ? (
              <span className="inline-flex text-xs px-2 py-0.5 rounded-full border border-emerald-400 text-emerald-600 font-medium">
                Verified
              </span>
            ) : (
              <span className="inline-flex text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-500 font-medium">
                Unverified
              </span>
            )}
          </dd>
        </div>
        <div className="flex gap-8">
          <dt className="w-28 text-gray-500 shrink-0">Roles</dt>
          <dd className="flex flex-wrap gap-1">
            {user.roles.length === 0 ? (
              <span className="text-gray-400">No roles assigned</span>
            ) : (
              user.roles.map((role) => (
                <span
                  key={role.id}
                  className="inline-flex text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium"
                >
                  {role.name}
                </span>
              ))
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function EmailVerificationSection(): React.ReactElement {
  const [verificationLink, setVerificationLink] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (res) => {
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    },
    onError: () => {
      setFeedback({ type: 'error', message: 'Failed to resend verification email.' });
    },
  });

  function handleVerifyLink(e: React.FormEvent) {
    e.preventDefault();
    setFeedback({ type: 'success', message: 'Please open the verification link in your browser.' });
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Email Verification</h2>

      {feedback && (
        <div
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <button
        type="button"
        onClick={() => { setFeedback(null); resendMutation.mutate(); }}
        disabled={resendMutation.isPending}
        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        {resendMutation.isPending ? 'Sending...' : 'Resend Verification Email'}
      </button>

      <form onSubmit={handleVerifyLink} className="space-y-2">
        <label htmlFor="verify-link" className="block text-sm text-gray-600">
          Or paste the verification link from your email:
        </label>
        <div className="flex gap-2">
          <input
            id="verify-link"
            type="url"
            value={verificationLink}
            onChange={(e) => setVerificationLink(e.target.value)}
            placeholder="https://..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Verify
          </button>
        </div>
      </form>
    </section>
  );
}

function ChangePasswordSection(): React.ReactElement {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const changeMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: (res) => {
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    },
    onError: () => {
      setFeedback({ type: 'error', message: 'Failed to change password.' });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    changeMutation.mutate({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Change Password</h2>

      {feedback && (
        <div
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">Min 8 characters</p>
        </div>

        <div>
          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm password
          </label>
          <input
            id="confirm-new-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={changeMutation.isPending}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {changeMutation.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </section>
  );
}

function ResetPasswordSection(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const resetMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordWithToken(payload),
    onSuccess: (res) => {
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setEmail('');
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    },
    onError: () => {
      setFeedback({ type: 'error', message: 'Failed to reset password.' });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    resetMutation.mutate({
      email,
      token,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Reset Password (via Token)</h2>
        <p className="text-sm text-gray-500 mt-0.5">Use a token from a reset email to set a new password.</p>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="reset-token" className="block text-sm font-medium text-gray-700 mb-1">
            Token
          </label>
          <input
            id="reset-token"
            type="text"
            required
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="reset-new-password" className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <input
            id="reset-new-password"
            type="password"
            required
            minLength={8}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm password
          </label>
          <input
            id="reset-confirm-password"
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={resetMutation.isPending}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </section>
  );
}
