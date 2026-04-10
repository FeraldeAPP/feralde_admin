export interface ShippingMethod {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    base_fee: number;
    created_at: string;
    updated_at: string;
}

export interface CreateShippingMethodDto {
    name: string;
    description?: string;
    is_active: boolean;
    base_fee: number;
}

export interface UpdateShippingMethodDto extends Partial<CreateShippingMethodDto> {}
