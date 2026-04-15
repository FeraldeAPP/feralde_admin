import { Skeleton } from '@/components/ui/skeleton';

/**
 * Table Row Skeleton
 * Use for loading table rows with multiple columns
 */
export function TableRowSkeleton({ columnCount = 5 }: { columnCount?: number }) {
    return (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-stone-100">
            {Array.from({ length: columnCount }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </div>
    );
}

/**
 * Table Skeleton
 * Use for loading full tables with header and multiple rows
 */
export function TableSkeleton({ rowCount = 8, columnCount = 5 }: { rowCount?: number; columnCount?: number }) {
    return (
        <div className="rounded-lg border border-stone-100 overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center gap-4 px-4 py-3 bg-stone-50 border-b border-stone-100">
                {Array.from({ length: columnCount }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: rowCount }).map((_, i) => (
                <TableRowSkeleton key={i} columnCount={columnCount} />
            ))}
        </div>
    );
}

/**
 * Card Skeleton
 * Use for loading card content with title, description, and details
 */
export function CardSkeleton() {
    return (
        <div className="rounded-lg border border-stone-100 p-6 space-y-4">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </div>

            {/* Content sections */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    );
}

/**
 * Form Skeleton
 * Use for loading form pages with multiple fields
 */
export function FormSkeleton({ fieldCount = 6 }: { fieldCount?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: fieldCount }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}

            {/* Submit button */}
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    );
}

/**
 * Grid Card Skeleton
 * Use for loading individual cards in a grid
 */
export function GridCardSkeleton() {
    return (
        <div className="rounded-lg border border-stone-100 overflow-hidden">
            {/* Image area */}
            <Skeleton className="w-full h-48" />

            {/* Content */}
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    );
}

/**
 * Grid Skeleton
 * Use for loading grid of cards
 */
export function GridSkeleton({ cardCount = 6, columns = 3 }: { cardCount?: number; columns?: number }) {
    return (
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`}>
            {Array.from({ length: cardCount }).map((_, i) => (
                <GridCardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Detail Page Skeleton
 * Use for loading detail pages with cards and sections
 */
export function DetailPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Main card */}
            <CardSkeleton />

            {/* Additional sections */}
            <CardSkeleton />
            <CardSkeleton />
        </div>
    );
}

/**
 * List Item Skeleton
 * Use for loading list items
 */
export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-stone-100">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-12" />
        </div>
    );
}

/**
 * List Skeleton
 * Use for loading lists
 */
export function ListSkeleton({ itemCount = 5 }: { itemCount?: number }) {
    return (
        <div className="rounded-lg border border-stone-100 overflow-hidden">
            {Array.from({ length: itemCount }).map((_, i) => (
                <ListItemSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Stats Card Skeleton
 * Use for loading stat/metric cards
 */
export function StatsCardSkeleton() {
    return (
        <div className="rounded-lg border border-stone-100 p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

/**
 * Stats Grid Skeleton
 * Use for loading dashboard stat cards
 */
export function StatsGridSkeleton({ cardCount = 4 }: { cardCount?: number }) {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: cardCount }).map((_, i) => (
                <StatsCardSkeleton key={i} />
            ))}
        </div>
    );
}
