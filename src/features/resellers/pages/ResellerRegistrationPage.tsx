import { getDistributorPublicProfile, registerAsReseller } from '@/features/resellers/api';
import type { ResellerRegistrationData } from '@/features/resellers/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';

const RANK_LABELS: Record<string, string> = {
    STARTER:  'Starter',
    BRONZE:   'Bronze',
    SILVER:   'Silver',
    GOLD:     'Gold',
    PLATINUM: 'Platinum',
    DIAMOND:  'Diamond',
};

export default function ResellerRegistrationPage(): React.ReactElement {
    const { referralCode } = useParams({ strict: false });

    const [form, setForm] = useState<ResellerRegistrationData>({
        first_name: '',
        last_name:  '',
        email:      '',
        phone:      '',
        city:       '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [resellerCode, setResellerCode] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const code = referralCode ?? '';

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['public-distributor-profile', code],
        queryFn: () => getDistributorPublicProfile(code),
        enabled: code.length > 0,
        retry: false,
    });

    const profile = profileData?.success ? profileData.data : null;
    const profileNotFound = profileData && !profileData.success;

    const register = useMutation({
        mutationFn: () => registerAsReseller(code, form),
        onSuccess: (result) => {
            if (result.success) {
                setResellerCode(result.data.reseller_code);
                setSubmitted(true);
                setApiError(null);
                setFieldErrors({});
            } else {
                setApiError(result.message);
                setFieldErrors(result.errors ?? {});
            }
        },
        onError: () => {
            setApiError('Something went wrong. Please try again.');
        },
    });

    function handleChange(field: keyof ResellerRegistrationData): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            setFieldErrors((prev) => ({ ...prev, [field]: [] }));
        };
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setApiError(null);
        register.mutate();
    }

    if (!code) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div role="alert" className="max-w-md w-full rounded-xl bg-red-50 border border-red-200 px-6 py-8 text-center">
                    <h1 className="text-lg font-bold text-red-700 mb-2">Invalid Link</h1>
                    <p className="text-sm text-red-600">This registration link is missing a distributor code.</p>
                </div>
            </main>
        );
    }

    if (profileLoading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <p className="text-sm text-gray-400">Loading...</p>
            </main>
        );
    }

    if (profileNotFound || !profile) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div role="alert" className="max-w-md w-full rounded-xl bg-red-50 border border-red-200 px-6 py-8 text-center">
                    <h1 className="text-lg font-bold text-red-700 mb-2">Link Not Available</h1>
                    <p className="text-sm text-red-600">
                        This registration link is invalid or the distributor is not currently accepting applications.
                    </p>
                </div>
            </main>
        );
    }

    if (submitted && resellerCode) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <section className="max-w-md w-full rounded-xl bg-white border border-gray-200 px-6 py-10 text-center space-y-4 shadow-sm">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-2">
                        <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Application Submitted</h1>
                    <p className="text-sm text-gray-600">
                        Your application to join <span className="font-semibold">{profile.distributor_code}</span>'s network
                        has been received and is pending review.
                    </p>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-left space-y-1">
                        <p className="text-xs text-gray-500">Your reseller code</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">{resellerCode}</p>
                        <p className="text-xs text-gray-400">Save this code for your records.</p>
                    </div>
                    <p className="text-xs text-gray-400">
                        You will be notified once your application has been reviewed.
                    </p>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4" style={{ scrollbarGutter: 'stable' }}>
            <div className="max-w-lg mx-auto space-y-6">

                {/* Distributor context banner */}
                <header className="text-center space-y-1">
                    <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Reseller Registration</p>
                    <h1 className="text-2xl font-bold text-gray-900">Join {profile.distributor_code}</h1>
                    <p className="text-sm text-gray-500">
                        {profile.assigned_city
                            ? `Distributor based in ${profile.assigned_city}`
                            : 'National distributor'}
                        {' '}&mdash;{' '}
                        <span className="font-medium text-gray-700">{RANK_LABELS[profile.rank] ?? profile.rank} Rank</span>
                    </p>
                </header>

                {/* Form card */}
                <section className="bg-white rounded-xl border border-gray-200 px-6 py-8 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-800 mb-6">Your Information</h2>

                    {apiError && (
                        <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="first_name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={form.first_name}
                                    onChange={handleChange('first_name')}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                />
                                {fieldErrors['first_name']?.map((err) => (
                                    <p key={err} className="text-xs text-red-600">{err}</p>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="last_name"
                                    type="text"
                                    autoComplete="family-name"
                                    value={form.last_name}
                                    onChange={handleChange('last_name')}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                />
                                {fieldErrors['last_name']?.map((err) => (
                                    <p key={err} className="text-xs text-red-600">{err}</p>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange('email')}
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                            {fieldErrors['email']?.map((err) => (
                                <p key={err} className="text-xs text-red-600">{err}</p>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                value={form.phone}
                                onChange={handleChange('phone')}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                            {fieldErrors['phone']?.map((err) => (
                                <p key={err} className="text-xs text-red-600">{err}</p>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City <span className="text-gray-400 font-normal text-xs">(optional)</span>
                            </label>
                            <input
                                id="city"
                                type="text"
                                autoComplete="address-level2"
                                value={form.city}
                                onChange={handleChange('city')}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                            <p className="text-xs text-gray-400">You can register from anywhere.</p>
                            {fieldErrors['city']?.map((err) => (
                                <p key={err} className="text-xs text-red-600">{err}</p>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={register.isPending || !form.first_name || !form.last_name || !form.email}
                            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {register.isPending ? 'Submitting...' : 'Submit Application'}
                        </button>

                    </form>
                </section>

                <footer className="text-center text-xs text-gray-400">
                    Your information is used solely for the purpose of processing your reseller application.
                </footer>
            </div>
        </main>
    );
}
