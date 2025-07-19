package com.Ralo.ecom.controller;

import com.Ralo.ecom.domain.PaymentMethod;
import com.Ralo.ecom.model.*;
import com.Ralo.ecom.repository.PaymentOrderRepository;
import com.Ralo.ecom.response.PaymentLinkResponse;
import com.Ralo.ecom.service.*;
import com.razorpay.PaymentLink;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@lombok.RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final CartService cartService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;

    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
            @RequestHeader("Authorization") String token,
            @RequestBody Address shippingAddress,
            @RequestParam PaymentMethod paymentMethod
    ) throws Exception {

        User user = userService.findUserByJwtToken(token);
        Cart cart = cartService.findUserCart(user);
        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);

        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);
        PaymentLinkResponse paymentLinkResponse = new PaymentLinkResponse();

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            PaymentLink paymentLink = paymentService.createRazorPaymentLink(user, paymentOrder.getAmount(), paymentOrder.getId());
            String paymentUrl = paymentLink.get("short_url");
            String paymentId = paymentLink.get("id");

            paymentLinkResponse.setPayment_link_url(paymentUrl);

            paymentOrder.setPaymentLinkId(paymentId);
            paymentOrderRepository.save(paymentOrder);
        } else {
            String paymentUrl = paymentService.createStripePaymentLink(user, paymentOrder.getAmount(), paymentOrder.getId());
            paymentLinkResponse.setPayment_link_url(paymentUrl);
        }

        return new ResponseEntity<>(paymentLinkResponse, HttpStatus.OK);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrderHandler(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId
    ) throws Exception {

        User user = userService.findUserByJwtToken(token);
        Order order = orderService.CancelOrder(orderId, user);

        Seller seller = sellerService.getSellerById(order.getSellerId());
        SellerReport sellerReport = sellerReportService.getSellerReport(seller);

        sellerReport.setCancelledOrders(sellerReport.getCancelledOrders() + 1);
        sellerReport.setTotalRefunds(sellerReport.getTotalRefunds() + order.getTotalSellingPrice());
        sellerReportService.updateSellerReport(sellerReport);

        return new ResponseEntity<>(order, HttpStatus.ACCEPTED);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistoryHandler(
            @RequestHeader("Authorization") String token
    ) throws Exception {

        User user = userService.findUserByJwtToken(token);
        List<Order> orders = orderService.userOrderHistory(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderByIdHandler(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId
    ) throws Exception {

        User user = userService.findUserByJwtToken(token);
        Order order = orderService.findOrderById(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemByIdHandler(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderItemId
    ) throws Exception {

        User user = userService.findUserByJwtToken(token);
        OrderItem orderItem = orderService.getOrderItemById(orderItemId);
        return new ResponseEntity<>(orderItem, HttpStatus.ACCEPTED);
    }


}