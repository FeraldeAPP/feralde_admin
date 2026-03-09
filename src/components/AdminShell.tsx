import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import {
  IconBox,
  IconGrid,
  IconLogout,
  IconUser,
  IconTag,
  IconShoppingBag,
  IconUsers,
  IconWarehouse,
  IconBanknotes,
  IconPercent,
  IconAcademicCap,
  IconSpeaker,
  IconCog,
  IconClipboard,
  IconTicket,
  IconTrophy,
  IconChartBar,
  IconBell,
} from './Icons';

export default function AdminShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-950 flex flex-col overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5 shrink-0">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center shrink-0">
            <IconBox className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">Feralde Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5">
          <NavSection label="Overview">
            <SidebarLink to="/" icon={<IconGrid className="w-4 h-4" />} label="Dashboard" end />
          </NavSection>

          <NavSection label="Catalog">
            <SidebarLink to="/products" icon={<IconBox className="w-4 h-4" />} label="Products" />
            <SidebarLink to="/categories" icon={<IconTag className="w-4 h-4" />} label="Categories" />
            <SidebarLink to="/bundles" icon={<IconChartBar className="w-4 h-4" />} label="Bundles" />
            <SidebarLink to="/promo-codes" icon={<IconTicket className="w-4 h-4" />} label="Promo Codes" />
          </NavSection>

          <NavSection label="Commerce">
            <SidebarLink to="/orders" icon={<IconShoppingBag className="w-4 h-4" />} label="Orders" />
            <SidebarLink to="/inventory" icon={<IconWarehouse className="w-4 h-4" />} label="Inventory" />
          </NavSection>

          <NavSection label="Network">
            <SidebarLink to="/distributors" icon={<IconUsers className="w-4 h-4" />} label="Distributors" />
            <SidebarLink to="/resellers" icon={<IconUser className="w-4 h-4" />} label="Resellers" />
            <SidebarLink to="/commissions" icon={<IconPercent className="w-4 h-4" />} label="Commissions" />
          </NavSection>

          <NavSection label="Finance">
            <SidebarLink to="/wallets" icon={<IconBanknotes className="w-4 h-4" />} label="Wallets" />
            <SidebarLink to="/accounting" icon={<IconChartBar className="w-4 h-4" />} label="Accounting" />
            <SidebarLink to="/leaderboard" icon={<IconTrophy className="w-4 h-4" />} label="Leaderboard" />
          </NavSection>

          <NavSection label="Content">
            <SidebarLink to="/training" icon={<IconAcademicCap className="w-4 h-4" />} label="Training" />
            <SidebarLink to="/marketing" icon={<IconSpeaker className="w-4 h-4" />} label="Marketing" />
          </NavSection>

          <NavSection label="System">
            <SidebarLink to="/system/settings" icon={<IconCog className="w-4 h-4" />} label="Settings" />
            <SidebarLink to="/system/audit-logs" icon={<IconClipboard className="w-4 h-4" />} label="Audit Logs" />
          </NavSection>

          <NavSection label="Management">
            <SidebarLink to="/users" icon={<IconUsers className="w-4 h-4" />} label="Users" />
            <SidebarLink to="/roles" icon={<IconBell className="w-4 h-4" />} label="Roles & Permissions" />
            <SidebarLink to="/profile" icon={<IconUser className="w-4 h-4" />} label="My Profile" />
          </NavSection>
        </nav>

        {/* User */}
        <div className="border-t border-white/5 px-3 py-3 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              title="Sign out"
              className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
            >
              <IconLogout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="hidden sm:inline text-gray-700 font-medium">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-700 text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto" style={{ scrollbarGutter: 'stable' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

function SidebarLink({ to, icon, label, end }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
