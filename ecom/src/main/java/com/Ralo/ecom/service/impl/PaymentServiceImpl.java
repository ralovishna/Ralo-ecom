package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.PaymentOrderStatus;
import com.Ralo.ecom.domain.PaymentStatus;
import com.Ralo.ecom.model.Order;
import com.Ralo.ecom.model.PaymentOrder;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.OrderRepository;
import com.Ralo.ecom.repository.PaymentOrderRepository;
import com.Ralo.ecom.service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.Set;


@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderRepository orderRepository;
    private final String apiKey = ${RAZORPAY_KEY_ID};
    private final String secretKey = ${RAZORPAY_KEY_SECRET};

    private static @NotNull JSONObject getJsonObject(User user, Long amount, Long orderId) {
        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amount);
        paymentLinkRequest.put("currency", "INR");

        JSONObject customer = new JSONObject();
        customer.put("name", user.getFullName());
        customer.put("email", user.getEmail());
        paymentLinkRequest.put("customer", customer);

        JSONObject notify = new JSONObject();
        notify.put("email", true);
        paymentLinkRequest.put("notify", notify);

        paymentLinkRequest.put("reference_id", String.valueOf(orderId));
        paymentLinkRequest.put("callback_url", "http://localhost:3000/payment-success");
        paymentLinkRequest.put("callback_method", "get");
//        paymentLinkRequest.put("redirect", true);
        return paymentLinkRequest;
    }

    @Override
    public PaymentOrder createOrder(User user, Set<Order> orders) {
        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();

        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setAmount(amount);
        paymentOrder.setOrders(orders);
        paymentOrder.setUser(user);

        return paymentOrderRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentOrderRepository.findById(id).orElseThrow(() -> new Exception("Payment order not found with id " + id));
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentLinkId(String paymentLinkId) {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentLinkId);

        if (paymentOrder == null) {
            throw new RuntimeException("Payment order not found with payment link id " + paymentLinkId);
        }
        return paymentOrder;
    }

    @Override
    public boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException {
        if (paymentOrder.getStatus() == PaymentOrderStatus.SUCCESS) {
            return true; // already processed
        }
        if (paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)) {
            RazorpayClient razorpayClient = new RazorpayClient(apiKey, secretKey);

            Payment payment = razorpayClient.payments.fetch(paymentId);

            String status = payment.get("status");
            if (status.equals("captured")) {
                Set<Order> orders = paymentOrder.getOrders();
                for (Order order : orders) {
                    order.setPaymentStatus(PaymentStatus.COMPLETED);
                    orderRepository.save(order);
                }
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
        }
        return false;
    }

    @Override
    public PaymentLink createRazorPaymentLink(User user, Long amount, Long orderId) throws RazorpayException {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Invalid amount passed to Razorpay: " + amount);
        }

        amount = amount * 100;

        try {
            RazorpayClient razorpayClient = new RazorpayClient(apiKey, secretKey);

            JSONObject paymentLinkRequest = getJsonObject(user, amount, orderId);

            PaymentLink paymentLink = razorpayClient.paymentLink.create(paymentLinkRequest);

            String paymentLinkUrl = paymentLink.get("short_url");
            String paymentLinkId = paymentLink.get("id");

            return paymentLink;
        } catch (RazorpayException e) {
            System.out.println(e.getMessage());
            throw new RazorpayException(e.getMessage());
        }
    }

    @Override
    public String createStripePaymentLink(User user, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey = "";

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/payment-success/" + orderId)
                .setCancelUrl("http://localhost:3000/payment-cancel/")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Ecommerce Payment")
                                                                .build()
                                                )
                                                .setUnitAmount(amount * 100)
                                                .build()
                                )
                                .setQuantity(1L)
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }
}
