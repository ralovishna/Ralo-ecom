import { applyCoupon } from './CouponSlice.ts';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from './../../types/CartTypes.ts'; // Ensure Cart type includes all backend computed totals
import { api } from '../../config/Api.ts';
// Remove these, as the backend will provide calculated sums
// import { sumCartItemMrpPrice } from '../../Util/sumCartItemMrpPrice.ts';
// import { sumCartItemSellingPrice } from '../../Util/sumCartItemSellingPrice.ts';


interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    couponApplied: boolean;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
    couponApplied: false
};

const API_URL = "/api/cart";

// This thunk is already perfect for fetching the *entire* cart with calculated totals.
export const fetchUserCart = createAsyncThunk<Cart, string>(
    "cart/fetchUserCart",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("fetched user cart:", response.data);
            return response.data; // This payload is the complete Cart object
        } catch (error: any) {
            console.error("Failed to fetch user cart:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
        }
    }
);

interface AddItemRequest {
    productId: number | undefined;
    size: string;
    quantity: number;
}

// Modify addItemToCart to return the *full cart* after the item is added.
// This requires your backend's /api/cart/add endpoint to return the full updated Cart.
// If your backend only returns CartItem, then we'll adjust the reducer to trigger a fetchUserCart.
export const addItemToCart = createAsyncThunk<Cart, { jwt: string | null; request: AddItemRequest }>(
    "cart/addItemToCart",
    async ({ jwt, request }, { rejectWithValue, dispatch }) => {
        try {
            // First, add the item to the cart
            await api.put(`${API_URL}/add`, request, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            // After adding, fetch the entire updated cart to get new totals
            // Dispatch fetchUserCart to update the state with the latest backend cart
            const updatedCart = await dispatch(fetchUserCart(jwt!)).unwrap(); // Use unwrap to get the fulfilled payload
            console.log("item added to cart & full cart fetched:", updatedCart);
            return updatedCart;
        } catch (error: any) {
            console.error("Failed to add item to cart:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
        }
    }
);

export const removeCartItem = createAsyncThunk<Cart, { jwt: string | null; cartItemId: number }>(
    "cart/removeCartItem",
    async ({ jwt, cartItemId }, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`${API_URL}/item/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            // After removal, fetch the entire updated cart to get new totals
            const updatedCart = await dispatch(fetchUserCart(jwt!)).unwrap();
            console.log("item removed from cart & full cart fetched:", updatedCart);
            return updatedCart;
        } catch (error: any) {
            console.error("Failed to remove item from cart:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to remove item from cart");
        }
    }
);


export const updateCartItem = createAsyncThunk<Cart, { jwt: string | null; cartItemId: number; cartItem: any }>(
    "cart/updateCartItem",
    async ({ jwt, cartItemId, cartItem }, { rejectWithValue, dispatch }) => {
        try {
            await api.put(`${API_URL}/item/${cartItemId}`, cartItem, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            // After updating, fetch the entire updated cart to get new totals
            const updatedCart = await dispatch(fetchUserCart(jwt!)).unwrap();
            console.log("item updated in cart & full cart fetched:", updatedCart);
            return updatedCart;
        } catch (error: any) {
            console.error("Failed to update item in cart:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to update item in cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartState: (state) => {
            state.cart = null;
            state.loading = false;
            state.error = null;
            state.couponApplied = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchUserCart
            .addCase(fetchUserCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload; // Set the entire cart object from backend

                state.couponApplied = !!action.payload.couponCode;
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle addItemToCart (now it returns the full Cart, so it's similar to fetchUserCart)
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload; // Set the entire cart object from backend
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle removeCartItem (now it returns the full Cart)
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload; // Set the entire cart object from backend
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle updateCartItem (now it returns the full Cart)
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload; // Set the entire cart object from backend
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle applyCoupon (already correctly updates the whole cart)
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            });
    },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;