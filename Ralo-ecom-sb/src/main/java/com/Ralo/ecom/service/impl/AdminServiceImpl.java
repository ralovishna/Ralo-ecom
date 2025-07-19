package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.domain.PaymentStatus;
import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.model.AdminDashboardStats;
import com.Ralo.ecom.repository.*;
import com.Ralo.ecom.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    public AdminDashboardStats getAdminDashboardStats(String timeframe, String startDate, String endDate) {
        AdminDashboardStats stats = new AdminDashboardStats();
        LocalDateTime start = parseStartDate(timeframe, startDate);
        LocalDateTime end = parseEndDate(timeframe, endDate);

        // Users
        stats.setTotalUsers(userRepository.countByRole(USER_ROLE.valueOf("ROLE_CUSTOMER")));
        stats.setNewUsers(userRepository.countByRoleAndCreatedAtBetween(USER_ROLE.valueOf("ROLE_CUSTOMER"), start, end));

        // Sellers
        stats.setTotalSellers(sellerRepository.count());
        stats.setPendingSellers(sellerRepository.countByAccountStatus(AccountStatus.valueOf("PENDING_VERIFICATION")));

        // Orders
        stats.setTotalOrders(orderRepository.countByOrderDateBetween(start, end));
        stats.setCancelledOrders(orderRepository.countByStatusAndOrderDateBetween(OrderStatus.valueOf("CANCELLED"), start, end));
        stats.setTotalRevenue(orderRepository.sumTotalSellingPriceByPaymentStatusAndOrderDateBetween(PaymentStatus.valueOf("COMPLETED"), start, end));
        stats.setAverageOrderValue(stats.getTotalRevenue() / Math.max(1, stats.getTotalOrders()));
        stats.setTotalDiscounts(orderRepository.sumDiscountByOrderDateBetween(start, end));
        stats.setPendingDeliveries(orderRepository.countByDeliveryDateAfterAndStatusNot(LocalDateTime.now(), OrderStatus.valueOf("CANCELLED")));

        // Products
        stats.setTotalProducts(productRepository.count());
        stats.setLowStockProducts(productRepository.countByQuantityLessThan(10));

        // Top Categories
//        List<AdminDashboardStats.CategoryStats> topCategories = categoryRepository.findTopCategoriesByRevenue(start, end, 2);
//        stats.setTopCategories(topCategories);

        stats.setTimeframe(timeframe);
        return stats;
    }

    private LocalDateTime parseStartDate(String timeframe, String startDate) {
        if (startDate != null) return LocalDate.parse(startDate).atStartOfDay();
        return switch (timeframe.toLowerCase()) {
            case "month" -> LocalDate.now().withDayOfMonth(1).atStartOfDay();
            case "year" -> LocalDate.now().withDayOfYear(1).atStartOfDay();
            default -> LocalDate.of(2000, 1, 1).atStartOfDay();
        };
    }

    private LocalDateTime parseEndDate(String timeframe, String endDate) {
        if (endDate != null) return LocalDate.parse(endDate).atTime(23, 59, 59);
        return LocalDateTime.now();
    }

}