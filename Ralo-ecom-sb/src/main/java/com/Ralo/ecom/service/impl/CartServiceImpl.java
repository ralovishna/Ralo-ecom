package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.*;
import com.Ralo.ecom.repository.CartItemRepository;
import com.Ralo.ecom.repository.CartRepository;
import com.Ralo.ecom.repository.CouponRepository;
import com.Ralo.ecom.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CouponRepository couponRepository;

    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {
        Cart cart = findOrCreateUserCart(user);

        CartItem existingCartItem = cartItemRepository.findByCartAndProductAndSize(cart, product, size);
        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            // ✅ store per-unit prices only
            existingCartItem.setMrpPrice((int) product.getMrpPrice());
            existingCartItem.setSellingPrice((int) product.getSellingPrice());
            return cartItemRepository.save(existingCartItem);
        }

        CartItem newCartItem = new CartItem();
        newCartItem.setCart(cart);
        newCartItem.setProduct(product);
        newCartItem.setQuantity(quantity);
        newCartItem.setUserId(user.getId());
        newCartItem.setSize(size);
        newCartItem.setMrpPrice((int) product.getMrpPrice());        // per unit
        newCartItem.setSellingPrice((int) product.getSellingPrice()); // per unit

        cart.getCartItems().add(newCartItem);
        return cartItemRepository.save(newCartItem);
    }


    //    @Override
//    public Cart findUserCart(User user) {
//        Cart cart = findOrCreateUserCart(user);
//
//        double totalMrp = 0;
//        double totalSelling = 0;
//        int totalQty = 0;
//
//        for (CartItem item : cart.getCartItems()) {
//            totalMrp += item.getMrpPrice() * item.getQuantity(); // ✅ correct now
//            totalSelling += item.getSellingPrice() * item.getQuantity(); // ✅ correct now
//            totalQty += item.getQuantity();
//        }
//        double productDiscountAmount = totalMrp - totalSelling;
//
//
//        cart.setTotalMrpPrice(totalMrp);
//        cart.setTotalSellingPrice(totalSelling);
//        cart.setTotalQuantity(totalQty);
//        cart.setTotalDiscount(calculateDiscountPercentage(totalMrp, totalSelling));
//        cart.setProductDiscountAmount(productDiscountAmount);
//
//        int couponDiscount = 0;
//        if (cart.getCoupon() != null) {
//            Coupon coupon = couponRepository.findByCode(cart.getCoupon().getCode());
//            if (coupon != null) {
//                couponDiscount = calculateCouponDiscount(coupon, totalSelling);
//            }
//        }
//        cart.setCouponDiscount(couponDiscount);
//
//
//
//        return cartRepository.save(cart);
//    }
//
    private Cart findOrCreateUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }
        return cart;
    }

    //
//    private int calculateCouponDiscount(Coupon coupon, double totalSellingPrice) {
//        if (coupon == null || !coupon.isActive()) return 0;
//
//        LocalDate today = LocalDate.now();
//        if (today.isBefore(coupon.getValidityStartDate()) || today.isAfter(coupon.getValidityExpiryDate()))
//            return 0;
//
//        if (totalSellingPrice < coupon.getMinAmount()) return 0;
//
//        return (int) (totalSellingPrice * (coupon.getDiscountPercent() / 100.0));
//    }
//
    private int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0 || sellingPrice < 0) return 0;
        return (int) ((mrpPrice - sellingPrice) * 100 / mrpPrice);
    }

    @Override
    public Cart findUserCart(User user) {
        Cart cart = findOrCreateUserCart(user);

        double totalMrp = 0;
        double totalSelling = 0;
        int totalQty = 0;

        for (CartItem item : cart.getCartItems()) {
            double itemMrp = item.getProduct().getMrpPrice();
            double itemSelling = item.getProduct().getSellingPrice();

            totalMrp += itemMrp * item.getQuantity();
            totalSelling += itemSelling * item.getQuantity();
            totalQty += item.getQuantity();
        }

        double productDiscountAmount = totalMrp - totalSelling;

        cart.setTotalMrpPrice(totalMrp);
        cart.setTotalSellingPrice(totalSelling); // ✅ pre-coupon total
        cart.setTotalQuantity(totalQty);
        cart.setProductDiscountAmount(productDiscountAmount);
        cart.setTotalDiscount(calculateDiscountPercentage(totalMrp, totalSelling));

        // Handle coupon discount
        int couponDiscount = 0;
        if (cart.getCoupon() != null && cart.getCoupon().getCode() != null && !cart.getCoupon().getCode().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(cart.getCoupon().getCode());
            if (coupon != null) {
                couponDiscount = calculateCouponDiscount(coupon, totalSelling);
            }
        }

        cart.setCouponDiscount(couponDiscount); // ✅ store it separately

        return cartRepository.save(cart); // ✅ frontend will calculate the final total
    }

    private int calculateCouponDiscount(Coupon coupon, double totalSellingPrice) {
        if (coupon == null || !coupon.isActive()) return 0;

        LocalDate today = LocalDate.now();
        if (today.isBefore(coupon.getValidityStartDate()) || today.isAfter(coupon.getValidityExpiryDate())) {
            return 0;
        }

        if (totalSellingPrice < coupon.getMinAmount()) return 0;

        return (int) (totalSellingPrice * (coupon.getDiscountPercent() / 100.0));
    }

}