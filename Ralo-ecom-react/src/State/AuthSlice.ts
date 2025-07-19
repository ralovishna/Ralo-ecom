import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api.ts";
import { User } from "../types/UserTypes.ts";
import { markSellerLoggedOut } from "./seller/sellerSlice.ts";

// ------------------- USER THUNKS -------------------

const sendLoginSignupOtp = createAsyncThunk(
    "/auth/sendLoginSignupOtp",
    async ({ email, role }: { email: string; role: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/sent/login-signup-otp", { email, role });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Something went wrong");
        }
    }
);


const signin = createAsyncThunk<any, any>(
    "/auth/signin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/signing`, loginRequest);
            const jwt = response.data.jwt;
            localStorage.setItem("jwt", jwt);
            return jwt;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to sign in");
        }
    }
);

const signup = createAsyncThunk<any, any>(
    "/auth/signup",
    async (signupRequest, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/signup`, signupRequest);
            const jwt = response.data.jwt;
            localStorage.setItem("jwt", jwt);
            return jwt;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to sign up");
        }
    }
);

const fetchUserProfile = createAsyncThunk(
    "/auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) return rejectWithValue("JWT not found");

        try {
            const response = await api.get(`/api/users/profile`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to fetch user profile");
        }
    }
);

// ------------------- SELLER THUNK -------------------

const sellerLogin = createAsyncThunk<any, any>(
    "/sellerAuth/sellerLogin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/sellers/login", loginRequest);
            const jwt = response.data.jwt;
            localStorage.setItem("jwt", jwt);
            return jwt;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to sign in as seller");
        }
    }
);

// ------------------- LOGOUT -------------------

const logout = createAsyncThunk(
    "/auth/logout",
    async ({ navigate }: { navigate: Function }, { dispatch, rejectWithValue }) => {
        try {
            localStorage.clear();
            dispatch(markSellerLoggedOut());
            navigate("/");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || "Failed to sign out");
        }
    }
);

// ------------------- STATE -------------------

interface AuthState {
    jwt: string | null;
    otpSent: boolean;
    isLoggedIn: boolean;
    isSellerLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    jwt: null,
    otpSent: false,
    isLoggedIn: false,
    isSellerLoggedIn: false,
    user: null,
    loading: false,
    error: null,
};

// ------------------- SLICE -------------------

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSellerLoggedIn: (state, action) => {
            state.isSellerLoggedIn = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            // User Login/Signup
            .addCase(signin.fulfilled, (state, action) => {
                state.jwt = action.payload;
                state.isLoggedIn = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.jwt = action.payload;
                state.isLoggedIn = true;
                state.error = null;
            })

            // Seller Login
            .addCase(sellerLogin.fulfilled, (state, action) => {
                state.jwt = action.payload;
                state.isSellerLoggedIn = true;
                state.error = null;
            })

            // OTP Handling
            .addCase(sendLoginSignupOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendLoginSignupOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendLoginSignupOtp.rejected, (state) => {
                state.loading = false;
                state.otpSent = false;
            })

            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.loading = false;
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.jwt = null;
                state.isLoggedIn = false;
                state.isSellerLoggedIn = false;
                state.user = null;
                state.error = null;
            });
    },
});

export const { setSellerLoggedIn } = authSlice.actions;
export {
    signin,
    signup,
    logout,
    sendLoginSignupOtp,
    fetchUserProfile,
    sellerLogin,
};
export default authSlice.reducer;
