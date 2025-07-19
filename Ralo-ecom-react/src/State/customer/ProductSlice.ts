// src/main/frontend/src/State/customer/ProductSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../config/Api.ts';

// Make sure Product is imported from the correct path with the updated fields
import { Product } from './../../types/ProductTypes.ts'; // Ensure this path is correct and Product includes new fields

const API_URL = "/products";

// Define an interface for the paginated response for fetchAllProducts
interface PaginatedProductsResponse {
    content: Product[];
    totalPages: number;
    totalElements: number; // Often present in paginated responses
    size: number; // Add if your API returns it
    number: number; // Add if your API returns current page number
    first: boolean; // Add if your API returns
    last: boolean; // Add if your API returns
    // Add other pagination related fields if your API sends them (e.g., size, number, first, last)
}

// Define interface for fetchAllProducts parameters
interface FetchAllProductsParams {
    category?: string; // Added: To filter by product category
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    minDiscount?: number;
    pageNumber?: number;
    pageSize?: number; // Added: To control number of items per page
    sort?: string; // Added: To control sorting (e.g., "price_low", "price_high")
}

// === THUNKS ===

export const fetchProductById = createAsyncThunk<
    Product, // return type of the fulfilled action
    number,  // argument type
    { rejectValue: string }
>(
    'products/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get<Product>(`${API_URL}/${productId}`);
            console.log("prod by id response", response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching product by ID:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// export const searchProduct = createAsyncThunk<Product[], string, { rejectValue: string }>(
//     'products/searchProduct',
//     async (query, { rejectWithValue }) => {
//         try {
//             const response = await api.get<Product[]>(`${API_URL}/search`, { params: { query } });
//             console.log("search prod", response.data);
//             return response.data;
//         } catch (error: any) {
//             console.error('Error searching products:', error);
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

export const searchProduct = createAsyncThunk<
    PaginatedProductsResponse,
    FetchAllProductsParams & { query?: string },
    { rejectValue: string }
>(
    'products/searchProduct',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<PaginatedProductsResponse>(`${API_URL}/search`, {
                params: {
                    query: params.query || '',
                    category: params.category || '',
                    color: params.color || '',
                    minPrice: params.minPrice,
                    maxPrice: params.maxPrice,
                    minDiscount: params.minDiscount,
                    pageNumber: params.pageNumber || 0, // Fix: Use pageNumber
                    pageSize: params.pageSize || 10, // Align with backend
                    sort: params.sort || '',
                },
            });
            console.log('search prod', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error searching products:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllProducts = createAsyncThunk<
    PaginatedProductsResponse,
    FetchAllProductsParams,
    { rejectValue: string }
>(
    'products/fetchAllProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<PaginatedProductsResponse>(`${API_URL}`, {
                params: {
                    category: params?.category || "",
                    color: params?.color || "",
                    minPrice: params?.minPrice,
                    maxPrice: params?.maxPrice,
                    minDiscount: params?.minDiscount,
                    pageNumber: params?.pageNumber || 0,
                    pageSize: params?.pageSize || 10,
                    sort: params?.sort || "",
                }
            });
            console.log("all prod", response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching all products:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async Thunk for deleting a product
export const deleteProduct = createAsyncThunk<
    void, // No return data needed, just a successful deletion
    number, // Argument type, the product ID
    { rejectValue: string }
>(
    'products/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/${productId}`);
            console.log('Product deleted successfully:', productId);
        } catch (error: any) {
            console.error('Error deleting product:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// === STATE & SLICE ===

interface ProductState {
    product: Product | null;
    products: Product[];
    totalPages: number;
    totalElements: number; // New: Store total elements for more comprehensive pagination info
    loading: boolean;
    error: string | null;
    searchProducts: Product[];
}

const initialState: ProductState = {
    product: null,
    products: [],
    totalPages: 1, // Default to 1 page
    totalElements: 0, // Default to 0 elements
    loading: false,
    error: null,
    searchProducts: [],
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle deleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted product from the state
                state.products = state.products.filter(
                    (product) => product.id !== action.meta.arg // Remove the product by its ID
                );
            })
            .addCase(deleteProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete product.';
            })

            // fetchProductById
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch product by ID.';
            })

            // searchProduct
            .addCase(searchProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(searchProduct.fulfilled, (state, action: PayloadAction<Product[]>) => {
            //     state.loading = false;
            //     state.searchProducts = action.payload;
            // })
            // .addCase(searchProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
            //     state.loading = false;
            //     state.error = action.payload || 'Failed to search products.';
            // })
            .addCase(searchProduct.fulfilled, (state, action: PayloadAction<PaginatedProductsResponse>) => {
                state.loading = false;
                state.searchProducts = action.payload.content || [];
                state.totalPages = action.payload.totalPages || 1;
                state.totalElements = action.payload.totalElements || 0;
            })
            .addCase(searchProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to search products.';
                state.searchProducts = [];
                state.totalPages = 1;
                state.totalElements = 0;
            })

            // fetchAllProducts
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<PaginatedProductsResponse>) => {
                state.loading = false;
                state.products = action.payload?.content || [];
                state.totalPages = action.payload?.totalPages || 1;
                state.totalElements = action.payload?.totalElements || 0; // Store total elements
            })
            .addCase(fetchAllProducts.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch all products.';
                state.products = []; // Clear products on error
                state.totalPages = 1; // Reset total pages on error
                state.totalElements = 0; // Reset total elements on error
            });
    },
});

// Export default reducer
export default productSlice.reducer;

// If you need selectors for your components, define them here:
export const selectProduct = (state: { product: ProductState }) => state.product.product;
export const selectProducts = (state: { product: ProductState }) => state.product.products;
export const selectSearchProducts = (state: { product: ProductState }) => state.product.searchProducts;
export const selectProductLoading = (state: { product: ProductState }) => state.product.loading;
export const selectProductError = (state: { product: ProductState }) => state.product.error;
export const selectProductTotalPages = (state: { product: ProductState }) => state.product.totalPages;
export const selectProductTotalElements = (state: { product: ProductState }) => state.product.totalElements; // New selector