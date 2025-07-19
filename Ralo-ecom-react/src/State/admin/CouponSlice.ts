import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api.ts";
import { Coupon, CouponState, CreateCouponDTO } from "../../types/CouponTypes.ts";

// ⛳ Helper: Get JWT Header
const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

// 🟡 Get all coupons (Admin)
export const getAllCoupons = createAsyncThunk<Coupon[], void, { rejectValue: string }>(
    "coupons/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/coupons/admin/all", {
                headers: getAuthHeaders(),
            });
            console.log("📄 Fetched coupons:", res.data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 🟡 Create coupon (Admin)
export const createCoupon = createAsyncThunk<Coupon, CreateCouponDTO, { rejectValue: string }>(

    "coupons/create",
    async (couponData, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/coupons/admin/create", couponData, {
                headers: getAuthHeaders(),
            });
            console.log("�� Created coupon:", res.data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 🟡 Delete coupon (Admin)
export const deleteCoupon = createAsyncThunk<number, number, { rejectValue: string }>(
    "coupons/delete",
    async (couponId, { rejectWithValue }) => {
        try {
            await api.delete(`/api/coupons/admin/delete/${couponId}`, {
                headers: getAuthHeaders(),
            });
            console.log("Deleted coupon:", couponId);
            return couponId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 🌱 Initial state
const initialState: CouponState = {
    coupons: [],
    cart: null,
    couponApplied: false,
    couponCreated: false,
    loading: false,
    error: null,
};

// 🎯 Slice
const couponSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        resetCouponStatus(state) {
            state.couponApplied = false;
            state.couponCreated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Get All
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch coupons";
            })

            // Create
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.couponCreated = false;
            })
            .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                state.coupons.push(action.payload);
                state.couponCreated = true;
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to create coupon";
            })

            // Delete
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.coupons = state.coupons.filter((c) => c.id !== action.payload);
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to delete coupon";
            })

        // Apply / Remove
        // .addCase(applyCoupon.pending, (state) => {
        //     state.loading = true;
        //     state.couponApplied = false;
        // })
        // .addCase(applyCoupon.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.cart = action.payload;
        //     state.couponApplied = true;
        // })
        // .addCase(applyCoupon.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload ?? "Failed to apply/remove coupon";
        // });
    },
});

export const { resetCouponStatus } = couponSlice.actions;
export default couponSlice.reducer;
