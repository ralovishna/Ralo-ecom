import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api.ts";
import { ApiResponse, DealState, Deal } from "../../types/DealTypes.ts";

// 🔒 Utility for authorization headers
const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

// 📦 Initial State
const initialState: DealState = {
    deals: [],
    dealCreated: false,
    dealUpdated: false,
    loading: false,
    error: null,
};

// 🔁 Async Thunks

export const createDeal = createAsyncThunk<Deal, Deal, { rejectValue: string }>(
    "deals/createDeal",
    async (deal, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/deals", deal, {
                headers: getAuthHeaders(),
            });
            console.log("✅ Created deal:", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteDeal = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    "deals/deleteDeal",
    async (dealId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/admin/deals/${dealId}`, {
                headers: getAuthHeaders(),
            });
            console.log("🗑️ Deleted deal:", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllDeals = createAsyncThunk<Deal[], void, { rejectValue: string }>(
    "deals/getAllDeals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/deals", {
                headers: getAuthHeaders(),
            });
            console.log("📄 Fetched deals:", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 🧩 Slice

const dealSlice = createSlice({
    name: "deals",
    initialState,
    reducers: {
        resetDealFlags: (state) => {
            state.dealCreated = false;
            state.dealUpdated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // 👉 Get Deals
            .addCase(getAllDeals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
                state.deals = action.payload;
                state.loading = false;
            })
            .addCase(getAllDeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch deals";
            })

            // 👉 Create Deal
            .addCase(createDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.dealCreated = false;
            })
            .addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
                state.deals.push(action.payload);
                state.loading = false;
                state.dealCreated = true;
            })
            .addCase(createDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create deal";
            })

            // 👉 Delete Deal
            .addCase(deleteDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.deals = state.deals.filter((deal) => deal.id !== action.meta.arg);
                state.loading = false;
            })
            .addCase(deleteDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete deal";
            });
    },
});

// ✅ Exports
export const { resetDealFlags } = dealSlice.actions;
export default dealSlice.reducer;
