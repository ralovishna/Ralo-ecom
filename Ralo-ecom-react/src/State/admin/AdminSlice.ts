import { Category } from './../../types/SellerTypes';
// import { HomeCategory } from './../../types/HomeCategoryTypes';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { HomeCategory } from "../../types/HomeCategoryTypes.ts"
import { api } from '../../config/Api.ts';
import { RootState } from '../Store.ts';
const API_URL = "/admin"

export const updateHomeCategory = createAsyncThunk<HomeCategory, { id: number, data: HomeCategory }, { rejectValue: string }>(
    "homeCategory/updateHomeCategory",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_URL}/home-category/${id}`, data);
            console.log("updated home category", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update home category');
        }
    }
);

export const fetchHomeCategories = createAsyncThunk<HomeCategory[]>(
    "homeCategory/fetchHomeCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/home-categories`);
            // console.log("Fetched home categories:", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch home categories');
        }
    }
);

// Selector to get categories by sectionexport const selectCategoriesBySection = (section: string, limit?: number) =>
export const selectCategoriesBySection = (section: string, limit?: number) =>
    (state: RootState) => {
        const categories = state.admin.categories;
        return categories
            .filter((cat) => cat.section === section)
            .slice(0, limit ?? categories.length);
    };



interface HomeCategoryState {
    categories: HomeCategory[];
    loading: boolean;
    error: string | null;
    categoryUpdated: boolean;
}

const initialState: HomeCategoryState = {
    categories: [],
    loading: false,
    error: null,
    categoryUpdated: false,
};

export const adminSlice = createSlice({
    name: "adminSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.categoryUpdated = false;
            })
            .addCase(fetchHomeCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchHomeCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch home categories";
            })
            .addCase(updateHomeCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.categoryUpdated = false;
            })
            .addCase(updateHomeCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categoryUpdated = true;
                const index = state.categories.findIndex((category) => category.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                } else {
                    state.categories.push(action.payload);
                }
            })
            .addCase(updateHomeCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update home category";
            });
    },
});

export default adminSlice.reducer