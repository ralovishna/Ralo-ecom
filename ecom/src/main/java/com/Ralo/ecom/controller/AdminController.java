package com.Ralo.ecom.controller;

import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.model.AdminDashboardStats;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.OrderRepository;
import com.Ralo.ecom.service.AdminService;
import com.Ralo.ecom.service.SellerService;
import com.Ralo.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {
    private final SellerService sellerService;
    private final AdminService adminService;
    private final UserService userService;
    private final OrderRepository orderRepository;


    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AdminDashboardStats> getDashboardStats(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "timeframe", defaultValue = "month") String timeframe,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate
    ) throws Exception {
        User user = userService.findUserByJwtToken(token);
        AdminDashboardStats stats = adminService.getAdminDashboardStats(timeframe, startDate, endDate);
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status
    ) throws Exception {
        return new ResponseEntity<>(sellerService.updateSellerAccountStatus(id, status), HttpStatus.OK);
    }

    @GetMapping("/dashboard/trends")
    public ResponseEntity<TrendStats> getTrendStats(
            @RequestHeader("Authorization") String token,
            @RequestParam("timeframe") String timeframe,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();
        int periods = timeframe.equals("year") ? 12 : 6; // 12 months for year, 6 for month

        if (timeframe.equals("custom") && startDate != null && endDate != null) {
            start = LocalDateTime.parse(startDate);
            end = LocalDateTime.parse(endDate);
        } else {
            start = end.minusMonths(periods - 1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        }

        List<String> labels = new ArrayList<>();
        List<Double> revenue = new ArrayList<>();
        List<Long> orders = new ArrayList<>();

        for (int i = 0; i < periods; i++) {
            YearMonth month = YearMonth.from(start.plusMonths(i));
            LocalDateTime monthStart = month.atDay(1).atStartOfDay();
            LocalDateTime monthEnd = month.atEndOfMonth().atTime(23, 59, 59);

            labels.add(month.toString()); // e.g., "2025-01"
            Double monthRevenue = orderRepository.sumTotalSellingPriceByOrderDateBetweenAndStatusNot(
                    monthStart, monthEnd, OrderStatus.valueOf("CANCELLED"));
            Long monthOrders = orderRepository.countByOrderDateBetweenAndStatusNot(
                    monthStart, monthEnd, OrderStatus.valueOf("CANCELLED"));

            revenue.add(monthRevenue != null ? monthRevenue : 0.0);
            orders.add(monthOrders != null ? monthOrders : 0L);
        }

        TrendStats trends = new TrendStats(labels, revenue, orders);
        return ResponseEntity.ok(trends);
    }

    public static class TrendStats {
        private List<String> labels;
        private List<Double> revenue;
        private List<Long> orders;

        public TrendStats(List<String> labels, List<Double> revenue, List<Long> orders) {
            this.labels = labels;
            this.revenue = revenue;
            this.orders = orders;
        }

        // Getters and setters
        public List<String> getLabels() {
            return labels;
        }

        public void setLabels(List<String> labels) {
            this.labels = labels;
        }

        public List<Double> getRevenue() {
            return revenue;
        }

        public void setRevenue(List<Double> revenue) {
            this.revenue = revenue;
        }

        public List<Long> getOrders() {
            return orders;
        }

        public void setOrders(List<Long> orders) {
            this.orders = orders;
        }
    }
}