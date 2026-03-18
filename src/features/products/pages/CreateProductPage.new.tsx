import { isAxiosError } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { addProductMedia, createProduct, uploadFile } from '../api';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, Download01Icon } from '@hugeicons/core-free-icons';
import { getCategories } from '@/features/categories/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

type FormValues = z.infer<typeof schema>;

function slugify(str: string): string {
    return str.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function FieldError({ message }: { message: string | undefined }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

const inputCls = 'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-white';
const labelCls = 'block text-xs font-medium text-stone-500 mb-1.5';

type Tab = 'general' | 'images' | 'variants' | 'variant';

export default function CreateProductPage(): React.ReactElement {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [serverError, setServerError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const [multipleImage, setMultipleImage] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [toggles, setToggles] = useState({
        diffWarehouse: false,
        diffSupplier: false,
        hasExpiry: false,
        promoSale: false,
        multiVariant: false,
        imeiCode: false,
    });

    const toggleMenu = (key: keyof typeof toggles) =>
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            is_active: true,
            is_featured: false,
            is_best_seller: false,
            is_new_arrival: false,
            scent_notes: [],
        },
    });

    const { data: categoriesData } = useQuery({
        queryKey: ['categories', 'all'],
        queryFn: () => getCategories({ per_page: 200 }),
    });
    const categories = categoriesData?.success ? categoriesData.data.categories : [];

    const nameValue = watch('name');
    const slugValue = watch('slug');

    useEffect(() => {
        if (!slugValue && nameValue) setValue('slug', slugify(nameValue));
    }, [nameValue, slugValue, setValue]);

    function handleAddFiles(files: File[]) {
        setPendingFiles((prev) => [...prev, ...files]);
    }

    function handleRemovePending(index: number) {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
        if (files.length) handleAddFiles(files);
    }

    async function onSubmit(values: FormValues) {
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

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const TABS: { key: Tab; label: string }[] = [
        { key: 'general', label: 'General Information' },
        { key: 'images', label: 'Product Images' },
        { key: 'variants', label: 'Variants Configurations' },
        { key: 'variant', label: 'Product Variant' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-5 min-h-full bg-white">

            {/* Top */}
            <div className="flex items-start justify-between">
                <p className="text-xs text-stone-400">{today}</p>
                <button type="button" className="flex items-center gap-1.5 text-sm text-stone-600 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                    <span className="hidden sm:inline">Export As</span>
                    <HugeiconsIcon icon={Download01Icon} size={14} />
                </button>
            </div>

            {/* Title + Return */}
            <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Create Product</h1>
                <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors">
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                    Return
                </Link>
            </div>

            {/* Tabs — scrollable on mobile */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex items-center gap-0 border-b border-stone-200 min-w-max sm:min-w-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                                activeTab === tab.key
                                    ? 'border-stone-900 text-stone-900'
                                    : 'border-transparent text-stone-400 hover:text-stone-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {serverError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            {uploadProgress && (
                <p className="text-sm text-stone-600 font-medium">{uploadProgress}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* ── General Information Tab ── */}
                {activeTab === 'general' && (
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                        {/* Left — Form */}
                        <div className="flex-1 space-y-5">

                            {/* Product Type + SKU */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className={labelCls}>Product Type</label>
                                    <input {...register('name')} placeholder="Light Mocha Tea" className={inputCls} />
                                    <FieldError message={errors.name?.message ?? fieldErrors['name']?.[0]} />
                                </div>
                                <div>
                                    <label className={labelCls}>SKU (Parent SKU)</label>
                                    <input {...register('sku')} placeholder="e.g. BN-TEE-001" className={`${inputCls} font-mono`} />
                                    <FieldError message={errors.sku?.message ?? fieldErrors['sku']?.[0]} />
                                </div>
                            </div>

                            {/* Category + Sub-Category + Product Unit */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                <div>
                                    <label className={labelCls}>Category</label>
                                    <select {...register('category_id', { setValueAs: (v: string) => v === '' ? null : Number(v) })} className={inputCls}>
                                        <option value="">select category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Sub - Category</label>
                                    <select className={inputCls}>
                                        <option value="">select category</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Product Unit</label>
                                    <select className={inputCls}>
                                        <option value="">select unit</option>
                                        <option value="ml">ml</option>
                                        <option value="oz">oz</option>
                                        <option value="pcs">pcs</option>
                                    </select>
                                </div>
                            </div>

                            {/* Brand + Unit Price + Product Tax */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                <div>
                                    <label className={labelCls}>Brand</label>
                                    <select className={inputCls}>
                                        <option value="">select brand</option>
                                        <option value="feralde">Feralde</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Unit Price</label>
                                    <input type="number" placeholder="unit price" className={`${inputCls} bg-stone-50`} />
                                </div>
                                <div>
                                    <label className={labelCls}>Product Tax</label>
                                    <input type="number" defaultValue={0} className={inputCls} />
                                </div>
                            </div>

                            {/* Product Price + Expense + Stock Alert */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                <div>
                                    <label className={labelCls}>Product Price</label>
                                    <input type="number" defaultValue={0} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Expense</label>
                                    <input type="number" defaultValue={0} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Stock Alert</label>
                                    <input type="number" defaultValue={0} className={inputCls} />
                                </div>
                            </div>

                            {/* Tax Method + Discount */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                <div>
                                    <label className={labelCls}>Tax Method</label>
                                    <select className={inputCls}>
                                        <option value="">tax method</option>
                                        <option value="inclusive">Inclusive</option>
                                        <option value="exclusive">Exclusive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Discount</label>
                                    <input type="number" defaultValue={0} className={inputCls} />
                                </div>
                            </div>

                            {/* Promotional Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                <div>
                                    <label className={labelCls}>Promotional Price</label>
                                    <input type="number" defaultValue={0} className={inputCls} />
                                </div>
                            </div>

                            {/* Product Image */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-stone-800">Product Image</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-stone-500">Multiple Image</span>
                                        <button
                                            type="button"
                                            onClick={() => setMultipleImage(!multipleImage)}
                                            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${multipleImage ? 'bg-blue-500' : 'bg-stone-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${multipleImage ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="flex flex-col items-center justify-center gap-2 border border-dashed border-stone-300 rounded-2xl px-6 py-12 sm:py-16 text-center bg-white"
                                >
                                    {pendingFiles.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full mb-4">
                                            {pendingFiles.map((file, i) => (
                                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200">
                                                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                                                    {i === 0 && (
                                                        <span className="absolute top-1 left-1 bg-stone-900 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Primary</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePending(i)}
                                                        className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {pendingFiles.length === 0 && (
                                        <>
                                            <p className="text-sm font-medium text-stone-600">Drop product image here</p>
                                            <p className="text-xs text-stone-400">or</p>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                                    >
                                        Browse Files
                                    </button>
                                    <p className="text-xs text-stone-400 mt-1">Allowed JPEG, JPG & PNG format | Max 100 mb</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple={multipleImage}
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files ?? []);
                                            if (files.length) handleAddFiles(files);
                                            e.target.value = '';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => void navigate({ to: '/products' })}
                                    className="text-sm font-medium text-stone-600 px-4 py-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-stone-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? 'Saving...' : 'Create product'}
                                </button>
                            </div>
                        </div>

                        {/* Right — Product Menu (moves below on mobile) */}
                        <div className="w-full lg:w-64 lg:shrink-0">
                            <div className="border border-stone-200 rounded-xl p-4 space-y-4">
                                <h3 className="text-sm font-semibold text-stone-800">Product Menu</h3>
                                {([
                                    { key: 'diffWarehouse', label: 'Different price for different Warehouse' },
                                    { key: 'diffSupplier', label: 'Different Cost Price for different Supplier' },
                                    { key: 'hasExpiry', label: 'This product has date expired' },
                                    { key: 'promoSale', label: 'Add Promotional Sale' },
                                    { key: 'multiVariant', label: 'This product has multi variant' },
                                    { key: 'imeiCode', label: 'This product has IMEI Code' },
                                ] as const).map(({ key, label }) => (
                                    <div key={key} className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-stone-500 leading-snug">{label}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleMenu(key)}
                                            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${toggles[key] ? 'bg-blue-500' : 'bg-stone-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${toggles[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Product Images Tab ── */}
                {activeTab === 'images' && (
                    <div className="space-y-3 pt-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-stone-800">Product Image</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-500">Multiple Image</span>
                                <button
                                    type="button"
                                    onClick={() => setMultipleImage(!multipleImage)}
                                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${multipleImage ? 'bg-blue-500' : 'bg-stone-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${multipleImage ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        {pendingFiles.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {pendingFiles.map((file, i) => (
                                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                                        {i === 0 && (
                                            <span className="absolute top-1 left-1 bg-stone-900 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Primary</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePending(i)}
                                            className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex flex-col items-center justify-center gap-2 border border-dashed border-stone-300 rounded-2xl px-6 py-16 sm:py-20 text-center bg-white"
                        >
                            <p className="text-sm font-medium text-stone-600">Drop product image here</p>
                            <p className="text-xs text-stone-400">or</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                            >
                                Browse Files
                            </button>
                            <p className="text-xs text-stone-400 mt-1">Allowed JPEG, JPG & PNG format | Max 100 mb</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple={multipleImage}
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files ?? []);
                                    if (files.length) handleAddFiles(files);
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Variants Configurations Tab ── */}
                {activeTab === 'variants' && (
                    <div className="py-10 text-center text-sm text-stone-400">
                        Variants configuration coming soon.
                    </div>
                )}

                {/* ── Product Variant Tab ── */}
                {activeTab === 'variant' && (
                    <div className="py-10 text-center text-sm text-stone-400">
                        Product variant details coming soon.
                    </div>
                )}

            </form>
        </div>
    );
}