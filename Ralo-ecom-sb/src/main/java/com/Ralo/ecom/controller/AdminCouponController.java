package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.Coupon;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.service.CouponService;
import com.Ralo.ecom.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Validated
public class AdminCouponController {
    private final CouponService couponService;
    private final UserService userService;

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/apply")
    public ResponseEntity<Cart> applyCoupon(
            @RequestParam @NotBlank String code,
            @RequestParam double orderAmount,
            @RequestHeader("Authorization") String token) throws Exception {

        User user = userService.findUserByJwtToken(token);
        // The service method now returns the fully calculated Cart
        Cart cart = couponService.applyCoupon(orderAmount, user, code);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/remove")
    public ResponseEntity<Cart> removeCoupon(
            @RequestParam @NotBlank String code,
            @RequestHeader("Authorization") String token) throws Exception {

        User user = userService.findUserByJwtToken(token);
        // The service method now returns the fully calculated Cart
        Cart cart = couponService.removeCoupon(code, user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Coupon> createCoupon(@RequestBody @Valid Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) throws Exception {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}