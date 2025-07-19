import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wishlist, WishlistState } from "../../types/WishlistTypes.ts";
import { api } from "../../config/Api.ts";

const initialState: WishlistState = {
    wishlist: null,
    loading: false,
    error: null,
};

export const getWishlistByUserId = createAsyncThunk(
    "wishlist/getWishlistByUserId",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/wishlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("wishlist by user id", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
        }
    }
)

export const addProductToWishlist = createAsyncThunk(
    "wishlist/addProductToWishlist",
    async ({ productId }: { productId: number }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/wishlist/add-product/${productId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("product added to wishlist", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add product to wishlist");
        }
    }
)

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        resetWishlistState: (state) => {
            state.wishlist = null;
            state.loading = false;
            state.error = null;
        }
    },
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Extra reducers for the wishlist slice. Handles the following cases:
     * - getWishlistByUserId: sets loading to true, error to null, and on fulfillment, sets loading to false and wishlist to the payload.
     * - addProductToWishlist: sets loading to true, error to null, and on fulfillment, sets loading to false and wishlist to the payload.
     * - getWishlistByUserId.rejected: sets loading to false and error to the payload.
     * - addProductToWishlist.rejected: sets loading to false and error to the payload.
     */
    /*******  3bb7d232-6dca-4de3-b033-5dc731dee4bc  *******/
    extraReducers: (builder) => {
        builder
            // getWishlistByUserId
            .addCase(getWishlistByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlistByUserId.fulfilled, (state, action: PayloadAction<Wishlist>) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(getWishlistByUserId.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // addProductToWishlist
            .addCase(addProductToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductToWishlist.fulfilled, (state, action: PayloadAction<Wishlist>) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(addProductToWishlist.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;