package com.Ralo.ecom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStats {
    private long totalUsers;
    private long newUsers;
    private long totalSellers;
    private long pendingSellers;
    private long totalOrders;
    private long cancelledOrders;
    private double totalRevenue;
    private double averageOrderValue;
    private long totalProducts;
    private long lowStockProducts;
    private double totalDiscounts; // New: Sum of discounts applied
    private long pendingDeliveries; // New: Orders not yet delivered
    //    private List<CategoryStats> topCategories;
    private String timeframe; // New: Store timeframe (e.g., "month")

    public void setTimeframe(String timeframe) {
        this.timeframe = timeframe != null ? timeframe.toLowerCase() : "month";
    }

//    @Data
//    public static class CategoryStats {
//        private String name;
//        private double revenue;
//        private long orderCount;
//    }
}