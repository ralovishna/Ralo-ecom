import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api.ts";
import { User } from "../../types/UserTypes.ts";
import { Order } from "../../types/OrderTypes.ts";
import { Seller } from "../../types/SellerTypes.ts";

const initialState: TransactionState = {
    transactions: [],
    transaction: null,
    loading: false,
    error: null
};

interface TransactionState {
    transactions: Transaction[];
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
}

interface Transaction {
    id: number;
    customer: User;
    order: Order;
    seller: Seller;
    date: string;
}

export const fetchTransactionsBySeller = createAsyncThunk<Transaction[], string, { rejectValue: string }>(
    'transactions/fetchTransactionsBySeller',
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/transactions/seller', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            console.log('Fetched transactions by seller:', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

export const fetchAllTransactions = createAsyncThunk<Transaction[], void, { rejectValue: string }>(
    'transactions/fetchAllTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/transactions');
            console.log('Fetched all transactions:', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch transactions by seller
            .addCase(fetchTransactionsBySeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsBySeller.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactionsBySeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch all transactions
            .addCase(fetchAllTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchAllTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default transactionSlice.reducer;