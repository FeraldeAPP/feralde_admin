import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    Megaphone03Icon, 
    Search01Icon, 
    FilterMailIcon, 
    ArrowDown01Icon,
    PinIcon,
    Calendar01Icon
} from "@hugeicons/core-free-icons";
import { useMyAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AnnouncementsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const { data, isLoading, isError } = useMyAnnouncements({ 
        page, 
        per_page: 15, 
        search: search || undefined 
    });

    const result = data?.success ? data.data : null;
    const announcements = result?.announcements ?? [];

    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 font-[var(--font-bricolage)] text-[#393939] min-h-full bg-white">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight uppercase tracking-tight">Distributor Portal</p>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#393939]">Announcements</h1>
                </div>
                <p className="text-xs text-stone-400 font-medium">{today}</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400 bg-white"
                    />
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                        <DropdownMenuTrigger className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-stone-600 border border-stone-200 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 font-medium focus:outline-none bg-white">
                            <span className="hidden sm:inline">{activeFilter ?? 'Filter'}</span>
                            <HugeiconsIcon
                                icon={FilterMailIcon}
                                size={15}
                                className={cn("transition-transform duration-200", filterOpen ? "rotate-180" : "rotate-0")}
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom" className="w-40">
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer" onClick={() => setActiveFilter(null)}>All</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer" onClick={() => setActiveFilter('Pinned')}>Pinned</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer" onClick={() => setActiveFilter('Recent')}>Recent</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content Section */}
            {isLoading && (
                <div className="py-24 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-stone-200 border-t-stone-900 mb-2"></div>
                    <p className="text-sm text-stone-400 font-medium">Loading announcements...</p>
                </div>
            )}

            {isError && (
                <div role="alert" className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center mt-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <HugeiconsIcon icon={Megaphone03Icon} size={24} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-red-900">Failed to load announcements</h3>
                    <p className="text-red-600 text-sm mt-1">Please check your connection and try again.</p>
                </div>
            )}

            {!isLoading && !isError && announcements.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[#F2F2F2] rounded-2xl bg-white p-8 text-center mt-4">
                    <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                        <HugeiconsIcon icon={Megaphone03Icon} size={32} className="text-stone-400" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">No announcements yet</h3>
                    <p className="text-stone-500 max-w-xs mx-auto text-sm mt-2">
                        Stay tuned for the latest news and updates from Feralde.
                    </p>
                </div>
            )}

            {!isLoading && !isError && announcements.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {announcements.map((announcement) => (
                        <div 
                            key={announcement.id} 
                            className="group bg-white rounded-[28px] border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all p-6 flex flex-col relative"
                        >
                            {announcement.is_pinned && (
                                <div className="absolute top-4 right-4 text-stone-400">
                                    <HugeiconsIcon icon={PinIcon} size={16} />
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-4 text-[#A5A5A5]">
                                <HugeiconsIcon icon={Calendar01Icon} size={14} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">
                                    {new Date(announcement.published_at || announcement.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-stone-800 group-hover:text-stone-900 transition-colors mb-2 line-clamp-2">
                                {announcement.title}
                            </h3>
                            
                            <p className="text-sm text-stone-500 line-clamp-3 mb-6 flex-1">
                                {announcement.body}
                            </p>

                            <button className="text-xs font-bold text-stone-900 flex items-center gap-1.5 hover:gap-2 transition-all w-fit">
                                Read More
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
