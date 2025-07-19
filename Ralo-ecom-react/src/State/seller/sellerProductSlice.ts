import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api.ts";
import { Product } from "../../types/ProductTypes";

// === THUNKS ===

// Fetch all seller products
export const fetchSellerProducts = createAsyncThunk<Product[], string>(
    "sellerProduct/fetchSellerProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/seller/products", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("Failed to fetch seller products:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

// Create a new product
export const createProduct = createAsyncThunk<Product, { request: any; jwt: string | null }>(
    "sellerProduct/createProduct",
    async ({ request, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/seller/products", request, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("Failed to create product:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to create product");
        }
    }
);

export const updateProduct = createAsyncThunk<Product, { id: number; request: any; }>(
    "sellerProduct/updateProduct",
    async ({ id, request }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem("jwt");
            console.log("sdafdsf ", request);
            const response = await api.put(`/api/seller/products/${id}`, request, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("Failed to update product:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to update product");
        }
    }
);

// === SLICE ===

interface SellerProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: SellerProductState = {
    products: [],
    loading: false,
    error: null,
};

const sellerProductSlice = createSlice({
    name: "sellerProduct",
    initialState,
    reducers: {
        clearProductError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchSellerProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProductError } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
