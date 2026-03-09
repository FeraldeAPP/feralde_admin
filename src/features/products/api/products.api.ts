import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { Product, ProductFilters, ProductListData, ProductPayload, ProductMedia, UploadResult, AddMediaPayload } from '../types';

export async function getProducts(filters?: ProductFilters): Promise<ApiResponse<ProductListData>> {
    const { data } = await client.get<ApiResponse<ProductListData>>('/products', { params: filters });
    return data;
}

export async function getProduct(id: number): Promise<ApiResponse<Product>> {
    const { data } = await client.get<ApiResponse<Product>>(`/products/${id}`);
    return data;
}

export async function createProduct(payload: ProductPayload): Promise<ApiResponse<Product>> {
    const { data } = await client.post<ApiResponse<Product>>('/products', payload);
    return data;
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<ApiResponse<Product>> {
    const { data } = await client.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return data;
}

export async function deleteProduct(id: number): Promise<ApiResponse<null>> {
    const { data } = await client.delete<ApiResponse<null>>(`/products/${id}`);
    return data;
}

export async function uploadFile(file: File, folder = 'products'): Promise<ApiResponse<UploadResult>> {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const { data } = await client.post<ApiResponse<UploadResult>>('/upload', form);
    return data;
}

export async function addProductMedia(productId: number, payload: AddMediaPayload): Promise<ApiResponse<ProductMedia>> {
    const { data } = await client.post<ApiResponse<ProductMedia>>(`/products/${productId}/media`, payload);
    return data;
}

export async function deleteProductMedia(productId: number, mediaId: number): Promise<ApiResponse<null>> {
    const { data } = await client.delete<ApiResponse<null>>(`/products/${productId}/media/${mediaId}`);
    return data;
}


