// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { api } from "../config/Api.ts";
// import { User } from "../types/UserTypes.ts";

// const sendLoginSignupOtp = createAsyncThunk(
//     "/auth/sendLoginSignupOtp",
//     async ({ email }: { email: string }, { rejectWithValue }) => {
//         try {
//             const response = await api.post("/auth/sent/login-signup-otp", { email });

//             console.log("login otp ", response);
//             return response.data; // make sure to return something
//         } catch (error: any) {
//             console.error("Error sending OTP:", error);
//             return rejectWithValue(error?.response?.data || "Something went wrong");
//         }
//     }
// );


// const signin = createAsyncThunk<any, any>(
//     "/auth/signin",
//     async (loginRequest, { rejectWithValue }) => {
//         try {
//             const response = await api.post(`/auth/signing`, loginRequest);
//             console.log("signin", response.data);
//             localStorage.setItem("jwt", response.data.jwt);
//             return response.data.jwt;
//         } catch (error: any) {
//             return rejectWithValue(error?.response?.data || "Failed to sign in");
//         }
//     }
// );

// const signup = createAsyncThunk<any, any>(
//     "/auth/signup",
//     async (signupRequest, { rejectWithValue }) => {
//         try {
//             const response = await api.post(`/auth/signup`, signupRequest);
//             console.log("signup", response.data);
//             localStorage.setItem("jwt", response.data.jwt);
//             return response.data.jwt;
//         } catch (error: any) {
//             return rejectWithValue(error?.response?.data || "Failed to sign up");
//         }
//     }
// );

// const fetchUserProfile = createAsyncThunk<any, any>(
//     "/auth/fetchUserProfile",
//     async ({ jwt }, { rejectWithValue }) => {
//         console.log("is fetching jwt", jwt);

//         try {
//             const response = await api.get(`/api/users/profile`, {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//             });
//             console.log("user profile", response.data);
//             return response.data; // ✅ Return full user object
//         } catch (error: any) {
//             console.error("Error fetching user profile", error?.response?.data || error);
//             return rejectWithValue(error?.response?.data || "Failed to fetch user profile");
//         }
//     }
// );

// const logout = createAsyncThunk<any, any>(
//     "/auth/logout",
//     async (navigate, { rejectWithValue }) => {
//         try {
//             localStorage.clear()
//             navigate("/");
//             console.log("logout");
//         } catch (error: any) {
//             return rejectWithValue(error?.response?.data || "Failed to sign in");
//         }
//     }
// );

// interface AuthState {
//     jwt: string | null;
//     otpSent: boolean;
//     isLoggedIn: boolean;
//     user: User | null;
//     loading: boolean
// }

// const initialState: AuthState = {
//     jwt: null,
//     otpSent: false,
//     isLoggedIn: false,
//     user: null,
//     loading: false,
// }

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(signin.fulfilled, (state, action) => {
//                 state.jwt = action.payload;
//                 state.isLoggedIn = true;
//             })
//             .addCase(signup.fulfilled, (state, action) => {
//                 state.jwt = action.payload;
//                 state.isLoggedIn = true;
//             })
//             .addCase(fetchUserProfile.fulfilled, (state, action) => {
//                 state.user = action.payload;
//                 state.isLoggedIn = true;
//             })
//             .addCase(sendLoginSignupOtp.fulfilled, (state) => {
//                 state.loading = false;
//                 state.otpSent = true;
//             })
//             .addCase(sendLoginSignupOtp.pending, (state) => {
//                 state.loading = true;
//             })

//             .addCase(sendLoginSignupOtp.rejected, (state) => {
//                 state.loading = false;
//             })
//             .addCase(logout.fulfilled, (state) => {
//                 state.jwt = null;
//                 state.isLoggedIn = false;
//                 state.user = null;
//             })
//     }
// })

// export default authSlice.reducer

// export { sendLoginSignupOtp, signin, signup, logout, fetchUserProfile }