import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeCategory, HomeData } from "../../types/HomeCategoryTypes";
import { api } from "../../config/Api.ts";

interface HomeState {
    homePageData: HomeData | null;
    homeCategories?: HomeCategory[];
    loading: boolean;
    error: string | null;
}

const initialState: HomeState = {
    homePageData: null,
    homeCategories: [],
    loading: false,
    error: null,
};

export const createHomeCategories = createAsyncThunk<HomeData, HomeCategory[], { rejectValue: string }>(
    "home/createHomeCategories",
    async (HomeCategories, { rejectWithValue }) => {
        console.log("categories:", HomeCategories);

        try {
            const response = await api.post("/home/categories", HomeCategories);
            console.log("Creating home categories:", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create home categories');
        }
    }
);

export const customerSlice = createSlice({
    name: "customerSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createHomeCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHomeCategories.fulfilled, (state, action: PayloadAction<HomeData>) => {
                state.homePageData = action.payload;
                state.loading = false;
            })
            .addCase(createHomeCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create home categories";
            });
    }
});

export default customerSlice.reducer;
