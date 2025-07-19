import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../config/Api.ts'; // Assumes api is a pre-configured axios instance
import { BusinessDetails } from '../../types/SellerTypes.ts';

// Define valid statuses as a TypeScript enum
export enum AccountStatus {
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    DEACTIVATED = 'DEACTIVATED',
    BANNED = 'BANNED',
    CLOSED = 'CLOSED',
}

// Define the Seller type
export interface Seller {
    id: number;
    sellerName: string;
    email: string;
    mobile: string;
    gstin: string;
    businessDetails: BusinessDetails;
    accountStatus: AccountStatus;
}

// Redux state shape
interface SellerState {
    sellers: Seller[];
    loading: boolean;
    error: string | null;
}

const initialState: SellerState = {
    sellers: [],
    loading: false,
    error: null,
};

const API_URL = 'sellers';

// Async thunk for fetching sellers
// For fetchSellers
// In your fetchSellers action creator

export const fetchSellers = createAsyncThunk<Seller[], AccountStatus>(
    'sellers/fetchSellers',  // The action type
    async (status: AccountStatus, { rejectWithValue }) => {
        try {
            const response = await api.get(`/sellers?status=${status}`);
            return response.data; // The result will be automatically passed to the fulfilled action
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update status');
        }
    }
);


// For changeSellerStatus
export const changeSellerStatus = createAsyncThunk(
    'sellers/changeSellerStatus',
    async (
        { sellerId, newStatus }: { sellerId: number; newStatus: AccountStatus },
        { dispatch, rejectWithValue }
    ) => {
        try {
            await api.patch(`${API_URL}/${sellerId}/status`, { status: newStatus });
            // Optionally: dispatch(fetchSellers(AccountStatus.ACTIVE));
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update status');
        }
    }
);



// Seller slice
const sellerSlice = createSlice({
    name: 'sellers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellers.fulfilled, (state, action: PayloadAction<Seller[]>) => {
                state.sellers = action.payload;
                state.loading = false;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(changeSellerStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeSellerStatus.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changeSellerStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default sellerSlice.reducer;
