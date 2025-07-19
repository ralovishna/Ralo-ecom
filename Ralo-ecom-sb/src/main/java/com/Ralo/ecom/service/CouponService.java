package com.Ralo.ecom.service;

import com.Ralo.ecom.exception.coupon.CouponNotFoundException;
import com.Ralo.ecom.exception.coupon.InvalidCouponException;
import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.Coupon;
import com.Ralo.ecom.model.User;

import java.util.List;

public interface CouponService {
    Cart applyCoupon(double orderAmount, User user, String couponCode) throws Exception;

    Cart removeCoupon(String couponCode, User user) throws InvalidCouponException, CouponNotFoundException;

    Coupon findCouponById(Long id) throws Exception;

    Coupon createCoupon(Coupon coupon);

    List<Coupon> getAllCoupons();

    void deleteCoupon(Long id) throws Exception;
}