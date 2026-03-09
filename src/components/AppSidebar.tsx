"use client"

import * as React from "react"
import { useLocation, Link } from "@tanstack/react-router"
import {
    Home01Icon,
    ShoppingBag01Icon,
    UserMultiple02Icon,
    PackageIcon,
    CourseIcon,
    ChartAverageIcon,
    Wallet02Icon,
    Coins01Icon,
    ActivityIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"


const navItems = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                url: "/distributor", // Updated to match current app structure
                icon: Home01Icon,
            },
        ],
    },
    {
        label: "Management",
        items: [
            {
                title: "E-Commerce",
                url: "/ecommerce",
                icon: ShoppingBag01Icon,
            },
            {
                title: "Distributor",
                url: "/dashboard/distributor",
                icon: UserMultiple02Icon,
            },
            {
                title: "Inventory",
                url: "/inventory",
                icon: PackageIcon,
            },
        ],
    },
    {
        label: "Operations",
        items: [
            {
                title: "Trainings & Modules",
                url: "/trainings",
                icon: CourseIcon,
            },
            {
                title: "Marketing Tools",
                url: "/marketing",
                icon: ChartAverageIcon,
            },
        ],
    },
    {
        label: "Finance",
        items: [
            {
                title: "Expense AP",
                url: "/finance/expense",
                icon: Wallet02Icon,
            },
            {
                title: "Revenue AR",
                url: "/finance/revenue",
                icon: Coins01Icon,
            },
            {
                title: "Profit & Loss",
                url: "/finance/profit-loss",
                icon: ActivityIcon,
            },
        ],
    },
    {
        label: "Administration",
        items: [
            {
                title: "Staffs & Users",
                url: "/staffs",
                icon: UserMultiple02Icon,
            },
        ],
    },
]

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { pathname } = useLocation()

    return (
        <Sidebar className="border-r border-[#F2F2F2] !bg-white w-[260px]" {...props}>
            <SidebarHeader className="px-5 py-6">
                <Link to="/" className="flex items-center gap-3 group ml-1">
                    <div className="relative w-7 h-7">
                        <img
                            src="/logo.jpg"
                            alt="Feralde Logo"
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-[#393939] font-[var(--font-bricolage)]">
                        Feralde
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="px-2">
                {navItems.map((group, groupIdx) => (
                    <SidebarGroup key={`${group.label}-${groupIdx}`} className="py-1">
                        <SidebarGroupLabel className="px-4 text-[12px] font-semibold text-[#A5A5A5] uppercase tracking-wider mb-2 font-[var(--font-bricolage)]">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url || (item.url !== '/' && pathname?.startsWith(item.url))
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                isActive={isActive}
                                                className={`h-[42px] px-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${isActive
                                                    ? "!bg-[#333333] !text-white hover:!bg-[#333333]/90 hover:!text-white"
                                                    : "text-[#6F6F6F] hover:bg-gray-50 bg-transparent"
                                                    }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3 w-full">
                                                    <HugeiconsIcon
                                                        icon={item.icon}
                                                        size={20}
                                                        className={isActive ? "text-white" : "text-[#A5A5A5]"}
                                                    />
                                                    <span className="text-[13px] font-semibold font-[var(--font-bricolage)]">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter className="p-5 border-t border-[#F2F2F2] mt-auto">
                <div className="flex items-center gap-3">
                    <div className="relative size-9 rounded-full overflow-hidden flex-shrink-0 bg-orange-100">
                        <img
                            src="/user.png"
                            alt="Sofia Anne"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-semibold text-[#393939] leading-tight font-[var(--font-bricolage)]">Sofia Anne</span>
                        <span className="text-[11px] text-[#A5A5A5] leading-tight font-[var(--font-bricolage)] font-normal">Anne.S@gmail.com</span>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
