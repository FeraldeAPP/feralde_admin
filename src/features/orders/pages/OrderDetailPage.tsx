import { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DetailPageSkeleton } from '@/components/loading/SkeletonLoaders';
import { getOrder, updateOrderStatus, markOrderAsPaid, getOrderHistory } from '@/features/orders/api';
import { useAuth } from '@/hooks/use-auth';
import type { OrderStatus } from '@/features/orders/types';
import { resolveMediaUrl } from '@/lib/utils';
import {
    ArrowLeft01Icon,
    Package01Icon,
    DeliveryTruck01Icon,
    Tick02Icon,
    Settings01Icon,
    Calendar03Icon,
    UserIcon,
    Location01Icon,
    Wallet02Icon,
    AlertCircleIcon,
    Copy01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { OrderHistoryLog } from '../components/OrderHistoryLog';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
    PENDING: { label: 'Pending', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', icon: Calendar03Icon },
    CONFIRMED: { label: 'Confirmed', color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]', icon: Tick02Icon },
    PROCESSING: { label: 'Processing', color: 'text-[#6366F1]', bg: 'bg-[#EEF2FF]', icon: Settings01Icon },
    PACKED: { label: 'Packed', color: 'text-[#8B5CF6]', bg: 'bg-[#F5F3FF]', icon: Package01Icon },
    SHIPPED: { label: 'Shipped', color: 'text-[#06B6D4]', bg: 'bg-[#ECFEFF]', icon: DeliveryTruck01Icon },
    DELIVERED: { label: 'Delivered', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', icon: Tick02Icon },
    CANCELLED: { label: 'Cancelled', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', icon: AlertCircleIcon },
    RETURNED: { label: 'Returned', color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', icon: ArrowLeft01Icon },
};

const FULFILLMENT_STEPS: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
];

const formatPrice = (value: string | number | null | undefined) => {
    const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
    return (Number.isNaN(num) ? 0 : num).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export default function OrderDetailPage(): React.ReactElement {
    const { id } = useParams({ strict: false });

    if (!id) return <div>Invalid order</div>;

    return <OrderDetailContent id={id} />;
}

function OrderDetailContent({ id }: { id: string }): React.ReactElement {
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();
    const canUpdateStatus = hasPermission('orders.update');

    const { data: orderData, isLoading: isOrderLoading, isError } = useQuery({
        queryKey: ['orders', id],
        queryFn: () => getOrder(Number(id)),
    });

    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['orders', id, 'history'],
        queryFn: () => getOrderHistory(Number(id)),
    });

    const order = orderData?.success ? orderData.data : null;
    const history = historyData?.success ? historyData.data : [];

    const [shippingMethod, setShippingMethod] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isShippedDialogOpen, setIsShippedDialogOpen] = useState(false);

    useEffect(() => {
        if (order) {
            setShippingMethod(order.shipping_method || '');
            setTrackingNumber(order.tracking_number || '');
        }
    }, [order]);

    const mutation = useMutation({
        mutationFn: ({ status, method, tracking }: { status: OrderStatus; method?: string; tracking?: string }) =>
            updateOrderStatus(Number(id), status, method, tracking),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['orders', id] });
            void queryClient.invalidateQueries({ queryKey: ['orders'] });
            void queryClient.invalidateQueries({ queryKey: ['orders', id, 'history'] });
            toast.success('Order status updated');
        },
        onError: () => {
            toast.error('Failed to update status');
        },
    });

    const paymentMutation = useMutation({
        mutationFn: () => markOrderAsPaid(Number(id)),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['orders', id] });
            void queryClient.invalidateQueries({ queryKey: ['orders'] });
            void queryClient.invalidateQueries({ queryKey: ['orders', id, 'history'] });
            toast.success('Payment confirmed successfully');
        },
        onError: () => {
            toast.error('Failed to confirm payment');
        },
    });

    const handleStatusUpdate = (status: OrderStatus): void => {
        if (status === 'SHIPPED') {
            if (!shippingMethod || !trackingNumber) {
                setIsShippedDialogOpen(true);
                return;
            }
            mutation.mutate({
                status,
                method: shippingMethod,
                tracking: trackingNumber
            }, {
                onSuccess: () => {
                    setIsShippedDialogOpen(false);
                }
            });
        } else {
            mutation.mutate({ status });
        }
    };

    const handleConfirmPayment = (): void => {
        paymentMutation.mutate();
    };

    if (isOrderLoading) {
        return <DetailPageSkeleton />;
    }

    if (isError || !order) {
        return (
            <div className="p-6">
                <Link to="/orders" className="flex items-center gap-2 text-[13px] font-bold text-[#393939] hover:opacity-70 transition-opacity mb-6">
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                    Back to Orders
                </Link>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                    <p className="text-red-700 text-sm font-medium">Failed to load order. Please try again.</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = FULFILLMENT_STEPS.indexOf(order.status);
    const nextStep = currentStepIndex !== -1 && currentStepIndex < FULFILLMENT_STEPS.length - 1
        ? FULFILLMENT_STEPS[currentStepIndex + 1]
        : null;

    return (
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 font-[var(--font-bricolage)] text-[#393939]  min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                    <Link to="/orders" className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#A5A5A5] hover:text-[#393939] transition-colors mb-0.5 sm:mb-1">
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                        Back to Orders
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#393939] font-mono">{order.order_number}</h1>
                        <Badge className={cn("rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold border-none shadow-none", STATUS_CONFIG[order.status].bg, STATUS_CONFIG[order.status].color)}>
                            {STATUS_CONFIG[order.status].label}
                        </Badge>
                        <Badge className={cn("rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold border-none shadow-none",
                            order.payment_status === 'PAID' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'
                        )}>
                            {order.payment_status}
                        </Badge>
                    </div>
                    <p className="text-[10px] sm:text-[12px] text-[#A5A5A5] font-medium">
                        Placed on {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <Button variant="outline" className="h-9 sm:h-10 border-[#F2F2F2] rounded-xl shadow-none bg-white hover:bg-gray-50 font-bold text-[12px] sm:text-[13px]">
                        Export Order
                    </Button>
                    {canUpdateStatus && nextStep && (
                        <Button
                            onClick={() => {
                                if (nextStep === 'SHIPPED') {
                                    setIsShippedDialogOpen(true);
                                } else {
                                    handleStatusUpdate(nextStep);
                                }
                            }}
                            disabled={mutation.isPending}
                            className="h-9 sm:h-10 bg-[#393939] hover:bg-[#393939]/90 text-white rounded-xl shadow-none font-bold text-[12px] sm:text-[13px] px-4 sm:px-6"
                        >
                            {mutation.isPending ? 'Updating...' : `Mark as ${STATUS_CONFIG[nextStep].label}`}
                        </Button>
                    )}
                </div>
            </div>

            {/* Fulfillment Stepper */}
            {currentStepIndex !== -1 && (
                <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                    <CardContent className="p-2 sm:p-4">
                        <div className="relative flex items-center justify-between w-full">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#F2F2F2] -z-0" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#393939] transition-all duration-500 -z-0"
                                style={{ width: `${(currentStepIndex / (FULFILLMENT_STEPS.length - 1)) * 100}%` }}
                            />

                            {FULFILLMENT_STEPS.map((step, idx) => {
                                const isCompleted = idx < currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                const config = STATUS_CONFIG[step];
                                return (
                                    <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div className={cn(
                                            "rounded-full flex items-center justify-center border-2 transition-all duration-300 h-7 w-7 sm:h-10 sm:w-10",
                                            isCompleted ? "bg-[#393939] border-[#393939] text-white" :
                                                isCurrent ? "bg-white border-[#393939] text-[#393939] sm:scale-110 shadow-lg" :
                                                    "bg-white border-[#F2F2F2] text-[#A5A5A5]"
                                        )}>
                                            <HugeiconsIcon icon={config.icon} size={14} className="sm:inline" />
                                        </div>
                                        <span className={cn(
                                            "absolute top-8 sm:top-12 whitespace-nowrap text-[9px] sm:text-[11px] font-bold",
                                            isCurrent ? "text-[#393939]" : "text-[#A5A5A5]"
                                        )}>
                                            {config.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Left Column: Items and Summary */}
                <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
                    {/* Order Items */}
                    <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 pb-1.5 sm:pb-2 px-2.5 sm:px-4 pt-2.5 sm:pt-4">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                <HugeiconsIcon icon={Package01Icon} size={18} className="text-[#393939]" />
                            </div>
                            <div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Order Items</CardTitle>
                                <p className="text-[10px] sm:text-[12px] text-[#A5A5A5]">{order.items?.length ?? 0} items</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-[10px] sm:text-[12px] font-medium text-[#A5A5A5] px-2.5 sm:px-4">Product</TableHead>
                                        <TableHead className="text-[10px] sm:text-[12px] font-medium text-[#A5A5A5] text-center">Qty</TableHead>
                                        <TableHead className="text-[10px] sm:text-[12px] font-medium text-[#A5A5A5] text-right">Price</TableHead>
                                        <TableHead className="text-[10px] sm:text-[12px] font-medium text-[#A5A5A5] text-right px-2.5 sm:px-4">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item) => {
                                            const primaryImage = item.image_url ||
                                                item.variant?.product?.media?.find((m) => m.is_primary)?.url ||
                                                item.variant?.product?.media?.[0]?.url;

                                            return (
                                                <TableRow key={item.id} className="border-t border-[#F2F2F2] hover:bg-transparent">
                                                    <TableCell className="py-1.5 sm:py-2.5 px-2.5 sm:px-4">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center shrink-0 border border-[#F2F2F2]">
                                                                {primaryImage ? (
                                                                    <img src={resolveMediaUrl(primaryImage)} alt={item.product_name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <HugeiconsIcon icon={Package01Icon} size={14} className="text-gray-300" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] sm:text-[13px] font-bold text-[#393939] leading-tight">{item.product_name}</span>
                                                                <span className="text-[9px] sm:text-[11px] text-[#A5A5A5] font-medium mt-0.5">{item.variant_name || 'Std'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-[11px] sm:text-[13px] text-[#393939] text-center py-1.5 sm:py-2.5">{item.quantity}</TableCell>
                                                    <TableCell className="text-[10px] sm:text-[13px] text-[#393939] text-right py-1.5 sm:py-2.5">₱{formatPrice(item.unit_price || (item as any).price)}</TableCell>
                                                    <TableCell className="text-[11px] sm:text-[13px] font-bold text-[#393939] text-right py-1.5 sm:py-2.5 px-2.5 sm:px-4">₱{formatPrice(item.total_amount || item.total_price || item.subtotal || (item as any).total)}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-12 text-center text-[#A5A5A5] text-[13px]">
                                                No items items list found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Price Summary */}
                    <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 pb-1.5 sm:pb-2 px-2.5 sm:px-4 pt-2.5 sm:pt-4">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-[#393939]" />
                            </div>
                            <div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Payment Summary</CardTitle>
                                <p className="text-[10px] sm:text-[12px] text-[#A5A5A5]">Payment breakdown</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2.5 sm:px-4 py-2 sm:py-3 space-y-1 sm:space-y-2">
                            <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
                                <span className="text-[#A5A5A5] font-medium">Subtotal</span>
                                <span className="text-[#393939] font-bold">₱{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
                                <span className="text-[#A5A5A5] font-medium">Shipping</span>
                                <span className="text-[#393939] font-bold">₱{formatPrice(order.shipping_fee)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
                                <span className="text-[#A5A5A5] font-medium">Discount</span>
                                <span className="text-red-500 font-bold">-₱{formatPrice(order.discount_amount)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
                                <span className="text-[#A5A5A5] font-medium">Tax</span>
                                <span className="text-[#393939] font-bold">₱{formatPrice(order.tax_amount)}</span>
                            </div>
                            <div className="h-px bg-[#F2F2F2] w-full my-1" />
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Total</span>
                                <span className="text-[16px] sm:text-[18px] font-bold text-[#393939]">₱{formatPrice(order.total_amount)}</span>
                            </div>
                            {order.payment_method && (
                                <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-[#F2F2F2] flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[12px] text-[#A5A5A5] font-medium uppercase tracking-wider">Payment Method</span>
                                    <span className="text-[11px] sm:text-[13px] font-bold text-[#393939]">{order.payment_method}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order History */}
                    <OrderHistoryLog history={history} isLoading={isHistoryLoading} />
                </div>

                {/* Right Column: Customer and Details */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Customer Info */}
                    <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 px-2.5 sm:px-4 pt-2.5 sm:pt-4 pb-1.5 sm:pb-2">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                <HugeiconsIcon icon={UserIcon} size={18} className="text-[#393939]" />
                            </div>
                            <div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Customer</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2.5 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                            <div className="flex items-start gap-2 sm:gap-4">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#F9F9F9] border border-[#F2F2F2] flex items-center justify-center shrink-0">
                                    <span className="text-[11px] sm:text-[13px] font-bold text-[#393939] uppercase">
                                        {(order.distributor?.distributor_code?.[0]) ||
                                            (order.billing_address?.first_name?.[0]) ||
                                            (order.shipping_address?.first_name?.[0]) ||
                                            (order.customer_name?.[0]) ||
                                            (order.guest_email?.[0]) || 'U'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] sm:text-[14px] font-bold text-[#393939]">
                                        {order.distributor ? order.distributor.distributor_code :
                                            order.billing_address ? `${order.billing_address.first_name} ${order.billing_address.last_name}` :
                                                order.shipping_address ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}` :
                                                    order.customer_name || order.guest_email || 'Walk-in Customer'}
                                    </span>
                                    <span className="text-[10px] sm:text-[12px] text-[#A5A5A5] font-medium">
                                        {order.distributor ? `Distributor: ${order.distributor.distributor_code}` :
                                            order.guest_email ? `Guest Order: ${order.guest_email}` : 'Regular Customer'}
                                    </span>
                                    {(order.shipping_address?.phone || (order as any).customer_phone) && (
                                        <span className="text-[10px] sm:text-[12px] text-[#393939] font-bold mt-1">
                                            {order.shipping_address?.phone || (order as any).customer_phone}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {order.distributor && (
                                <div className="pt-1 sm:pt-2">
                                    <div className="bg-[#F9F9F9] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[#F2F2F2]">
                                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                            <span className="text-[9px] sm:text-[11px] text-[#A5A5A5] font-bold uppercase">Rank</span>
                                            <span className="text-[9px] sm:text-[11px] font-bold text-[#393939]">{order.distributor.rank}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] sm:text-[11px] text-[#A5A5A5] font-bold uppercase">City</span>
                                            <span className="text-[9px] sm:text-[11px] font-bold text-[#393939]">{order.distributor.assigned_city || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 px-2.5 sm:px-4 pt-2.5 sm:pt-4 pb-1.5 sm:pb-2">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                <HugeiconsIcon icon={Location01Icon} size={18} className="text-[#393939]" />
                            </div>
                            <div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Shipping Address</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2.5 sm:px-4 py-2 sm:py-3">
                            {order.shipping_address ? (
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="bg-[#F9F9F9] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[#F2F2F2] group relative">
                                        <div className="space-y-1 sm:space-y-1.5">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Street</span>
                                                <span className="text-[11px] sm:text-[13px] text-[#393939] font-medium leading-tight">
                                                    {order.shipping_address.details}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Barangay</span>
                                                    <span className="text-[10px] sm:text-[12px] text-[#393939] font-medium">
                                                        {order.shipping_address.barangay || '—'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">City</span>
                                                    <span className="text-[10px] sm:text-[12px] text-[#393939] font-medium">
                                                        {order.shipping_address.city}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col pt-1">
                                                    <span className="text-[8px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Province</span>
                                                    <span className="text-[10px] sm:text-[12px] text-[#393939] font-medium">
                                                        {order.shipping_address.province}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col pt-1">
                                                    <span className="text-[8px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Region</span>
                                                    <span className="text-[10px] sm:text-[12px] text-[#393939] font-medium">
                                                        {order.shipping_address.region}
                                                    </span>
                                                </div>
                                            </div>


                                        </div>

                                        <button
                                            onClick={() => {
                                                const addr = `${order.shipping_address?.details}, ${order.shipping_address?.barangay}, ${order.shipping_address?.city}, ${order.shipping_address?.province}`;
                                                void navigator.clipboard.writeText(addr);
                                                toast.success('Address copied to clipboard');
                                            }}
                                            className="absolute top-2 sm:top-2 right-2 sm:right-2 h-6 sm:h-7 w-6 sm:w-7 rounded-lg bg-white border border-[#F2F2F2] flex items-center justify-center text-[#A5A5A5] hover:text-[#393939] hover:border-[#393939] transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                            title="Copy Address"
                                        >
                                            <HugeiconsIcon icon={Copy01Icon} size={12} />
                                        </button>
                                    </div>


                                </div>
                            ) : (
                                <div className="bg-[#F9F9F9] rounded-lg sm:rounded-xl p-3 sm:p-6 border border-[#F2F2F2] border-dashed flex flex-col items-center justify-center text-center">
                                    <HugeiconsIcon icon={Location01Icon} size={20} className="text-[#D1D1D1] mb-1 sm:mb-2" />
                                    <p className="text-[11px] sm:text-[13px] text-[#A5A5A5] font-medium italic">No shipping address.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Fulfillment Info (Read Only) */}
                    {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                        <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 px-2.5 sm:px-4 pt-2.5 sm:pt-4 pb-1.5 sm:pb-2">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                    <HugeiconsIcon icon={DeliveryTruck01Icon} size={18} className="text-[#393939]" />
                                </div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Fulfillment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="px-2.5 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Method</span>
                                        <span className="text-[11px] sm:text-[13px] text-[#393939] font-bold mt-0.5 sm:mt-1">
                                            {order.shipping_method || '—'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Tracking #</span>
                                        <span className="text-[11px] sm:text-[13px] text-[#393939] font-bold mt-0.5 sm:mt-1">
                                            {order.tracking_number || '—'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Info */}
                    <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 px-2.5 sm:px-4 pt-2.5 sm:pt-4 pb-1.5 sm:pb-2">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-[#393939]" />
                            </div>
                            <div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Payment Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2.5 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Status</span>
                                    <Badge className={cn("w-fit mt-0.5 sm:mt-1 rounded-lg px-1.5 sm:px-2 py-0 sm:py-0.5 text-[10px] sm:text-[11px] font-bold border-none shadow-none",
                                        order.payment_status === 'PAID' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'
                                    )}>
                                        {order.payment_status}
                                    </Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider">Method</span>
                                    <span className="text-[11px] sm:text-[13px] text-[#393939] font-bold mt-0.5 sm:mt-1">
                                        {order.payment_method || '—'}
                                    </span>
                                </div>
                            </div>

                            {order.payment_method === 'BANK_TRANSFER' && (
                                <div className="pt-1 sm:pt-2 border-t border-[#F2F2F2]">
                                    <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-bold uppercase tracking-wider block mb-1 sm:mb-2">Payment Proof</span>
                                    {order.payment_proof_url ? (
                                        <div className="rounded-lg sm:rounded-xl overflow-hidden border border-[#F2F2F2] bg-[#F9F9F9]">
                                            <a href={resolveMediaUrl(order.payment_proof_url)} target="_blank" rel="noopener noreferrer" className="block w-full">
                                                <img src={resolveMediaUrl(order.payment_proof_url)} alt="Payment Proof" className="w-full object-contain max-h-32 sm:max-h-48 hover:opacity-90 transition-opacity" />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg sm:rounded-xl p-2 sm:p-3">
                                            <p className="text-[10px] sm:text-[12px] text-[#92400E] font-medium leading-relaxed italic">
                                                No proof.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {order.payment_status !== 'PAID' && (
                                <Button
                                    onClick={handleConfirmPayment}
                                    disabled={paymentMutation.isPending}
                                    className="w-full h-9 sm:h-10 bg-[#393939] hover:bg-[#393939]/90 text-white rounded-xl sm:rounded-2xl shadow-none font-bold text-[12px] sm:text-[13px] transition-all"
                                >
                                    {paymentMutation.isPending ? 'Proc...' : 'Confirm'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Internal Notes */}
                    <Card className="border-[#F2F2F2] shadow-none rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-2.5 sm:px-4 pt-2.5 sm:pt-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] flex-shrink-0">
                                    <HugeiconsIcon icon={AlertCircleIcon} size={18} className="text-[#393939]" />
                                </div>
                                <CardTitle className="text-[13px] sm:text-[15px] font-bold text-[#393939]">Notes</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2.5 sm:px-4 py-2 sm:py-3">
                            <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg sm:rounded-xl p-2 sm:p-3">
                                <p className="text-[10px] sm:text-[12px] text-[#92400E] font-medium leading-relaxed italic">
                                    {order.internal_notes || 'No notes.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Shipped Status Dialog */}
            <Dialog open={isShippedDialogOpen} onOpenChange={setIsShippedDialogOpen}>
                <DialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-none rounded-xl sm:rounded-2xl shadow-2xl">
                    <DialogHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
                        <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                                <HugeiconsIcon icon={DeliveryTruck01Icon} size={16} className="sm:size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <DialogTitle className="text-sm sm:text-lg font-bold text-[#393939]">Shipment</DialogTitle>
                                <DialogDescription className="text-[10px] sm:text-[13px] text-[#A5A5A5]">
                                    Enter shipping details
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
                        <div className="space-y-1 sm:space-y-1.5">
                            <Label htmlFor="shipping_method_dialog" className="text-[9px] sm:text-[11px] font-bold text-[#A5A5A5] uppercase tracking-wider">Method</Label>
                            <Input
                                id="shipping_method_dialog"
                                placeholder="LBC, J&T Express"
                                value={shippingMethod}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                className="h-8 sm:h-11 border-[#F2F2F2] rounded-lg sm:rounded-xl focus:ring-1 focus:ring-[#393939] focus:border-[#393939] shadow-none text-[12px] sm:text-[14px]"
                            />
                        </div>
                        <div className="space-y-1 sm:space-y-1.5">
                            <Label htmlFor="tracking_number_dialog" className="text-[9px] sm:text-[11px] font-bold text-[#A5A5A5] uppercase tracking-wider">Number</Label>
                            <Input
                                id="tracking_number_dialog"
                                placeholder="Tracking number"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="h-8 sm:h-11 border-[#F2F2F2] rounded-lg sm:rounded-xl focus:ring-1 focus:ring-[#393939] focus:border-[#393939] shadow-none text-[12px] sm:text-[14px]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-3 sm:p-6 sm:pt-2 flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-3 bg-[#F9F9F9] border-t border-[#F2F2F2]">
                        <DialogClose className="flex-1 h-8 sm:h-11 border border-[#F2F2F2] rounded-lg sm:rounded-xl shadow-none bg-white hover:bg-gray-50 font-bold text-[11px] sm:text-[13px] focus:outline-none">
                                Close
                        </DialogClose>
                        <Button
                            onClick={() => handleStatusUpdate('SHIPPED')}
                            disabled={mutation.isPending || !shippingMethod.trim() || !trackingNumber.trim()}
                            className="flex-1 h-8 sm:h-11 bg-[#393939] hover:bg-[#393939]/90 text-white rounded-lg sm:rounded-xl shadow-none font-bold text-[11px] sm:text-[13px]"
                        >
                            {mutation.isPending ? 'Updating...' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
