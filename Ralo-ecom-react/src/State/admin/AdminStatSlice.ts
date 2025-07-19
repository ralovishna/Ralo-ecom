import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api.ts';

interface AdminDashboardStats {
    totalUsers: number;
    newUsers: number;
    totalSellers: number;
    pendingSellers: number;
    totalOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalProducts: number;
    lowStockProducts: number;
    totalDiscounts: number;
    pendingDeliveries: number;
    timeframe: string;
}

interface TrendStats {
    labels: string[];
    revenue: number[];
    orders: number[];
}

interface AdminState {
    stats: AdminDashboardStats;
    trends: TrendStats | null;
    loading: boolean;
    trendsLoading: boolean;
    error: string | null;
    trendsError: string | null;
}

const initialState: AdminState = {
    stats: {
        totalUsers: 0,
        newUsers: 0,
        totalSellers: 0,
        pendingSellers: 0,
        totalOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        totalDiscounts: 0,
        pendingDeliveries: 0,
        timeframe: 'month',
    },
    trends: null,
    loading: false,
    trendsLoading: false,
    error: null,
    trendsError: null,
};

export const fetchAdminDashboardStats = createAsyncThunk<
    AdminDashboardStats,
    { timeframe: string; startDate?: string; endDate?: string },
    { rejectValue: string }
>(
    'admin/fetchAdminDashboardStats',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<AdminDashboardStats>('/api/dashboard/stats', {
                params: {
                    timeframe: params.timeframe,
                    startDate: params.startDate,
                    endDate: params.endDate,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            console.log('�� Fetched admin dashboard stats:', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const fetchAdminDashboardTrends = createAsyncThunk<
    TrendStats,
    { timeframe: string; startDate?: string; endDate?: string },
    { rejectValue: string }
>(
    'adminStat/fetchAdminDashboardTrends',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<TrendStats>('/api/dashboard/trends', {
                params: {
                    timeframe: params.timeframe,
                    startDate: params.startDate,
                    endDate: params.endDate,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            console.log('�� Fetched admin dashboard trends:', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const adminStatSlice = createSlice({
    name: 'adminStat',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch stats';
            })
            .addCase(fetchAdminDashboardTrends.pending, (state) => {
                state.trendsLoading = true;
                state.trendsError = null;
            })
            .addCase(fetchAdminDashboardTrends.fulfilled, (state, action) => {
                state.trendsLoading = false;
                state.trends = action.payload;
            })
            .addCase(fetchAdminDashboardTrends.rejected, (state, action) => {
                state.trendsLoading = false;
                state.trendsError = action.payload || 'Failed to fetch trends';
            });
    },
});

export default adminStatSlice.reducer;