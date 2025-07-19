import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderStatus } from "../../types/OrderTypes.ts";
import { api } from "../../config/Api.ts";

// ==========================
// 🔄 Async Thunks
// ==========================

export const fetchSellerOrders = createAsyncThunk<Order[]>(
    "sellerOrders/fetchSellerOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/seller/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("Fetched seller orders:", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch seller orders");
        }
    }
);

export const updateOrderStatus = createAsyncThunk<
    Order,
    { orderId: number; status: OrderStatus; }
>("sellerOrders/updateOrderStatus", async ({ orderId, status }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/api/seller/orders/${orderId}/status/${status}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        console.log("Updated order status:", response.data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
});

export const deleteOrder = createAsyncThunk<
    number, // Just return deleted orderId for easy filtering
    { orderId: number; jwt: string | null }
>("sellerOrders/deleteOrder", async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
        await api.delete(`/api/seller/orders/${orderId}/delete`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        console.log("Deleted order:", orderId);
        return orderId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
});

// ==========================
// 🧾 Initial State
// ==========================

interface SellerOrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: SellerOrderState = {
    orders: [],
    loading: false,
    error: null,
};

// ==========================
// 🧩 Slice Definition
// ==========================

const sellerOrdersSlice = createSlice({
    name: "sellerOrders",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // Fetch seller orders
            .addCase(fetchSellerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchSellerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.orders = state.orders.filter(order => order.id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ==========================
// 📤 Export Reducer
// ==========================

export default sellerOrdersSlice.reducer;
