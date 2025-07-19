package com.Ralo.ecom.controller;

import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.model.Order;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.service.OrderService;
import com.Ralo.ecom.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {
    private final OrderService orderService;
    private final SellerService sellerService;

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersHandler(
            @RequestHeader("Authorization") String token
    ) throws Exception {
        Seller seller = sellerService.getSellerProfile(token);
        List<Order> orders = orderService.getSellersOrder(seller.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<Order> updateOrderStatusHandler(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus
    ) throws Exception {
        Order order = orderService.updateOrderStatus(orderId, orderStatus);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}