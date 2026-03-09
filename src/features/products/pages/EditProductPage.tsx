import { isAxiosError } from '@/api/client';
import { addProductMedia, deleteProductMedia, updateProduct, uploadFile } from '@/api/endpoints';
import type { ProductMedia } from '@/api/types';
import { IconArrowLeft } from '@/components/Icons';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MediaUploadPanel from '../components/MediaUploadPanel';
import type { ProductFormValues } from '../components/ProductForm';
import ProductForm from '../components/ProductForm';
import { useProduct } from '../hooks/use-products';

export default function EditProductPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useProduct(productId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  function handleAddFiles(files: File[]): void {
    setPendingFiles((prev) => [...prev, ...files]);
  }

  function handleRemovePending(index: number): void {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleDeleteExisting(mediaId: number): Promise<void> {
    setIsDeleting(true);
    try {
      await deleteProductMedia(productId, mediaId);
      setDeletedMediaIds((prev) => new Set([...prev, mediaId]));
      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(values: ProductFormValues): Promise<void> {
    setServerError(null);
    setFieldErrors({});
    try {
      const res = await updateProduct(productId, values);
      if (!res.success) {
        setServerError(res.message);
        if (res.errors) setFieldErrors(res.errors);
        return;
      }

      if (pendingFiles.length > 0) {
        const currentMedia = data?.success ? (data.data.media ?? []) : [];
        const existingCount = currentMedia.filter((m: ProductMedia) => !deletedMediaIds.has(m.id)).length;

        for (let i = 0; i < pendingFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${pendingFiles.length}...`);
          const uploaded = await uploadFile(pendingFiles[i], 'products');
          if (uploaded.success) {
            await addProductMedia(productId, {
              url: uploaded.data.url,
              type: 'IMAGE',
              is_primary: existingCount === 0 && i === 0,
              sort_order: existingCount + i,
            });
          }
        }
        setUploadProgress(null);
        setPendingFiles([]);
      }

      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(`/products/${productId}`);
    } catch (err) {
      setUploadProgress(null);
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { message?: string; errors?: Record<string, string[]> };
        setServerError(data.message ?? 'Failed to update product');
        if (data.errors) setFieldErrors(data.errors);
      } else {
        setServerError('An unexpected error occurred');
      }
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
  const existingMedia = (product.media ?? []).filter((m: ProductMedia) => !deletedMediaIds.has(m.id));

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <header className="space-y-1">
        <Link
          to={`/products/${productId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          {product.name}
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Edit product</h1>
      </header>

      <MediaUploadPanel
        existingMedia={existingMedia}
        onDeleteExisting={handleDeleteExisting}
        pendingFiles={pendingFiles}
        onAddFiles={handleAddFiles}
        onRemovePending={handleRemovePending}
        isDeleting={isDeleting}
      />

      {uploadProgress && (
        <p className="text-sm text-indigo-600 font-medium">{uploadProgress}</p>
      )}

      <ProductForm
        defaultValues={{
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          short_description: product.short_description ?? undefined,
          description: product.description ?? undefined,
          category_id: product.category_id ?? null,
          scent_notes: product.scent_notes ?? [],
          ingredients: product.ingredients ?? undefined,
          meta_title: product.meta_title ?? undefined,
          meta_description: product.meta_description ?? undefined,
          is_active: product.is_active,
          is_featured: product.is_featured,
          is_best_seller: product.is_best_seller,
          is_new_arrival: product.is_new_arrival,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        serverError={serverError}
        fieldErrors={fieldErrors}
        cancelTo={`/products/${productId}`}
      />
    </div>
  );
}
