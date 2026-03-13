import { useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useProduct } from '../hooks/use-products';
import { useAuth } from '@/hooks/use-auth';
import { deleteProduct } from '../api';
import { resolveMediaUrl } from '@/lib/utils';
import { IconArrowLeft, IconPencil, IconTrash, IconBox, IconTag, IconStar, IconSparkles, IconCheck } from '@/components/Icons';
import type { ProductVariant, ProductMedia } from '../types';

const TIER_LABELS: Record<string, string> = {
  RETAIL: 'Retail',
  DISTRIBUTOR: 'Distributor',
  RESELLER: 'Reseller',
  WHOLESALE: 'Wholesale',
};

const TIER_COLORS: Record<string, string> = {
  RETAIL: 'bg-blue-50 text-blue-700',
  DISTRIBUTOR: 'bg-purple-50 text-purple-700',
  RESELLER: 'bg-teal-50 text-teal-700',
  WHOLESALE: 'bg-orange-50 text-orange-700',
};

function VariantCard({ variant }: { variant: ProductVariant }): React.ReactElement {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">{variant.name}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{variant.sku}</p>
          {(variant.size || variant.concentration) && (
            <p className="text-xs text-gray-500 mt-1">
              {[variant.size, variant.concentration].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${variant.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
          {variant.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      {variant.pricing && variant.pricing.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          {variant.pricing.map((p) => (
            <div key={p.tier} className={`rounded-md px-2.5 py-1.5 ${TIER_COLORS[p.tier] ?? 'bg-gray-50 text-gray-600'}`}>
              <p className="text-xs font-medium">{TIER_LABELS[p.tier] ?? p.tier}</p>
              <p className="text-sm font-bold">
                ₱{parseFloat(p.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageGallery({ media }: { media: ProductMedia[] }): React.ReactElement {
  const [active, setActive] = useState<ProductMedia>(
    media.find((m) => m.is_primary) ?? media[0]
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Images</h2>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
          {media.length} {media.length === 1 ? 'image' : 'images'}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
          <img
            src={resolveMediaUrl(active.url)}
            alt={active.alt_text ?? 'Product image'}
            className="w-full h-full object-contain"
          />
        </div>
        {media.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {media.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(m)}
                className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-colors ${active.id === m.id ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <img src={resolveMediaUrl(m.url)} alt={m.alt_text ?? ''} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage(): React.ReactElement {
  const { id } = useParams({ strict: false });
  const productId = Number(id);
  const { data, isLoading, isError } = useProduct(productId);
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canUpdate = hasPermission('products.update');
  const canDelete = hasPermission('products.delete');

  async function handleDelete(): Promise<void> {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        navigate({ to: '/products' });
      } else {
        setDeleteError(res.message);
      }
    } catch {
      setDeleteError('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-48">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
          Product not found.
        </div>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
          <IconArrowLeft className="w-4 h-4" /> Back to products
        </Link>
      </div>
    );
  }

  const product = data.data;
  const variants = product.variants ?? [];
  const media = product.media ?? [];

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Breadcrumb + actions */}
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Products
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            {!product.is_active && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                Inactive
              </span>
            )}
            {product.is_featured && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                <IconStar className="w-3 h-3" /> Featured
              </span>
            )}
            {product.is_best_seller && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                Best Seller
              </span>
            )}
            {product.is_new_arrival && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                <IconSparkles className="w-3 h-3" /> New
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canUpdate && (
            <Link
              to="/products/$id/edit"
              params={{ id: product.id.toString() }}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IconPencil className="w-4 h-4" />
              Edit
            </Link>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <IconTrash className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </header>

      {deleteError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      {product.deleted_at && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">Archived</p>
          <p className="text-xs text-amber-600">
            Deleted on {new Date(product.deleted_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Core info */}
          <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <div className="px-5 py-4 flex items-start gap-3">
              <div className="mt-0.5 shrink-0"><IconBox className="w-4 h-4 text-indigo-400" /></div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Name</p>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
              </div>
            </div>
            <div className="px-5 py-4 flex items-start gap-3">
              <div className="mt-0.5 shrink-0"><IconTag className="w-4 h-4 text-gray-400" /></div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">SKU</p>
                <p className="text-sm font-mono text-gray-600">{product.sku}</p>
              </div>
            </div>
            <div className="px-5 py-4 pl-12">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Slug</p>
              <p className="text-sm font-mono text-gray-500">{product.slug}</p>
            </div>
            {product.category && (
              <div className="px-5 py-4 pl-12">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Category</p>
                <p className="text-sm text-gray-700">{product.category.name}</p>
              </div>
            )}
            {product.short_description && (
              <div className="px-5 py-4 pl-12">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Short description</p>
                <p className="text-sm text-gray-600">{product.short_description}</p>
              </div>
            )}
            <div className="px-5 py-4 pl-12">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Description</p>
              {product.description
                ? <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                : <p className="text-sm text-gray-400 italic">No description</p>}
            </div>
            <div className="px-5 py-4 pl-12">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Created</p>
              <p className="text-sm text-gray-700">{new Date(product.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
            </div>
          </section>

          {/* Product details: scent notes + ingredients */}
          {(product.scent_notes?.length || product.ingredients) && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">Product details</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {product.scent_notes && product.scent_notes.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Scent notes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.scent_notes.map((note) => (
                        <span key={note} className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.ingredients && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Ingredients</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">Variants &amp; Pricing</h2>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                  {variants.length} {variants.length === 1 ? 'variant' : 'variants'}
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variants.map((v) => (
                  <VariantCard key={v.id} variant={v} />
                ))}
              </div>
            </section>
          )}

          {/* SEO / Meta */}
          {(product.meta_title || product.meta_description) && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">SEO &amp; metadata</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {product.meta_title && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Meta title</p>
                    <p className="text-sm text-gray-700">{product.meta_title}</p>
                  </div>
                )}
                {product.meta_description && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Meta description</p>
                    <p className="text-sm text-gray-600">{product.meta_description}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right — sidebar */}
        <div className="space-y-4">
          {/* Images */}
          {media.length > 0 && <ImageGallery media={media} />}

          {/* Status & Flags */}
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Status &amp; Flags</h2>
            </div>
            <div className="p-5 space-y-3">
              {([
                { label: 'Active', value: product.is_active },
                { label: 'Featured', value: product.is_featured },
                { label: 'Best Seller', value: product.is_best_seller },
                { label: 'New Arrival', value: product.is_new_arrival },
              ]).map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  {value ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                      <IconCheck className="w-3.5 h-3.5" /> Yes
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
