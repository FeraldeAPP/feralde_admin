import { useAuth } from '@/hooks/use-auth';
import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import type { Product } from '../types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
    product: Product;
    isOnlyActions?: boolean;
}

export default function ProductRow({ product, isOnlyActions }: Props) {
    const { hasPermission } = useAuth();
    const canUpdate = hasPermission('products.update');
    const canDelete = hasPermission('products.delete');

    const primaryImage = product.media?.find((m) => m.is_primary)?.url ?? product.media?.[0]?.url;
    const activeVariants = product.variants?.filter((v: any) => v.is_active) ?? [];
    const sizes = activeVariants.map((v) => v.size ?? v.name).filter(Boolean).join(' / ');
    const lowestPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => {
        const retail = v.pricing?.find((p) => p.tier === 'RETAIL' && p.is_active);
        return retail ? parseFloat(retail.price) : 0;
    }))
    : null;

    const actionMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors outline-none">
                <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                    <Link
                        to="/products/$id"
                        params={{ id: String(product.id) }}
                    >
                        View
                    </Link>
                </DropdownMenuItem>
                {canUpdate && (
                    <DropdownMenuItem className="cursor-pointer">
                        <Link
                            to="/products/$id/edit"
                            params={{ id: String(product.id) }}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                )}
                {canDelete && (
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 font-medium">
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    if (isOnlyActions) {
        return actionMenu;
    }

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
                    <p className="text-sm text-stone-800 font-medium truncate max-w-60">{product.name}</p>
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
                {actionMenu}
            </td>
        </tr>
    );
}