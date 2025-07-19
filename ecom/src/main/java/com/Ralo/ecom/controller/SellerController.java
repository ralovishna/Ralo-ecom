package com.Ralo.ecom.controller;

import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.exception.SellerException;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.repository.OrderRepository;
import com.Ralo.ecom.repository.ProductRepository;
import com.Ralo.ecom.repository.VerificationCodeRepository;
import com.Ralo.ecom.request.LoginRequest;
import com.Ralo.ecom.request.SellerStatusUpdateRequest;
import com.Ralo.ecom.response.AuthResponse;
import com.Ralo.ecom.service.AuthService;
import com.Ralo.ecom.service.EmailService;
import com.Ralo.ecom.service.SellerService;
import com.Ralo.ecom.util.OtpUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/sellers")
@RequiredArgsConstructor
public class SellerController {
    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final AuthService authService;
    private final EmailService emailService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;

    // Existing endpoints (unchanged)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(@RequestBody LoginRequest request) throws Exception {
        request.setEmail("seller_" + request.getEmail());
        AuthResponse authResponse = authService.siginUser(request);
        return ResponseEntity.ok(authResponse);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(@PathVariable String otp) throws Exception {
        System.out.println("Received OTP: " + otp);
        Seller seller = sellerService.verifyEmail(otp);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws Exception {
        Seller savedSeller = sellerService.createSeller(seller);
        String otp = OtpUtil.generateOtp();
        sellerService.createVerificationCode(savedSeller.getEmail(), otp);
        System.out.println("\n\n\nSemt?" + seller.getEmail());
        String frontend_url = "http://localhost:3000/verify-seller/" + otp;
        String message = "Welcome to Ralo Ecom, verify your account using this link: " + frontend_url;
        authService.sendVerificationOtpEmail(seller.getEmail(), otp, "Email Verification for Ralo Ecom", message);
//        sellerService.updateSellerEmailVerification(seller.getId(), true);
        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
        return ResponseEntity.ok(sellerService.getSellerById(id));
    }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerProfile(@RequestHeader("Authorization") String token) throws Exception {
        return ResponseEntity.ok(sellerService.getSellerProfile(token));
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(@RequestParam(required = false) AccountStatus status) {
        System.out.println("\n\n\n\n\n\nStatus: " + status);
        if (status == null) {
            status = AccountStatus.ACTIVE;
        }
        System.out.println("\n\n\n\n\n\nStatus: " + status);
        return ResponseEntity.ok(sellerService.getAllSellers(status));
    }

    @PatchMapping
    public ResponseEntity<Seller> updateSeller(@RequestHeader("Authorization") String token, @RequestBody Seller seller) throws Exception {
        return new ResponseEntity<>(sellerService.updateSeller(token, seller), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {
        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestBody SellerStatusUpdateRequest request) throws Exception {
        System.out.println("\n\n\n\n\n\nStatus: " + request.getStatus());
        sellerService.updateSellerStatus(id, request.getStatus());
        return ResponseEntity.ok().build();
    }

    // New endpoints for Seller Dashboard
    @GetMapping("/dashboard/stats")
    public ResponseEntity<SellerDashboardStats> getSellerDashboardStats(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "month") String timeframe,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) throws Exception {
        Seller seller = sellerService.getSellerProfile(token);
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();
        if ("custom".equals(timeframe) && startDate != null && endDate != null) {
            start = LocalDateTime.parse(startDate);
            end = LocalDateTime.parse(endDate);
        } else {
            start = "year".equals(timeframe) ? end.minusYears(1) : end.minusMonths(1);
        }

        Double totalRevenue = orderRepository.sumTotalSellingPriceBySellerIdAndOrderDateBetweenAndStatusNot(
                seller.getId(), start, end, OrderStatus.CANCELLED);
        Long totalOrders = orderRepository.countBySellerIdAndOrderDateBetweenAndStatusNot(
                seller.getId(), start, end, OrderStatus.CANCELLED);
        Long activeProducts = productRepository.countBySellerAndStockGreaterThan(seller.getId(), 0);
        Double averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;
        Long pendingOrders = orderRepository.countBySellerIdAndStatus(seller.getId(), OrderStatus.PENDING);
        Long cancelledOrders = orderRepository.countBySellerIdAndStatus(seller.getId(), OrderStatus.CANCELLED);
        Long completedOrders = orderRepository.countBySellerIdAndStatus(seller.getId(), OrderStatus.DELIVERED);

        SellerDashboardStats stats = new SellerDashboardStats(
                totalRevenue, totalOrders, activeProducts, averageOrderValue,
                pendingOrders, cancelledOrders, completedOrders, timeframe);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard/trends")
    public ResponseEntity<TrendStats> getSellerDashboardTrends(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "month") String timeframe,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) throws Exception {
        Seller seller = sellerService.getSellerProfile(token);
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();
        int periods = "year".equals(timeframe) ? 12 : 6;

        if ("custom".equals(timeframe) && startDate != null && endDate != null) {
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

            labels.add(month.toString());
            Double monthRevenue = orderRepository.sumTotalSellingPriceBySellerIdAndOrderDateBetweenAndStatusNot(
                    seller.getId(), monthStart, monthEnd, OrderStatus.CANCELLED);
            Long monthOrders = orderRepository.countBySellerIdAndOrderDateBetweenAndStatusNot(
                    seller.getId(), monthStart, monthEnd, OrderStatus.CANCELLED);

            revenue.add(monthRevenue);
            orders.add(monthOrders);
        }

        TrendStats trends = new TrendStats(labels, revenue, orders);
        return ResponseEntity.ok(trends);
    }

    @Getter
    public static class SellerDashboardStats {
        // Getters
        private final Double totalRevenue;
        private final Long totalOrders;
        private final Long activeProducts;
        private final Double averageOrderValue;
        private final Long pendingOrders;
        private final Long cancelledOrders;
        private final Long completedOrders;
        private final String timeframe;

        public SellerDashboardStats(Double totalRevenue, Long totalOrders, Long activeProducts, Double averageOrderValue,
                                    Long pendingOrders, Long cancelledOrders, Long completedOrders, String timeframe) {
            this.totalRevenue = totalRevenue;
            this.totalOrders = totalOrders;
            this.activeProducts = activeProducts;
            this.averageOrderValue = averageOrderValue;
            this.pendingOrders = pendingOrders;
            this.cancelledOrders = cancelledOrders;
            this.completedOrders = completedOrders;
            this.timeframe = timeframe;
        }

    }

    @Getter
    public static class TrendStats {
        // Getters
        private final List<String> labels;
        private final List<Double> revenue;
        private final List<Long> orders;

        public TrendStats(List<String> labels, List<Double> revenue, List<Long> orders) {
            this.labels = labels;
            this.revenue = revenue;
            this.orders = orders;
        }

    }
}