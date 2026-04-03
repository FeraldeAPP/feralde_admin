import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface CategoryItem {
  category: string;
  amount: number;
}

interface CategoryListCardProps {
  title: string;
  data: CategoryItem[];
  totalLabel: string;
  totalAmount: number;
  showDateSelector?: boolean;
  className?: string;
}

export const CategoryListCard: React.FC<CategoryListCardProps> = ({
  title,
  data,
  totalLabel,
  totalAmount,
  showDateSelector = true,
  className,
}) => {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-stone-100 flex flex-col h-full", className)}>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-stone-100">
        <h3 className="text-lg font-bold text-stone-800">{title}</h3>
        {showDateSelector && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors">
            Today
            <HugeiconsIcon icon={Calendar03Icon} size={14} />
          </button>
        )}
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Category</span>
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Amount (₱)</span>
      </div>

      {/* List Items */}
      <div className="flex-1 space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-stone-600">{item.category}</span>
            <span className="text-sm font-medium text-stone-600">{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Footer / Total */}
      <div className="mt-6 pt-4 border-t border-dashed border-stone-800/20">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-bold text-stone-800">{totalLabel}</span>
          <span className="text-sm font-bold text-stone-800">{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
