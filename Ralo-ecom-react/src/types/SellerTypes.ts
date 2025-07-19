export interface Seller {
    id: number;
    sellerName: string;
    email: string;
    accountStatus?: string;
    password: string;
    mobile: string;
    gstin: string;
    otp: string;
    pickupAddress: PickupAddress;
    bankDetails: BankDetails;
    businessDetails: BusinessDetails;
    address: string;
    city: string;
    role: string;
}

export interface PickupAddress {
    name: string;
    mobile: string;
    pinCode: string;
    address: string;
    locality: string;
    city: string;
    state: string;
}

export interface BankDetails {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

export interface BusinessDetails {
    businessName: string;
    businessEmail: string;
    businessMobile: string;
    businessAddress: string;
}

export interface SellerReport {
    id: number;
    seller: Seller;
    totalEarnings: number;
    totalOrders: number;
    totalSales: number;
    totalRefunds: number;
    totalTax: number;
    netEarnings: number;
    cancelledOrders: number;
    totalTransactions: number;
}

export interface Category {
    id?: number;
    name: string;
    categoryId: string;
    parentCategoryId?: Category;
    level: number;
}