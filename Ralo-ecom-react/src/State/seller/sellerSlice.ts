// sellerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api.ts";
import { Seller } from "../../types/SellerTypes.ts";
import { setSellerLoggedIn } from "../AuthSlice.ts";
import { Order } from "../../types/OrderTypes.ts";
import { Product } from "../../types/ProductTypes.ts";

interface SellerDashboardStats {
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    averageOrderValue: number;
    pendingOrders: number;
    cancelledOrders: number;
    completedOrders: number;
    timeframe: string;
}

interface TrendStats {
    labels: string[];
    revenue: number[];
    orders: number[];
}

interface SellerState {
    profile: Seller | null;
    isSellerLoggedIn: boolean;
    stats: SellerDashboardStats | null;
    trends: TrendStats | null;
    orders: Order[];
    products: Product[];
    loading: boolean;
    trendsLoading: boolean;
    error: string | null;
    trendsError: string | null;
}

const initialState: SellerState = {
    profile: null,
    isSellerLoggedIn: false,
    stats: null,
    trends: null,
    orders: [],
    products: [],
    loading: false,
    trendsLoading: false,
    error: null,
    trendsError: null,
};

export const fetchSellerDashboardStats = createAsyncThunk<
    SellerDashboardStats,
    { timeframe: string; startDate?: string; endDate?: string },
    { rejectValue: string }
>(
    'seller/fetchSellerDashboardStats',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<SellerDashboardStats>('/sellers/dashboard/stats', {
                params,
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchSellerDashboardTrends = createAsyncThunk<
    TrendStats,
    { timeframe: string; startDate?: string; endDate?: string },
    { rejectValue: string }
>(
    'seller/fetchSellerDashboardTrends',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<TrendStats>('/sellers/dashboard/trends', {
                params,
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const fetchSellerProfile = createAsyncThunk(
    "seller/fetchSellerProfile",
    async (_, { dispatch, rejectWithValue }) => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) return rejectWithValue("JWT not found");
        try {
            const res = await api.get("/sellers/profile", {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("Seller profile fetched successfully", res.data);
            dispatch(setSellerLoggedIn(true)); // ✅ Sync global seller login state
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to fetch seller profile");
        }
    }
);

export const createSeller = createAsyncThunk(
    "seller/createSeller",
    async (seller: any, { rejectWithValue }) => {
        try {
            const res = await api.post("/sellers", seller);
            console.log("Seller created successfully", res.data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to create seller");
        }
    }
);

export const updateSellerProfile = createAsyncThunk(
    "seller/updateSellerProfile",
    async (updatedData: Partial<Seller>, { rejectWithValue }) => {
        try {
            const res = await api.patch("/sellers", updatedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("Seller updated successfully", res.data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update seller profile"
            );
        }
    }
);

// sellerSlice.ts (or a separate file like sellerActions.ts)

export const verifySellerEmail = createAsyncThunk(
    'seller/verifyEmail',
    async (otp: string, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/sellers/verify/${otp}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Invalid or expired OTP");
        }
    }
);


const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        markSellerLoggedOut: (state) => {
            state.profile = null;
            state.isSellerLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchSellerDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch stats';
            })
            .addCase(fetchSellerDashboardTrends.pending, (state) => {
                state.trendsLoading = true;
                state.trendsError = null;
            })
            .addCase(fetchSellerDashboardTrends.fulfilled, (state, action) => {
                state.trendsLoading = false;
                state.trends = action.payload;
            })
            .addCase(fetchSellerDashboardTrends.rejected, (state, action) => {
                state.trendsLoading = false;
                state.trendsError = action.payload || 'Failed to fetch trends';
            })
            .addCase(fetchSellerProfile.pending, (state) => {
                console.log("pending fetchSellerProfile...");
                state.loading = true;
            })
            .addCase(fetchSellerProfile.fulfilled, (state, action) => {
                console.log("Seller profile fetched successfully", action.payload); // ADD THIS
                state.profile = action.payload;
                console.log("isSellerLoggedIn:", state.isSellerLoggedIn);
                state.isSellerLoggedIn = true;
                state.loading = false;
            })
            .addCase(fetchSellerProfile.rejected, (state) => {
                console.log("Failed to fetch seller profile");
                state.profile = null;
                state.isSellerLoggedIn = false;
                state.loading = false;
            })
            // Create Seller
            .addCase(createSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.isSellerLoggedIn = true; // You can optionally auto-login after creation
            })
            .addCase(createSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create seller";
            })
            .addCase(updateSellerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSellerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateSellerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update seller profile";
            })
            .addCase(verifySellerEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifySellerEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.isSellerLoggedIn = true; // Optional
            })
            .addCase(verifySellerEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Verification failed";
            });
    }
});

export const { markSellerLoggedOut } = sellerSlice.actions;
export { fetchSellerProfile };
export default sellerSlice.reducer;
