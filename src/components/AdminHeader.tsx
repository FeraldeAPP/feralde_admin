"use client"

import * as React from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Home01Icon,
    GlobalIcon,
    BubbleChatIcon,
    Notification02Icon,
    Moon02Icon,
    MoreHorizontalIcon,
    Logout02Icon,
    ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { logout } from "@/features/auth/api"
import { useAuthStore } from "@/stores/auth-store"

export default function DashboardHeader() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const setUser = useAuthStore((s) => s.setUser)
    const pathSegments = pathname?.split('/').filter(Boolean) || []

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setUser(null)
            navigate({ to: '/login' })
        }
    }

    return (
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#F2F2F2] bg-white px-4 font-[var(--font-bricolage)]">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <SidebarTrigger className="h-8 w-8 border border-[#F2F2F2] rounded-lg text-[#A5A5A5] hover:bg-gray-50 flex items-center justify-center p-0" />

                    <div className="flex items-center gap-1 ml-0.5">
                        <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                        </button>
                        <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                        </button>
                        <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors ml-0.5">
                            <HugeiconsIcon icon={Home01Icon} size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center text-[13px] font-medium tracking-tight">
                    <span className="text-[#A5A5A5] hover:text-[#393939] cursor-pointer transition-colors">Menu</span>
                    {pathSegments.map((segment, i) => (
                        <React.Fragment key={i}>
                            <span className="mx-1.5 text-[#A5A5A5] text-[11px]">/</span>
                            <span className={`${i === pathSegments.length - 1 ? 'text-[#393939]' : 'text-[#A5A5A5]'} capitalize`}>
                                {segment.replace(/-/g, ' ')}
                            </span>
                        </React.Fragment>
                    ))}
                    {pathSegments.length === 0 && (
                        <>
                            <span className="mx-1.5 text-[#A5A5A5] text-[11px]">/</span>
                            <span className="text-[#393939]">Dashboard</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Avatars */}
                <div className="flex -space-x-2.5 mr-1 active:scale-95 transition-transform cursor-pointer">
                    {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
                    ].map((src, i) => (
                        <div key={i} className="h-[24px] w-[24px] rounded-full border-2 border-white overflow-hidden shadow-sm">
                            <img
                                src={src}
                                alt={`Avatar ${i + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="h-4 w-px bg-[#F2F2F2]" />

                {/* Language Switcher */}
                <div className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group">
                    <HugeiconsIcon icon={GlobalIcon} size={16} className="text-[#A5A5A5] group-hover:text-[#393939] transition-colors" />
                    <div className="h-[14px] w-[20px] relative rounded-[2px] overflow-hidden shadow-sm">
                        <img
                            src="https://flagcdn.com/w40/gb.png"
                            alt="UK Flag"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-[11px] font-medium text-[#B7B7B7] uppercase group-hover:text-[#393939] transition-colors">Eng</span>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-[#B7B7B7]" />
                </div>

                <div className="h-4 w-px bg-[#F2F2F2]" />

                {/* Quick Actions */}
                <div className="flex items-center gap-1.5">
                    <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                        <HugeiconsIcon icon={BubbleChatIcon} size={16} />
                    </button>
                    <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                        <HugeiconsIcon icon={Notification02Icon} size={16} />
                    </button>
                    <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                        <HugeiconsIcon icon={Moon02Icon} size={16} />
                    </button>
                </div>

                {/* Quick Menu Button */}
                <button className="flex items-center gap-1.5 bg-[#393939] text-white h-[30px] px-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#2d2d2d] active:scale-95 transition-all ml-0.5 shadow-[0_1px_3px_rgba(39,39,39,0.2)]">
                    Quick Menu
                    <div className="w-px h-2.5 bg-white/20 mx-0.5" />
                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
                </button>

                {/* More & Logout */}
                <div className="flex items-center gap-0.5">
                    <button className="h-8 w-8 border border-[#F2F2F2] rounded-lg flex items-center justify-center text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                    </button>
                    <button onClick={handleLogout} className="h-8 w-8 flex items-center justify-center text-[#A5A5A5] hover:text-[#393939] hover:bg-gray-50 rounded-lg transition-colors ml-0.5 active:scale-90">
                        <HugeiconsIcon icon={Logout02Icon} size={16} />
                    </button>
                </div>
            </div>
        </header>
    )
}
