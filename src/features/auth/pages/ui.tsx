import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const areaData = [
    { name: 'JAN', value: 15 },
    { name: 'FEB', value: 25 },
    { name: 'MAR', value: 20 },
    { name: 'APR', value: 35 },
    { name: 'MAY', value: 45 },
    { name: 'JUN', value: 38 },
    { name: 'JUL', value: 68 },
    { name: 'AUG', value: 42 },
    { name: 'SEP', value: 48 },
    { name: 'OCT', value: 40 },
    { name: 'NOV', value: 55 },
    { name: 'DEC', value: 50 },
];

const pieData = [
    { name: 'Manual', value: 400, fill: '#bfdbfe' },
    { name: 'Gateway', value: 300, fill: '#3b82f6' },
    { name: 'COD', value: 300, fill: '#1e3a8a' },
    { name: 'Maya', value: 200, fill: '#60a5fa' },
];

export default function App() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-white flex font-sans text-gray-900">
            {/* Left Panel - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="bg-[#141414] text-white p-1.5 rounded-lg flex items-center justify-center w-10 h-10">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-[#141414]">Feralde</span>
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your administrator credentials to access the dashboard.
                    </p>

                    <div className="mt-8">
                        <form className="space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-2 relative rounded-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors outline-none bg-gray-50/50"
                                        placeholder="admin@feralde.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-2 relative rounded-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors outline-none bg-gray-50/50"
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
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-[#141414] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                                >
                                    Sign in to Dashboard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Panel - Minimal Dashboard Preview */}
            <div className="hidden lg:flex lg:flex-1 bg-[#f8f9fa] border-l border-gray-200 items-center justify-center p-12 overflow-hidden relative">
                {/* Subtle gradient overlay to push focus to the left */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60 z-10 pointer-events-none"></div>

                <div className="w-full max-w-4xl space-y-6 opacity-50 pointer-events-none select-none transform scale-95 origin-center">
                    {/* Header Mock */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
                            <div className="h-8 w-64 bg-gray-300 rounded"></div>
                        </div>
                        <div className="h-10 w-32 bg-white border border-gray-200 rounded-lg"></div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <div className="h-3 w-24 bg-gray-200 rounded mb-6"></div>
                                <div className="h-8 w-20 bg-gray-800 rounded mb-3"></div>
                                <div className="h-3 w-16 bg-green-100 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Area Chart Card */}
                        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="h-5 w-40 bg-gray-800 rounded mb-3"></div>
                                    <div className="h-3 w-56 bg-gray-300 rounded"></div>
                                </div>
                                <div className="h-6 w-24 bg-gray-800 rounded"></div>
                            </div>
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={areaData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart Card */}
                        <div className="col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="h-5 w-40 bg-gray-800 rounded mb-3"></div>
                            <div className="h-3 w-48 bg-gray-300 rounded mb-8"></div>
                            <div className="h-56 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
