import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from '@/hooks/use-theme';
import {
    LayoutGridIcon,
    ShoppingBag01Icon,
    UserGroupIcon,
    WarehouseIcon,
    MoneyBag02Icon,
    Chart02Icon,
    GraduationScrollIcon,
    Settings01Icon,
    File01Icon,
    Logout01Icon,
    ArrowRightDoubleIcon,
    ArrowDown01Icon,
    PieChart01Icon,
    Megaphone03Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Home11Icon,
    EarthIcon,
    Notification01Icon,
    BubbleChatIcon,
    Moon02Icon,
    MoreHorizontalIcon,
    TransitionRightIcon,
    ArrowDown02Icon,
} from '@hugeicons/core-free-icons';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ── Shared button style ───────────────────────────────────────────────────────
const btnCls = "hover:bg-stone-100 hover:text-stone-900 data-[active=true]:bg-stone-900 data-[active=true]:text-white";

// ── Languages ─────────────────────────────────────────────────────────────────
const LANGUAGES = [
    { code: 'en', label: 'English', country: 'gb' },
    { code: 'fil', label: 'Filipino', country: 'ph' },
    { code: 'es', label: 'Spanish', country: 'es' },
    { code: 'zh', label: 'Chinese', country: 'cn' },
    { code: 'ja', label: 'Japanese', country: 'jp' },
];

// ── Breadcrumb helper ─────────────────────────────────────────────────────────
function useBreadcrumb() {
    const { location } = useRouterState();
    const path = location.pathname;

    const map: Record<string, string> = {
        '/': 'Dashboard',
        '/products': 'Products',
        '/products/new': 'Create Product',
        '/categories': 'Categories',
        '/bundles': 'Bundles',
        '/orders': 'Orders',
        '/inventory': 'Inventory',
        '/distributors': 'Distributors',
        '/resellers': 'Resellers',
        '/commissions': 'Commissions',
        '/wallets': 'Wallets',
        '/accounting': 'Accounting',
        '/leaderboard': 'Leaderboard',
        '/training': 'Trainings & Modules',
        '/marketing': 'Marketing Tools',
        '/system/settings': 'Settings',
        '/system/audit-logs': 'Audit Logs',
        '/users': 'Users',
        '/roles': 'Roles & Permissions',
        '/profile': 'My Profile',
        '/promo-codes': 'Promo Codes',
    };

    const label = map[path] ?? 'Page';
    return label;
}

// ── Top Bar ───────────────────────────────────────────────────────────────────
function TopBar({ user, isDark, onToggleTheme }: { user: any; isDark: boolean; onToggleTheme: () => void }) {
    const breadcrumb = useBreadcrumb();
    const [language, setLanguage] = useState(LANGUAGES[0]);
     const [langOpen, setLangOpen] = useState(false);

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-100 bg-white px-3 sticky top-0 z-10">

            {/* Left — toggle + nav arrows + breadcrumb */}
            <div className="flex items-center gap-1">
                <SidebarTrigger className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md p-1.5 transition-colors border border-stone-200" />

                {/* Back / Forward */}
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => window.history.forward()}
                    className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
                >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </button>

                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Link to="/" className="p-1.5 rounded-md hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200">
                        <HugeiconsIcon icon={Home11Icon} size={14} />
                    </Link>
                    <span>/</span>
                    <span className="text-stone-600 font-medium">Menu</span>
                    <span>/</span>
                    <span className="text-stone-900 font-medium">{breadcrumb}</span>
                </div>
            </div>

            {/* Right — avatars + lang + icons + quick menu */}
            <div className="flex items-center gap-1.5">

                {/* Stacked avatars */}
                <div className="flex items-center -space-x-2 mr-1">
                    {[0, 1, 2].map((i) => (
                        <Avatar key={i} className="h-7 w-7 border-2 border-white">
                            <AvatarFallback className="bg-stone-200 text-stone-600 text-[10px] font-bold">
                                {user?.name?.charAt(i) ?? 'A'}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Language selector */}
                <DropdownMenu open={langOpen} onOpenChange={setLangOpen}>
    <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-stone-600 hover:bg-stone-100 transition-colors">
        <HugeiconsIcon icon={EarthIcon} size={13} className="text-stone-400" />
        <span className={`fi fi-${language.country} rounded-sm`} />
        <span className="hidden sm:inline">{language.label}</span>
        <HugeiconsIcon 
            icon={ArrowDown01Icon} 
            size={12} 
            className={`text-stone-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : 'rotate-0'}`}
        />
    </DropdownMenuTrigger>
   <DropdownMenuContent align="end" side="bottom" className="w-40 min-w-0">
    {LANGUAGES.map((lang) => (
        <DropdownMenuItem
            key={lang.code}
            className="text-sm text-stone-600 cursor-pointer py-1 gap-2"
            onClick={() => setLanguage(lang)}
        >
            <span className={`fi fi-${lang.country} rounded-sm`} />
            <span>{lang.label}</span>
            {language.code === lang.code && (
                <span className="ml-auto text-stone-900">✓</span>
            )}  
        </DropdownMenuItem>
    ))}
</DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Icon buttons */}
                <button type="button" className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200" title="Chat">
                    <HugeiconsIcon icon={BubbleChatIcon} size={15} />
                </button>
                <button type="button" className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200" title="Notifications">
                    <HugeiconsIcon icon={Notification01Icon} size={15} />
                </button>
                <button
    type="button"
    onClick={onToggleTheme}
    className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
    title={isDark ? 'Light mode' : 'Dark mode'}
>
    <HugeiconsIcon 
    icon={Moon02Icon} 
    size={15}
    className={isDark ? 'text-stone-900 fill-stone-900' : 'text-stone-400'}
/>
</button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Quick Menu button */}
                <Button size="sm" className="bg-stone-900 hover:bg-stone-700 text-white text-xs px-3 h-8 rounded-lg flex items-center gap-1.5">
                    Quick Menu
                    <HugeiconsIcon icon={ArrowDown02Icon} size={12} />
                </Button>

                {/* More */}
                <button type="button" className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200">
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
                </button>
                <button type="button" className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                    <HugeiconsIcon icon={TransitionRightIcon} size={15} />
                </button>
            </div>
        </header>
    );
}

// ── Main Shell ────────────────────────────────────────────────────────────────
export default function AdminShell() {
    const { user, signOut } = useAuth();
    const { isDark, toggle } = useTheme();

    return (
        <SidebarProvider>
            <div className="flex min-h-svh w-full">
                <AppSidebar user={user} signOut={signOut} />
                <SidebarInset className="flex flex-col flex-1 min-w-0">
                    <TopBar user={user} isDark={isDark} onToggleTheme={toggle} />
                    <main className="flex-1 overflow-auto" style={{ scrollbarGutter: 'stable' }}>
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

// ── App Sidebar ───────────────────────────────────────────────────────────────
function AppSidebar({ user, signOut }: { user: any; signOut: () => void }) {
    const { location } = useRouterState();
    const { isMobile, setOpenMobile } = useSidebar();
    const [ecommerceOpen, setEcommerceOpen] = useState(
        location.pathname.startsWith('/products') ||
        location.pathname.startsWith('/orders') ||
        location.pathname.startsWith('/promo-codes')
    );

    const isActive = (to: string, exact = false) =>
        exact ? location.pathname === to : location.pathname.startsWith(to);

    const handleNavClick = () => {
        if (isMobile) setOpenMobile(false);
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-stone-100 bg-white">

            {/* Brand */}
            <SidebarHeader className="px-4 py-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
                        <img src="/logo.jpg" alt="Feralde" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-stone-900 font-bold text-base tracking-tight group-data-[collapsible=icon]:hidden">
                        Feralde
                    </span>
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>

                {/* Overview */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-stone-400 text-[10px] tracking-widest uppercase">
                        Overview
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    render={<Link to="/" onClick={handleNavClick} />}
                                    isActive={isActive('/', true)}
                                    tooltip="Dashboard"
                                    className={btnCls}
                                >
                                    <HugeiconsIcon icon={LayoutGridIcon} size={16} />
                                    <span>Dashboard</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Management */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-stone-400 text-[10px] tracking-widest uppercase">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible open={ecommerceOpen} onOpenChange={setEcommerceOpen}>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isActive('/products') || isActive('/orders') || isActive('/promo-codes')}
                                            tooltip="E-Commerce"
                                            className={btnCls}
                                        >
                                            <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
                                            <span>E-Commerce</span>
                                            <HugeiconsIcon
                                                icon={ArrowRightDoubleIcon}
                                                size={14}
                                                className={`ml-auto transition-transform duration-300 ease-in-out ${ecommerceOpen ? 'rotate-90' : 'rotate-0'}`}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 transition-all duration-300 ease-in-out">
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton render={<Link to="/products" onClick={handleNavClick} />} isActive={isActive('/products')} className="hover:bg-stone-100 hover:text-stone-900 data-[active=true]:bg-stone-900 data-[active=true]:text-white">
                                                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-stone-400" />
                                                    <span>Products</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton render={<Link to="/orders" onClick={handleNavClick} />} isActive={isActive('/orders')} className="hover:bg-stone-100 hover:text-stone-900 data-[active=true]:bg-stone-900 data-[active=true]:text-white">
                                                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-stone-400" />
                                                    <span>Order</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton render={<Link to="/promo-codes" onClick={handleNavClick} />} isActive={isActive('/promo-codes')} className="hover:bg-stone-100 hover:text-stone-900 data-[active=true]:bg-stone-900 data-[active=true]:text-white">
                                                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-stone-400" />
                                                    <span>Promotions</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/distributors" onClick={handleNavClick} />} isActive={isActive('/distributors')} tooltip="Distributor" className={btnCls}>
                                    <HugeiconsIcon icon={UserGroupIcon} size={16} />
                                    <span>Distributor</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/inventory" onClick={handleNavClick} />} isActive={isActive('/inventory')} tooltip="Inventory" className={btnCls}>
                                    <HugeiconsIcon icon={WarehouseIcon} size={16} />
                                    <span>Inventory</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Operations */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-stone-400 text-[10px] tracking-widest uppercase">
                        Operations
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/training" onClick={handleNavClick} />} isActive={isActive('/training')} tooltip="Trainings & Modules" className={btnCls}>
                                    <HugeiconsIcon icon={GraduationScrollIcon} size={16} />
                                    <span>Trainings & Modules</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/marketing" onClick={handleNavClick} />} isActive={isActive('/marketing')} tooltip="Marketing Tools" className={btnCls}>
                                    <HugeiconsIcon icon={Megaphone03Icon} size={16} />
                                    <span>Marketing Tools</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Finance */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-stone-400 text-[10px] tracking-widest uppercase">
                        Finance
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/accounting" onClick={handleNavClick} />} isActive={isActive('/accounting')} tooltip="Expense AP" className={btnCls}>
                                    <HugeiconsIcon icon={MoneyBag02Icon} size={16} />
                                    <span>Expense AP</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/wallets" onClick={handleNavClick} />} isActive={isActive('/wallets')} tooltip="Revenue AR" className={btnCls}>
                                    <HugeiconsIcon icon={Chart02Icon} size={16} />
                                    <span>Revenue AR</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/leaderboard" onClick={handleNavClick} />} isActive={isActive('/leaderboard')} tooltip="Profit & Loss" className={btnCls}>
                                    <HugeiconsIcon icon={PieChart01Icon} size={16} />
                                    <span>Profit & Loss</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Management */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-stone-400 text-[10px] tracking-widest uppercase">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/users" onClick={handleNavClick} />} isActive={isActive('/users')} tooltip="Staffs & Users" className={btnCls}>
                                    <HugeiconsIcon icon={UserGroupIcon} size={16} />
                                    <span>Staffs & Users</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/roles" onClick={handleNavClick} />} isActive={isActive('/roles')} tooltip="Roles & Permissions" className={btnCls}>
                                    <HugeiconsIcon icon={File01Icon} size={16} />
                                    <span>Roles & Permissions</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* System */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-stone-400 text-[10px] tracking-widest uppercase">
                        System
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/system/settings" onClick={handleNavClick} />} isActive={isActive('/system/settings')} tooltip="Settings" className={btnCls}>
                                    <HugeiconsIcon icon={Settings01Icon} size={16} />
                                    <span>Settings</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link to="/system/audit-logs" onClick={handleNavClick} />} isActive={isActive('/system/audit-logs')} tooltip="Audit Logs" className={btnCls}>
                                    <HugeiconsIcon icon={File01Icon} size={16} />
                                    <span>Audit Logs</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* User Footer */}
            <SidebarSeparator />
            <SidebarFooter className="px-3 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link to="/profile" onClick={handleNavClick} />}
                            isActive={isActive('/profile')}
                            size="lg"
                            tooltip={user?.name ?? 'Profile'}
                            className={btnCls}
                        >
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-stone-200 text-stone-600 text-xs font-bold">
                                    {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                                <span className="text-xs font-semibold text-stone-900 truncate">{user?.name ?? 'Admin'}</span>
                                <span className="text-xs text-stone-400 truncate">{user?.email ?? ''}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <button
                    type="button"
                    onClick={signOut}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors rounded-md hover:bg-stone-50 group-data-[collapsible=icon]:justify-center"
                >
                    <HugeiconsIcon icon={Logout01Icon} size={16} className="shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
                </button>
            </SidebarFooter>

        </Sidebar>
    );
}