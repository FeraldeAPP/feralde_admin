import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreateShippingMethod, useUpdateShippingMethod } from '../hooks/use-shipping-methods';
import type { ShippingMethod } from '../types';

const scheme = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    base_fee: z.coerce.number().min(0, 'Fee cannot be negative'),
    is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof scheme>;

interface ShippingMethodModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    method?: ShippingMethod | null;
}

export function ShippingMethodModal({ open, onOpenChange, method }: ShippingMethodModalProps) {
    const createMutation = useCreateShippingMethod();
    const updateMutation = useUpdateShippingMethod();

    const isEdit = !!method;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(scheme) as any,
        defaultValues: {
            name: '',
            description: '',
            base_fee: 0,
            is_active: true,
        }
    });

    useEffect(() => {
        if (open) {
            reset({
                name: method?.name ?? '',
                description: method?.description ?? '',
                base_fee: method?.base_fee ? Number(method.base_fee) : 0,
                is_active: method ? method.is_active : true,
            });
        }
    }, [open, method, reset]);

    const onSubmit = (data: FormValues) => {
        if (isEdit && method) {
            updateMutation.mutate(
                { id: method.id, data },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    }
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    onOpenChange(false);
                }
            });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Shipping Method' : 'Create Shipping Method'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. LBC Express"
                            {...register('name')}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                            placeholder="e.g. Standard delivery 3-5 days"
                            {...register('description')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="base_fee">Base Fee (₱)</Label>
                        <Input
                            id="base_fee"
                            type="number"
                            min="0"
                            step="0.01"
                            {...register('base_fee')}
                        />
                        {errors.base_fee && <p className="text-xs text-red-500">{errors.base_fee.message}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Label htmlFor="is_active" className="cursor-pointer">Active Status</Label>
                        <Controller
                            control={control}
                            name="is_active"
                            render={({ field }) => (
                                <Switch
                                    id="is_active"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
