import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { getCategories } from '@/api/endpoints';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  sku: z.string().min(1, 'SKU is required').max(100),
  slug: z.string().max(255).optional(),
  short_description: z.string().max(500).optional(),
  description: z.string().optional(),
  category_id: z.number().int().positive().nullable().optional(),
  scent_notes: z.array(z.string()).optional(),
  ingredients: z.string().optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_best_seller: z.boolean().optional(),
  is_new_arrival: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitLabel: string;
  serverError: string | null;
  fieldErrors?: Record<string, string[]>;
  cancelTo: string;
}

function FieldError({ message }: { message: string | undefined }): React.ReactElement | null {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ProductForm({ defaultValues, onSubmit, submitLabel, serverError, fieldErrors, cancelTo }: Props): React.ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      scent_notes: [],
      ...defaultValues,
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => getCategories({ per_page: 200 }),
  });
  const categories = categoriesData?.success ? categoriesData.data.categories : [];

  const nameValue = watch('name');
  const slugValue = watch('slug');
  const scentNotes = watch('scent_notes') ?? [];

  useEffect(() => {
    if (!slugValue && nameValue) {
      setValue('slug', slugify(nameValue));
    }
  }, [nameValue, slugValue, setValue]);

  const [scentInput, setScentInput] = useState('');

  const addScentNote = useCallback(
    (raw: string): void => {
      const tag = raw.trim().replace(/,+$/, '').trim();
      if (tag && !scentNotes.includes(tag)) {
        setValue('scent_notes', [...scentNotes, tag]);
      }
      setScentInput('');
    },
    [scentNotes, setValue],
  );

  function handleScentKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addScentNote(scentInput);
    } else if (e.key === 'Backspace' && scentInput === '' && scentNotes.length > 0) {
      setValue('scent_notes', scentNotes.slice(0, -1));
    }
  }

  function removeScentNote(note: string): void {
    setValue('scent_notes', scentNotes.filter((n) => n !== note));
  }

  function field(name: keyof ProductFormValues): string | undefined {
    return fieldErrors?.[name]?.[0];
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {serverError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Basic info */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Basic information</h2>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClass}>Product name</label>
              <input
                id="name" type="text" placeholder="e.g. Noir Absolu EDP"
                {...register('name')}
                className={inputClass}
              />
              <FieldError message={errors.name?.message ?? field('name')} />
            </div>
            <div>
              <label htmlFor="sku" className={labelClass}>SKU</label>
              <input
                id="sku" type="text" placeholder="e.g. PRF-NRA-001"
                {...register('sku')}
                className={`${inputClass} font-mono`}
              />
              <FieldError message={errors.sku?.message ?? field('sku')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="slug" className={labelClass}>
                Slug <span className="text-gray-400 font-normal">(auto-generated)</span>
              </label>
              <input
                id="slug" type="text" placeholder="e.g. noir-absolu-edp"
                {...register('slug')}
                className={`${inputClass} font-mono`}
              />
              <FieldError message={errors.slug?.message ?? field('slug')} />
            </div>
            <div>
              <label htmlFor="category_id" className={labelClass}>Category</label>
              <select
                id="category_id"
                {...register('category_id', { setValueAs: (v: string) => v === '' ? null : Number(v) })}
                className={inputClass}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <FieldError message={errors.category_id?.message ?? field('category_id')} />
            </div>
          </div>

          <div>
            <label htmlFor="short_description" className={labelClass}>
              Short description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="short_description" type="text"
              placeholder="Brief one-line summary..."
              {...register('short_description')}
              className={inputClass}
            />
            <FieldError message={errors.short_description?.message ?? field('short_description')} />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Full description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description" rows={5}
              placeholder="Detailed product description..."
              {...register('description')}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Product details */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Product details</h2>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label htmlFor="scent-input" className={labelClass}>
              Scent notes <span className="text-gray-400 font-normal">(press Enter or comma to add)</span>
            </label>
            <div className="min-h-[42px] flex flex-wrap gap-1.5 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
              {scentNotes.map((note) => (
                <span key={note} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {note}
                  <button
                    type="button"
                    onClick={() => removeScentNote(note)}
                    className="hover:text-indigo-900 focus:outline-none"
                    aria-label={`Remove ${note}`}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                id="scent-input"
                type="text"
                value={scentInput}
                onChange={(e) => setScentInput(e.target.value)}
                onKeyDown={handleScentKeyDown}
                onBlur={() => { if (scentInput) addScentNote(scentInput); }}
                placeholder={scentNotes.length === 0 ? 'e.g. Oud, Rose, Vanilla...' : ''}
                className="flex-1 min-w-[100px] text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>
            <FieldError message={field('scent_notes')} />
          </div>

          <div>
            <label htmlFor="ingredients" className={labelClass}>
              Ingredients <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="ingredients" rows={3}
              placeholder="List of ingredients or materials..."
              {...register('ingredients')}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Visibility flags */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Visibility &amp; flags</h2>
          <p className="text-xs text-gray-400 mt-0.5">Control where this product appears in the storefront</p>
        </div>
        <div className="p-5 space-y-3">
          {([
            { id: 'is_active', label: 'Active', desc: 'Product is visible on the storefront' },
            { id: 'is_featured', label: 'Featured', desc: 'Show in featured products section' },
            { id: 'is_best_seller', label: 'Best Seller', desc: 'Highlight as a best-selling item' },
            { id: 'is_new_arrival', label: 'New Arrival', desc: 'Show in new arrivals section' },
          ] as const).map(({ id, label, desc }) => (
            <label key={id} htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
              <input
                id={id} type="checkbox"
                {...register(id)}
                className="h-4 w-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* SEO / Meta */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">SEO &amp; metadata</h2>
          <p className="text-xs text-gray-400 mt-0.5">Optional. Leave blank to use product name and description.</p>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label htmlFor="meta_title" className={labelClass}>Meta title</label>
            <input
              id="meta_title" type="text"
              placeholder="e.g. Noir Absolu EDP – Feralde"
              {...register('meta_title')}
              className={inputClass}
            />
            <FieldError message={errors.meta_title?.message ?? field('meta_title')} />
          </div>
          <div>
            <label htmlFor="meta_description" className={labelClass}>Meta description</label>
            <textarea
              id="meta_description" rows={3}
              placeholder="Brief description for search engine previews..."
              {...register('meta_description')}
              className={`${inputClass} resize-none`}
            />
            <FieldError message={errors.meta_description?.message ?? field('meta_description')} />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          to={cancelTo}
          className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit" disabled={isSubmitting}
          className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
