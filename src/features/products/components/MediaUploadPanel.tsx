import { useRef } from 'react';
import type { ProductMedia } from '../types';

interface Props {
  existingMedia: ProductMedia[];
  onDeleteExisting: (mediaId: number) => void;
  pendingFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemovePending: (index: number) => void;
  isDeleting?: boolean;
}

export default function MediaUploadPanel({
  existingMedia,
  onDeleteExisting,
  pendingFiles,
  onAddFiles,
  onRemovePending,
  isDeleting = false,
}: Props): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAddFiles(files);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) onAddFiles(files);
  }

  const hasItems = existingMedia.length > 0 || pendingFiles.length > 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">Product images</h2>
        <p className="text-xs text-gray-400 mt-0.5">Upload product photos. First image becomes the primary.</p>
      </div>

      <div className="p-5 space-y-4">
        {hasItems && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {existingMedia.map((m) => (
              <div key={m.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={m.url}
                  alt={m.alt_text ?? 'Product image'}
                  className="w-full h-full object-cover"
                />
                {m.is_primary && (
                  <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onDeleteExisting(m.id)}
                  className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
                  aria-label="Remove image"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}

            {pendingFiles.map((file, i) => (
              <div key={`pending-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-indigo-300 bg-indigo-50">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Pending
                </span>
                <button
                  type="button"
                  onClick={() => onRemovePending(i)}
                  className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove pending image"
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
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? inputRef.current?.click() : undefined}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50 px-4 py-8 text-center cursor-pointer transition-colors"
        >
          <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-600">Click to upload or drag &amp; drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 20 MB each</p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}
