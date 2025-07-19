import { Cart } from "./CartTypes.ts";

export interface Coupon {
    id: number;
    code: string;
    discountPercentage: number;
    validityStartDate: string;
    validityEndDate: string;
    minimumOrderValue: number;
    active: boolean;
}

// types/CouponTypes.ts
export interface CreateCouponDTO {
    code: string;
    description: string;
    discountPercent: number;
    validityStartDate: string; // format: YYYY-MM-DD
    validityExpiryDate: string; // format: YYYY-MM-DD
    minAmount: number;
    isActive: boolean;
}

export interface CouponState {
    coupons: Coupon[];
    cart: Cart | null;
    couponApplied: boolean;
    couponCreated: boolean;
    loading: boolean;
    error: string | null;
}