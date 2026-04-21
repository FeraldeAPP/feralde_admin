import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Tick01Icon,
    ArrowRight01Icon,
    ArrowLeft01Icon,
    PackageIcon,
    Location01Icon,
    Wallet02Icon,
    Image01Icon,
    AlertCircleIcon,
    Link01Icon
} from '@hugeicons/core-free-icons';
import { PACKAGES, PHILIPPINE_CITIES } from './onboarding.data';
import type { City } from './onboarding.data';
import PhilippinesMap from './PhilippinesMap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import UnavailableModal from './UnavailableModal';
import { useEffect, useRef } from 'react';

import { useMyDistributorProfile } from '@/features/distributors/hooks/use-distributors';

type Step = 'package' | 'location' | 'payment' | 'success';

export default function OnboardingPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, signOut } = useAuth();

    const [currentStep, setCurrentStep] = useState<Step>('package');
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [socials, setSocials] = useState({ facebook: '', tiktok: '' });
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUnavailableModal, setShowUnavailableModal] = useState(false);
    const [unavailableCity, setUnavailableCity] = useState('');

    // Track if we have already pre-filled the form to avoid overwriting user changes
    const hasPreFilled = useRef(false);

    const { data: profileResponse, isLoading: isLoadingProfile } = useMyDistributorProfile();

    useEffect(() => {
        if (profileResponse?.success && profileResponse.data && !hasPreFilled.current) {
            const profile = profileResponse.data;
            
            if (profile.business_type) {
                setSelectedPackage(profile.business_type.toLowerCase());
            }
            
            if (profile.selected_city) {
                const cityObj = PHILIPPINE_CITIES.find(c => c.name === profile.selected_city);
                if (cityObj) {
                    setSelectedCity(cityObj);
                }
            }
            
            if (profile.facebook_url || profile.tiktok_username) {
                setSocials({
                    facebook: profile.facebook_url || '',
                    tiktok: profile.tiktok_username || '',
                });
            }

            hasPreFilled.current = true;
        }
    }, [profileResponse]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onboardMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.post('/api/distributors/onboard', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: () => {
            toast.success('Onboarding data submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['distributors', 'me'] });
            setCurrentStep('success');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Something went wrong';
            toast.error(message);
        }
    });

    const handleComplete = () => {
        if (!selectedPackage || !selectedCity || !paymentProof) return;

        const formData = new FormData();
        formData.append('business_type', selectedPackage);
        formData.append('selected_city', selectedCity.name);
        formData.append('facebook_url', socials.facebook);
        formData.append('tiktok_username', socials.tiktok);
        formData.append('payment_proof', paymentProof);

        onboardMutation.mutate(formData);
    };

    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <div className="size-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto" />
                    <p className="uppercase text-[10px] font-black tracking-[0.2em] text-stone-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (currentStep === 'success') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                        <HugeiconsIcon icon={Tick01Icon} className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-stone-900">Application Submitted!</h1>
                        <p className="text-stone-500">
                            Your payment proof and profile details are now being verified by our team.
                            We will notify you once your dashboard is fully activated.
                        </p>
                    </div>
                    <Button onClick={() => navigate({ to: '/' })} className="w-full h-12 bg-stone-900 text-white rounded-xl font-bold">
                        Go to Overview
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Minimal Header */}
            <header className="h-20 border-b border-stone-100 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">F</div>
                    <span className="font-bold text-stone-900 tracking-tight">Onboarding</span>
                </div>
                <Button variant="ghost" onClick={signOut} className="text-stone-400 hover:text-stone-900">Sign Out</Button>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row h-full">
                {/* Steps Sidebar */}
                <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-stone-100 bg-stone-50/50 p-8 space-y-8">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-stone-900">Step {currentStep === 'package' ? 1 : currentStep === 'location' ? 2 : 3} of 3</h2>
                        <p className="text-stone-500 text-sm">Follow the steps to activate your account.</p>
                    </div>

                    <nav className="space-y-4">
                        {[
                            { id: 'package', label: 'Select Package', icon: PackageIcon },
                            { id: 'location', label: 'Assign Territory', icon: Location01Icon },
                            { id: 'payment', label: 'Payment Verification', icon: Wallet02Icon },
                        ].map((s, idx) => {
                            const isDone = (currentStep === 'location' && idx === 0) || (currentStep === 'payment' && idx < 2);
                            const isActive = currentStep === s.id;
                            return (
                                <div key={s.id} className={`flex items-center gap-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'}`}>
                                        <HugeiconsIcon icon={isDone ? Tick01Icon : s.icon} className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">Step {idx + 1}</p>
                                        <p className="font-bold text-stone-900 leading-none">{s.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-white p-8 lg:p-16">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {currentStep === 'package' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-stone-900 tracking-tight">Choice of Package</h1>
                                    <p className="text-lg text-stone-500">Please confirm your distributor package to proceed.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {PACKAGES.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg.id)}
                                            className={`group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedPackage === pkg.id ? 'ring-4 ring-stone-900 scale-[1.02]' : 'hover:scale-[1.01] grayscale-[0.2] hover:grayscale-0'}`}
                                        >
                                            <img src={pkg.image} alt={pkg.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                            <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">{pkg.discount}</div>

                                            <div className="absolute bottom-6 left-6 right-6 space-y-1">
                                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{pkg.label} Package</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-white text-2xl font-black">{pkg.price}</span>
                                                    <span className="text-white/40 text-xs line-through">{pkg.originalPrice}</span>
                                                </div>
                                            </div>

                                            {selectedPackage === pkg.id && (
                                                <div className="absolute top-4 left-4 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                                    <HugeiconsIcon icon={Tick01Icon} className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-8">
                                    <Button
                                        onClick={() => setCurrentStep('location')}
                                        disabled={!selectedPackage}
                                        className="h-14 px-10 bg-stone-900 text-white rounded-2xl font-bold flex items-center gap-3 transition-all hover:gap-5 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Continue to Location <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 'location' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-stone-900 tracking-tight">Your Territory</h1>
                                    <p className="text-lg text-stone-500">Select the city you will be serving as an exclusive distributor.</p>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <HugeiconsIcon icon={Link01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <Input
                                        placeholder="Search your city..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-14 pl-12 bg-stone-50 border-stone-100 rounded-2xl focus:ring-stone-900 focus:border-stone-900 text-lg"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
                                        >
                                            <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Search Results */}
                                {searchQuery && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-stone-50 rounded-2xl border border-stone-100">
                                        {PHILIPPINE_CITIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 12).map(city => (
                                            <button
                                                key={city.name}
                                                onClick={() => {
                                                    if (city.available) {
                                                        setSelectedCity(city);
                                                        setSearchQuery('');
                                                    } else {
                                                        setUnavailableCity(city.name);
                                                        setShowUnavailableModal(true);
                                                    }
                                                }}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-left"
                                            >
                                                <div className={`w-2 h-2 rounded-full ${city.available ? 'bg-red-500' : 'bg-stone-300'}`} />
                                                <span className="font-bold text-stone-700">{city.name}</span>
                                                {!city.available && <span className="text-[10px] bg-stone-200 text-stone-500 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter ml-auto">Full</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 space-y-4">
                                            <div className="space-y-1">
                                                <Label className="uppercase text-[10px] font-black tracking-[0.2em] text-stone-400">Social Presence</Label>
                                                <div className="space-y-3 pt-2">
                                                    <div className="relative">
                                                        <HugeiconsIcon icon={Link01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                                        <Input
                                                            placeholder="Facebook Profile URL"
                                                            value={socials.facebook}
                                                            onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                                                            className="h-12 pl-12 bg-white border-stone-200 rounded-xl focus:ring-stone-900 focus:border-stone-900"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <HugeiconsIcon icon={Link01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                                        <Input
                                                            placeholder="TikTok Username"
                                                            value={socials.tiktok}
                                                            onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                                                            className="h-12 pl-12 bg-white border-stone-200 rounded-xl focus:ring-stone-900 focus:border-stone-900"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedCity && (
                                            <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm border border-green-200">
                                                    <HugeiconsIcon icon={Location01Icon} className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="uppercase text-[10px] font-black tracking-widest text-green-600/60 leading-none mb-1">Assigned City</p>
                                                    <p className="text-xl font-black text-green-900 leading-none">{selectedCity.name}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedCity(null)}
                                                    className="ml-auto p-2 text-green-300 hover:text-green-600 transition-colors"
                                                >
                                                    <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 rotate-45" />
                                                </button>
                                            </div>
                                        )}

                                        {!selectedCity && (
                                            <div className="p-6 bg-stone-50 rounded-3xl border border-dashed border-stone-200 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-300 shadow-sm">
                                                    <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
                                                </div>
                                                <p className="text-stone-400 font-medium">Please select a city on the map</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-[520px]">
                                        <PhilippinesMap
                                            selectedPin={selectedCity?.name}
                                            onPinClick={(city) => {
                                                if (city.available) {
                                                    setSelectedCity(city);
                                                } else {
                                                    setUnavailableCity(city.name);
                                                    setShowUnavailableModal(true);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-8">
                                    <Button onClick={() => setCurrentStep('package')} variant="ghost" className="h-14 px-8 font-bold flex items-center gap-3 text-stone-400 hover:text-stone-900">
                                        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" /> Back
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep('payment')}
                                        disabled={!selectedCity || !socials.facebook || !socials.tiktok}
                                        className="h-14 px-10 bg-stone-900 text-white rounded-2xl font-bold flex items-center gap-3 transition-all hover:gap-5 disabled:opacity-30"
                                    >
                                        Proceed to Payment <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {showUnavailableModal && (
                            <UnavailableModal
                                city={unavailableCity}
                                onClose={() => setShowUnavailableModal(false)}
                            />
                        )}

                        {currentStep === 'payment' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-stone-900 tracking-tight">Final Step</h1>
                                    <p className="text-lg text-stone-500">Upload your payment proof to complete the verification process.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100 space-y-6">
                                            <div className="space-y-1">
                                                <p className="uppercase text-[10px] font-black tracking-[0.2em] text-stone-400">Payment Breakdown</p>
                                                <div className="flex justify-between items-end pt-2">
                                                    <p className="text-3xl font-black text-stone-900">{PACKAGES.find(p => p.id === selectedPackage)?.price}</p>
                                                    <p className="text-stone-400 font-bold mb-1">Package Total</p>
                                                </div>
                                            </div>

                                            <div className="h-px bg-stone-200" />

                                            <div className="space-y-4">
                                                <p className="uppercase text-[10px] font-black tracking-[0.2em] text-stone-400">Payment Channels</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="p-4 bg-white border border-stone-100 rounded-2xl flex items-center justify-between">
                                                        <span className="font-bold text-stone-900">GCash</span>
                                                        <span className="font-mono text-stone-500">0917-XXX-XXXX</span>
                                                    </div>
                                                    <div className="p-4 bg-white border border-stone-100 rounded-2xl flex items-center justify-between">
                                                        <span className="font-bold text-stone-900">BDO</span>
                                                        <span className="font-mono text-stone-500">0012-3456-XXXX</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 text-sm font-medium">
                                            <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 shrink-0" />
                                            Verification may take 24-48 hours after submission.
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="file"
                                            id="payment-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="payment-upload"
                                            className={`flex flex-col items-center justify-center aspect-[4/5] rounded-[40px] border-4 border-dashed cursor-pointer transition-all ${previewUrl ? 'border-stone-900' : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'}`}
                                        >
                                            {previewUrl ? (
                                                <div className="relative w-full h-full p-4">
                                                    <img src={previewUrl} className="w-full h-full object-cover rounded-[32px] shadow-2xl" alt="Proof preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center">
                                                        <div className="bg-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest text-stone-900">Change Photo</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-4">
                                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center mx-auto text-stone-400 group-hover:text-stone-900 transition-colors">
                                                        <HugeiconsIcon icon={Image01Icon} className="w-8 h-8" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-black text-stone-900 tracking-tight">Click to Upload Proof</p>
                                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">PNG, JPG up to 10MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-8">
                                    <Button onClick={() => setCurrentStep('location')} variant="ghost" className="h-14 px-8 font-bold flex items-center gap-3 text-stone-400 hover:text-stone-900">
                                        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" /> Back
                                    </Button>
                                    <Button
                                        onClick={handleComplete}
                                        disabled={!paymentProof || onboardMutation.isPending}
                                        className="h-14 px-10 bg-stone-900 text-white rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
                                    >
                                        {onboardMutation.isPending ? 'Verifying...' : 'Complete Activation'} <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
