import { HugeiconsIcon } from '@hugeicons/react';
import {
    Calendar03Icon,
    Tick02Icon,
    Settings01Icon,
    Package01Icon,
    DeliveryTruck01Icon,
    AlertCircleIcon,
    Wallet02Icon,
    UserIcon,
} from '@hugeicons/core-free-icons';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { OrderHistory } from '../types/orders.types';

interface OrderHistoryLogProps {
    history: OrderHistory[];
    isLoading?: boolean;
}

const ACTION_ICONS: Record<string, any> = {
    STATUS_UPDATED: Settings01Icon,
    PAYMENT_CONFIRMED: Wallet02Icon,
    ORDER_CREATED: Tick02Icon,
    FULFILLMENT_CREATED: Package01Icon,
    SHIPPED: DeliveryTruck01Icon,
    CANCELLED: AlertCircleIcon,
    DEFAULT: Calendar03Icon,
};

export function OrderHistoryLog({ history, isLoading }: OrderHistoryLogProps) {
    if (isLoading) {
        return (
            <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#393939]" />
                    <p className="mt-4 text-[13px] text-[#A5A5A5] font-medium">Loading history...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 pb-2 px-4 pt-4">
                <div className="h-9 w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                    <HugeiconsIcon icon={Calendar03Icon} size={20} className="text-[#393939]" />
                </div>
                <div>
                    <CardTitle className="text-[15px] font-bold text-[#393939]">Order History</CardTitle>
                    <p className="text-[12px] text-[#A5A5A5]">{history.length} events logged</p>
                </div>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <div className="relative space-y-6">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#F2F2F2]" />

                    {history.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-[13px] text-[#A5A5A5] italic">No history logs available yet.</p>
                        </div>
                    ) : (
                        history.map((log, index) => {
                            const Icon = ACTION_ICONS[log.action] || ACTION_ICONS.DEFAULT;
                            return (
                                <div key={log.id} className="relative pl-8 group">
                                    {/* Dot */}
                                    <div className={cn(
                                        "absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full border-2 border-white flex items-center justify-center z-10 transition-colors",
                                        index === 0 ? "bg-[#393939] text-white" : "bg-white border-[#F2F2F2] text-[#A5A5A5]"
                                    )}>
                                        <HugeiconsIcon icon={Icon} size={12} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] font-bold text-[#393939]">{log.description}</span>
                                            <span className="text-[11px] text-[#A5A5A5] font-medium">
                                                {new Date(log.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                        {log.user_name && (
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-4 w-4 rounded-full bg-[#F9F9F9] border border-[#F2F2F2] flex items-center justify-center">
                                                    <HugeiconsIcon icon={UserIcon} size={8} className="text-[#A5A5A5]" />
                                                </div>
                                                <span className="text-[11px] text-[#A5A5A5] font-bold">
                                                    {log.user_name}
                                                </span>
                                            </div>
                                        )}
                                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                                            <div className="mt-1 p-2 bg-[#F9F9F9] rounded-lg border border-[#F2F2F2]">
                                                {Object.entries(log.metadata).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between text-[10px]">
                                                        <span className="text-[#A5A5A5] font-bold uppercase">{key.replace('_', ' ')}</span>
                                                        <span className="text-[#393939] font-medium">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
