// store.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Seller slices
import sellerReducer from './seller/sellerSlice.ts';
import sellerProductReducer from './seller/sellerProductSlice.ts';
import sellerOrderReducer from './seller/sellerOrderSlice.ts';
import transactionReducer from './seller/transactionSlice.ts';

// Customer slices
import productReducer from './customer/ProductSlice.ts';
import orderReducer from './customer/OrderSlice.ts';
import cartReducer from './customer/CartSlice.ts';
import wishlistReducer from './customer/WishlistSlice.ts';
import customerReducer from './customer/CustomerSlice.ts';
import reviewReducer from './customer/ReviewSlice.ts';
import addressReducer from './customer/AddressSlice.ts';

// Auth & Admin
import authReducer from './AuthSlice.ts';
import adminReducer from './admin/AdminSlice.ts';
import dealReducer from './admin/DealSlice.ts';
import couponAdminReducer from './admin/CouponSlice.ts';
import couponCustomerReducer from './customer/CouponSlice.ts';
import adminSellerReducer from './admin/ASellerSlice.ts';
import adminStatReducer from './admin/AdminStatSlice.ts';


const rootReducer = combineReducers({
  seller: sellerReducer,
  sellerProduct: sellerProductReducer,
  sellerOrder: sellerOrderReducer,
  transactions: transactionReducer,

  product: productReducer,
  order: orderReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  customer: customerReducer, // ✅ use correct reducer
  auth: authReducer,
  couponCustomer: couponCustomerReducer,
  address: addressReducer,
  review: reviewReducer,

  admin: adminReducer,
  deals: dealReducer,
  couponAdmin: couponAdminReducer,
  adminSellers: adminSellerReducer,
  adminStat: adminStatReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Types
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
