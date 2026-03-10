import { IconArrowLeft } from '@/components/Icons';
import { isAxiosError } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { addProductMedia, createProduct, uploadFile } from '../api';
import MediaUploadPanel from '../components/MediaUploadPanel';
import type { ProductFormValues } from '../components/ProductForm';
import ProductForm from '../components/ProductForm';

export default function CreateProductPage(): React.ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  function handleAddFiles(files: File[]): void {
    setPendingFiles((prev) => [...prev, ...files]);
  }

  function handleRemovePending(index: number): void {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(values: ProductFormValues): Promise<void> {
    setServerError(null);
    setFieldErrors({});
    try {
      const res = await createProduct(values);
      if (!res.success) {
        setServerError(res.message);
        if (res.errors) setFieldErrors(res.errors);
        return;
      }

      const productId = res.data.id;

      if (pendingFiles.length > 0) {
        for (let i = 0; i < pendingFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${pendingFiles.length}...`);
          const uploaded = await uploadFile(pendingFiles[i], 'products');
          if (uploaded.success) {
            await addProductMedia(productId, {
              url: uploaded.data.url,
              type: 'IMAGE',
              is_primary: i === 0,
              sort_order: i,
            });
          }
        }
        setUploadProgress(null);
      }

      await queryClient.invalidateQueries({ queryKey: ['products'] });
      void navigate({ to: '/products/$id', params: { id: String(productId) } });
    } catch (err) {
      setUploadProgress(null);
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { message?: string; errors?: Record<string, string[]> };
        setServerError(data.message ?? 'Failed to create product');
        if (data.errors) setFieldErrors(data.errors);
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <header className="space-y-1">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          Products
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add product</h1>
      </header>

      <MediaUploadPanel
        existingMedia={[]}
        onDeleteExisting={() => undefined}
        pendingFiles={pendingFiles}
        onAddFiles={handleAddFiles}
        onRemovePending={handleRemovePending}
      />

      {uploadProgress && (
        <p className="text-sm text-indigo-600 font-medium">{uploadProgress}</p>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Create product"
        serverError={serverError}
        fieldErrors={fieldErrors}
        onCancel={() => void navigate({ to: '/products' })}
      />
    </div>
  );
}

