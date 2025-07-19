package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.exception.coupon.CouponInactiveException;
import com.Ralo.ecom.exception.coupon.CouponMinimumAmountException;
import com.Ralo.ecom.exception.coupon.InvalidCouponException;
import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.Coupon;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.CartRepository;
import com.Ralo.ecom.repository.CouponRepository;
import com.Ralo.ecom.repository.UserRepository;
import com.Ralo.ecom.service.CartService;
import com.Ralo.ecom.service.CouponService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @Override
    public Cart applyCoupon(double orderAmount, User user, String code) throws Exception {
        System.out.println("\n\n\n\n\n\n\nApplying coupon with code: " + code + " for user: " + user.getFullName() + " and order amount: " + orderAmount);

        // Ensure usedCoupons is loaded if you still plan to use it for unique per-user usage on *completed* orders.
        // For current cart application, it's less relevant here.
        // Hibernate.initialize(user.getUsedCoupons());

        Coupon coupon = Optional.ofNullable(couponRepository.findByCode(code))
                .orElseThrow(() -> new InvalidCouponException("Invalid coupon code."));

        Cart cart = cartRepository.findByUserId(user.getId());

        // Validate coupon (min amount, active, etc.)
        validateCoupon(coupon, user, orderAmount); // Keep this validation

        // If a coupon is already applied, implicitly remove it before applying the new one
        if (cart.getCoupon() != null && !cart.getCoupon().equals(coupon)) {
            log.info("Replacing existing coupon {} with new coupon {}", cart.getCoupon().getCode(), coupon.getCode());
            cart.setCoupon(null); // Clear old coupon
            cartRepository.save(cart); // Persist the clearing before applying new one
            // Re-calculate cart to remove old coupon's effect before applying new one
            cartService.findUserCart(user); // This re-calculates without coupon
        }


        // --- IMPORTANT: Removed user.getUsedCoupons().add(coupon); ---
        // This should only happen when an order is successfully placed and the coupon is redeemed.

        // Link the new coupon to the cart
        cart.setCoupon(coupon);
        cartRepository.save(cart); // Save the cart with the new coupon linked

        // Now, re-calculate the entire cart using the CartService's findUserCart method
        // This ensures all totals (including coupon discount) are correctly calculated.
        Cart updatedCart = cartService.findUserCart(user);

        System.out.println("Successfully applied coupon with code: " + code);

        return updatedCart;
    }


    @Override
    public Cart removeCoupon(String code, User user) throws InvalidCouponException {
        // No need to initialize user.getUsedCoupons() here for cart removal
        // Hibernate.initialize(user.getUsedCoupons());

        // The 'code' parameter might be redundant if you always remove the currently applied coupon.
        // However, keeping it makes the API more explicit.
        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart.getCoupon() == null || !cart.getCoupon().getCode().equals(code)) {
            // No coupon applied or a different coupon is applied than the one being removed
            throw new InvalidCouponException("No coupon with code '" + code + "' is currently applied to your cart.");
        }

        // --- IMPORTANT: Removed user.getUsedCoupons().remove(coupon); ---
        // This should only happen if you want to 'un-redeem' a coupon from a completed order,
        // which is usually not the case.


        // Clear the coupon from the cart
        cart.setCoupon(null);
        cartRepository.save(cart); // Save the cart with no coupon linked

        // Now, re-calculate the entire cart using the CartService's findUserCart method
        Cart updatedCart = cartService.findUserCart(userRepository.findById(user.getId()).get());

        return updatedCart;
    }


    private void validateCoupon(Coupon coupon, User user, double orderAmount) throws Exception {
        // --- IMPORTANT: The check for 'user.getUsedCoupons().contains(coupon)' is removed here. ---
        // This check should happen at the ORDER PLACEMENT step, not at the cart application step.
        // If a coupon is single-use, you'd check `user.hasRedeemedCoupon(coupon)` when they finalize the order.

        // Initialize usedCoupons if you need to check specific unique-per-user coupons for other reasons
        // or if you re-introduce a different kind of "already used" logic for cart application.
        // Hibernate.initialize(user.getUsedCoupons());

        if (orderAmount < coupon.getMinAmount()) {
            throw new CouponMinimumAmountException("Order must be at least " + coupon.getMinAmount());
        }
        if (!coupon.isActive()
                || LocalDate.now().isBefore(coupon.getValidityStartDate())
                || LocalDate.now().isAfter(coupon.getValidityExpiryDate())) {
            throw new CouponInactiveException("Coupon is not active or has expired.");
        }
    }


    @Override
    public Coupon findCouponById(Long id) throws Exception {
        return couponRepository.findById(id)
                .orElseThrow(() -> new Exception("Coupon not found with id " + id));
    }


    @Override
    @PreAuthorize("hasRole('Admin')")
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    @PreAuthorize("hasRole('Admin')")
    public void deleteCoupon(Long id) throws Exception {
        findCouponById(id);
        couponRepository.deleteById(id);
    }

}