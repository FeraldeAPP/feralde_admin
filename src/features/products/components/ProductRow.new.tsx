 import { useAuth } from '@/hooks/use-auth';
import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { useState, useRef, useEffect } from 'react';
import type { Product } from '../types';

interface Props {
    product: Product;
}

export default function ProductRow({ product }: Props) {
    const { hasPermission } = useAuth();
    const canUpdate = hasPermission('products.update');
    const canDelete = hasPermission('products.delete');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const primaryImage = product.media?.find((m) => m.is_primary)?.url ?? product.media?.[0]?.url;
    const activeVariants = product.variants?.filter((v: any) => v.is_active) ?? [];
    const sizes = activeVariants.map((v) => v.size ?? v.name).filter(Boolean).join(' / ');
    const lowestPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => {
        const retail = v.pricing?.find((p) => p.tier === 'RETAIL' && p.is_active);
        return retail ? parseFloat(retail.price) : 0;
    }))
    : null;

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

    return (
        <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">

            {/* Product Name + Image */}
            <td className="py-3.5 pr-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-stone-100 shrink-0">
                        {primaryImage ? (
                            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-stone-200" />
                        )}
                    </div>
                    <p className="text-sm text-stone-800 font-medium truncate max-w-[240px]">{product.name}</p>
                </div>
            </td>

            {/* Collection */}
            <td className="py-3.5 pr-6">
                <span className="text-sm text-stone-500">
                    {product.category?.name ?? '—'}
                </span>
            </td>

            {/* Size Variants */}
            <td className="py-3.5 pr-6">
                <span className="text-sm text-stone-500">
                    {sizes || '—'}
                </span>
            </td>

            {/* Price */}
            <td className="py-3.5 pr-6">
                <span className="text-sm text-stone-800 font-medium">
                    {lowestPrice !== null ? `₱${lowestPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '—'}
                </span>
            </td>

            {/* Action */}
            <td className="py-3.5 text-right">
                <div className="relative inline-block" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-stone-200 rounded-lg shadow-md py-1">
                            <Link
                                to="/products/$id"
                                params={{ id: String(product.id) }}
                                className="block px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                View
                            </Link>
                            {canUpdate && (
                                <Link
                                    to="/products/$id/edit"
                                    params={{ id: String(product.id) }}
                                    className="block px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Edit
                                </Link>
                            )}
                            {canDelete && (
                                <button
                                    type="button"
                                    className="block w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}