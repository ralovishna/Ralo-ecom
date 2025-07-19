import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "../../types/CartTypes.ts"; // Make sure Cart type is comprehensive
import { api } from "../../config/Api.ts";
import { CouponState } from "../../types/CouponTypes.ts"; // Ensure CouponState reflects your state structure


const API_URL = "api/coupons";

export const applyCoupon = createAsyncThunk<Cart, {
    apply: string;
    code: string;
    orderValue: number;
    jwt: string;
}, { rejectValue: string }>(
    "coupon/applyCoupon",
    async ({ apply, code, orderValue, jwt }, { rejectWithValue }) => {
        try {
            // Your backend /api/coupons/apply endpoint should return the FULL UPDATED CART object
            // with the coupon applied and couponDiscount calculated.
            const response = await api.post(`${API_URL}/apply`, null, {
                params: {
                    apply,
                    code,
                    orderAmount: orderValue
                },
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("applied coupon:", response.data);
            return response.data; // This MUST be the full Cart object
        } catch (error: any) {
            console.error("Failed to apply coupon:", error.response?.data?.message || error);
            return rejectWithValue(error.response?.data?.message || "Failed to apply coupon");
        }
    }
);


// Ensure removeCoupon returns the full Cart object from backend
export const removeCoupon = createAsyncThunk<Cart, { jwt: string, code: string }, { rejectValue: string }>(
    'cart/removeCoupon', // Renamed this to avoid confusion with cartSlice
    async ({ jwt, code }, { rejectWithValue }) => {
        try {
            // Your backend /api/coupons/remove endpoint should return the FULL UPDATED CART object
            // with the coupon removed and couponDiscount set to 0.
            const response = await api.post(
                `${API_URL}/remove?code=${code}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );
            console.log("Removed coupon, new cart state:", response.data);
            return response.data; // This MUST be the full Cart object
        } catch (error: any) {
            console.error("Error removing coupon:", error?.response?.data || error);
            return rejectWithValue(error.response?.data?.message || "Failed to remove coupon");
        }
    }
);


const initialState: CouponState = {
    coupons: [], // Assuming this is for listing available coupons
    cart: null, // This 'cart' in couponSlice should ideally be a reference to the main cart state.
    // However, for simplicity here, we'll assume it's updated directly.
    // A more advanced setup might have couponSlice only manage coupon-specific state,
    // and the main cartSlice would listen to these actions to update its own cart.
    loading: false,
    error: null,
    couponCreated: false,
    couponApplied: false
}

export const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.couponApplied = false; // Reset on pending
            })
            .addCase(applyCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload; // Update the entire cart in couponSlice's state
                state.couponApplied = true; // Set to true on successful application
            })
            .addCase(applyCoupon.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.error = action.payload || "Failed to apply coupon";
                state.couponApplied = false;
                state.loading = false;
            })
            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload; // Update the entire cart in couponSlice's state
                state.couponApplied = false; // Set to false on successful removal
                state.error = null; // Clear any previous errors
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to remove coupon";
            });
    }
});

export default couponSlice.reducer;