import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { IconPencil, IconBox } from '@/components/Icons';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductRow({ product }: Props) {
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission('products.update');
  const variantCount = product.variants?.length ?? 0;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-md flex items-center justify-center shrink-0">
            <IconBox className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
            {product.short_description && (
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.short_description}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{product.sku}</td>
      <td className="px-5 py-3.5 text-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 justify-center flex-wrap">
          {product.is_featured && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
              Featured
            </span>
          )}
          {product.is_best_seller && (
            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
              Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">
              New
            </span>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${product.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
          {product.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex justify-end items-center gap-1">
          <Link
            to={`/products/${product.id}`}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
          >
            View
          </Link>
          {canUpdate && (
            <Link
              to={`/products/${product.id}/edit`}
              className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit"
            >
              <IconPencil className="w-4 h-4" />
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}
