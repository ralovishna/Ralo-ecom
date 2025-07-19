package com.Ralo.ecom.service;

import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.model.*;

import java.util.List;
import java.util.Set;

public interface OrderService {
    Set<Order> createOrder(User user, Address shippingAddress, Cart cart);

    Order findOrderById(Long id) throws Exception;

    List<Order> userOrderHistory(Long userId);

    List<Order> getSellersOrder(Long sellerId);

    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;

    Order CancelOrder(Long orderId, User user) throws Exception;

    OrderItem getOrderItemById(Long id) throws Exception;
}