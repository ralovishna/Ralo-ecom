// AddressSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'; // Import PayloadAction for stronger typing
import { api } from '../../config/Api.ts'; // Assuming 'api' is your Axios instance or similar configured for base URL etc.
import { RootState } from '../Store.ts'; // Import RootState for typed selectors

// Define the Address interface directly if it's solely used here,
// otherwise, keep it in a shared types file (e.g., types/UserTypes.ts as you previously indicated)
// For consistency with your Checkout.tsx, ensure Address type is imported from '../../../types/UserTypes.ts'
// If this Address interface is the canonical definition, then other files should import from here.
export interface Address {
    id: number;
    name: string;
    locality: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    mobile: string;
    // Potentially add optional fields like isDefault: boolean, country: string, etc.
}

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
};

// Replace with your backend URL prefix for addresses if 'api' doesn't handle it fully
// If 'api' already has a base URL like 'http://localhost:8080', then BASE_URL might just be '/api/addresses'
// You've correctly defined it as '/api/addresses', which means the full URL will be 'http://localhost:8080/api/addresses/user'
const BASE_URL = '/api/addresses';


// 🧨 Fetch addresses (GET)
export const fetchAddresses = createAsyncThunk<Address[], void, { rejectValue: string }>( // Explicitly type payload and reject value
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                // Good to explicitly reject if no JWT is found, preventing unnecessary API call
                return rejectWithValue('Authentication token not found. Please log in.');
            }
            const response = await api.get<Address[]>(`${BASE_URL}/user`, { // Type the response data for 'api.get'
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Fetched addresses:", response.data); // Use more descriptive log message

            // Ensure the data is an array (API might return empty array or null)
            if (!Array.isArray(response.data)) {
                console.warn("API did not return an array for addresses:", response.data);
                return rejectWithValue('Invalid data format received for addresses.');
            }

            return response.data;
        } catch (err: any) { // Consider more specific error types if possible (e.g., AxiosError)
            // Axios errors often have a structured response
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch addresses';
            console.error("Error fetching addresses:", errorMessage, err); // Log the full error object
            return rejectWithValue(errorMessage);
        }
    }
);

// 🚀 Add address (POST)
export const addAddress = createAsyncThunk<Address, Omit<Address, 'id'>, { rejectValue: string }>( // Explicitly type payload (added Address) and argument (address without ID)
    'address/addAddress',
    async (addressData: Omit<Address, 'id'>, { rejectWithValue }) => { // Rename 'address' to 'addressData' for clarity
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                return rejectWithValue('Authentication token not found. Please log in.');
            }
            const response = await api.post<Address>(`${BASE_URL}/add`, addressData, { // Type the response data
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Added address:", response.data);

            // Assuming the backend returns the newly created address including its ID
            if (!response.data || typeof response.data.id === 'undefined') {
                console.warn("API did not return a valid new address with an ID:", response.data);
                return rejectWithValue('Failed to add address: Invalid response from server.');
            }

            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add address';
            console.error("Error adding address:", errorMessage, err);
            return rejectWithValue(errorMessage);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        // You might consider adding a reducer here for directly selecting an address in state
        // if your UI logic benefits from it, but currently, local state in Checkout.tsx is fine.
        // For example:
        // setSelectedAddress: (state, action: PayloadAction<number | null>) => {
        //     state.selectedAddressId = action.payload;
        // }
    },
    extraReducers: (builder) => {
        builder
            // fetchAddresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => { // Use PayloadAction for strong typing
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action: PayloadAction<string | undefined>) => { // action.payload can be string or undefined
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred.'; // Provide fallback for error message
            })

            // addAddress
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => { // Use PayloadAction for strong typing
                state.loading = false;
                state.addresses.push(action.payload); // Add the new address to the list
            })
            .addCase(addAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred.';
            });
    },
});

// Selectors for convenience and type safety
export const selectAddresses = (state: RootState) => state.address.addresses;
export const selectAddressLoading = (state: RootState) => state.address.loading;
export const selectAddressError = (state: RootState) => state.address.error; // Add this selector

export default addressSlice.reducer;