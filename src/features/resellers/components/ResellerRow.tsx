import { useAuth } from '@/hooks/use-auth';
import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { useState, useRef, useEffect } from 'react';
import type { Reseller } from '../types';

interface Props {
    reseller: Reseller;
    isOnlyActions?: boolean;
}

export default function ResellerRow({ reseller, isOnlyActions }: Props) {
    const { hasPermission } = useAuth();
    const canApprove = hasPermission('resellers.manage');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const actionMenu = (
        <div className="relative inline-block" ref={menuRef}>
            <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors h-8 w-8 flex items-center justify-center"
            >
                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
            </button>
            {menuOpen && (
                <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-stone-200 rounded-lg shadow-md py-1">
                    <Link
                        to="/resellers"
                        className="block px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        View Profile
                    </Link>
                    {!reseller.approved_at && canApprove && (
                        <button
                            type="button"
                            className="block w-full text-left px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium"
                            onClick={() => {
                                console.log('Approve reseller', reseller.id);
                                setMenuOpen(false);
                            }}
                        >
                            Approve
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    if (isOnlyActions) {
        return actionMenu;
    }

    return (
        <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
            <td className="py-3.5 pr-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-stone-500">
                            {reseller.first_name?.[0]}{reseller.last_name?.[0]}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-stone-800 font-medium">{reseller.first_name} {reseller.last_name}</p>
                        <p className="text-[11px] text-stone-400">{reseller.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-3.5 pr-6">
                <span className="text-sm text-stone-500 font-mono">{reseller.reseller_code}</span>
            </td>
            <td className="py-3.5 pr-6">
                <span className="text-sm text-stone-500">{reseller.city || '—'}</span>
            </td>
            <td className="py-3.5 pr-6">
                <span className="text-sm text-stone-800 font-medium">
                    ₱{parseFloat(reseller.total_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            </td>
            <td className="py-3.5 text-right">
                {actionMenu}
            </td>
        </tr>
    );
}
