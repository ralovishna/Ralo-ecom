import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderItem } from './../../types/OrderTypes';
import { Address } from '../../types/UserTypes.ts';
import { api } from '../../config/Api.ts';

interface OrderState {
    orders: Order[];
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any;
    orderCancelled: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    orderItem: null,
    currentOrder: null,
    paymentOrder: null,
    orderCancelled: false,
    loading: false,
    error: null,
};

const API_URL = '/api/orders';

const withAuthHeaders = (jwt: string) => ({
    headers: {
        Authorization: `Bearer ${jwt}`,
    },
});

// --- Thunks ---

export const fetchUserOrderHistory = createAsyncThunk<Order[], string>(
    'order/fetchUserOrderHistory',
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/user`, withAuthHeaders(jwt));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order history');
        }
    }
);


export const createOrder = createAsyncThunk<any, { address: Address; jwt: string; paymentGateway: string }>(
    'order/createOrder',
    async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                API_URL,
                address,
                {
                    ...withAuthHeaders(jwt),
                    params: { paymentMethod: paymentGateway },
                }
            );

            if (response.data.payment_link_url) {
                window.location.href = response.data.payment_link_url;
            }

            console.log("created order", response.data);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);


export const fetchOrderById = createAsyncThunk<Order, { orderId: number; jwt: string }>(
    'order/fetchOrderById',
    async ({ orderId, jwt }, { rejectWithValue }) => {
        console.log("orderId", orderId);
        try {
            const response = await api.get(`${API_URL}/${orderId}`, withAuthHeaders(jwt));
            console.log("fetched order", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

export const fetchOrderItemById = createAsyncThunk<OrderItem, { orderItemId: number; jwt: string }>(
    'order/fetchOrderItemById',
    async ({ orderItemId, jwt }, { rejectWithValue }) => {
        console.log("orderItemId", orderItemId);
        try {
            const response = await api.get(`${API_URL}/item/${orderItemId}`, withAuthHeaders(jwt));
            console.log("fetched order item", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order item');
        }
    }
);

export const paymentSuccess = createAsyncThunk<
    any,
    { paymentId: string; jwt: string; paymentLinkId: string },
    { rejectValue: string }
>(
    'order/paymentSuccess',
    async ({ paymentId, jwt, paymentLinkId }, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/api/payment/${paymentId}`,
                {
                    ...withAuthHeaders(jwt),
                    params: { paymentLinkId },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to confirm payment');
        }
    }
);


export const cancelOrder = createAsyncThunk<Order, number>(
    'order/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('jwt') || '';
            const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, withAuthHeaders(jwt));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);

// --- Slice ---

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user order history
            .addCase(fetchUserOrderHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCancelled = false;
            })
            .addCase(fetchUserOrderHistory.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrderHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.paymentOrder = action.payload;
                // state.orders = [];   
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch order item
            .addCase(fetchOrderItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderItemById.fulfilled, (state, action: PayloadAction<OrderItem>) => {
                state.loading = false;
                state.orderItem = action.payload;
            })
            .addCase(fetchOrderItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Payment success
            .addCase(paymentSuccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paymentSuccess.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(paymentSuccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCancelled = false;
            })
            .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                state.orders = state.orders.map((order) =>
                    order.id === action.payload.id ? action.payload : order
                );
                state.currentOrder = action.payload;
                state.orderCancelled = true;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default orderSlice.reducer;
