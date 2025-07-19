package com.Ralo.ecom.controller;

import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.domain.PaymentStatus;
import com.Ralo.ecom.model.*;
import com.Ralo.ecom.response.ApiResponse;
import com.Ralo.ecom.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final OrderService orderService;
    private final TransactionService transactionService;


    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse> paymentSuccessHandler(
            @RequestHeader("Authorization") String token,
            @RequestParam String paymentLinkId,
            @PathVariable String paymentId
    ) throws Exception {

        User user = userService.findUserByJwtToken(token);
//        PaymentLinkResponse paymentLinkResponse;

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);


        boolean proceedPaymentOrder = paymentService.proceedPaymentOrder(paymentOrder, paymentId, paymentLinkId);

        if (proceedPaymentOrder) {
            for (Order order : paymentOrder.getOrders()) {
                transactionService.createTransaction(order, paymentId, paymentLinkId);
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                order.setStatus(OrderStatus.PLACED);
                order.setPaymentDetails(new PaymentDetails(paymentId, paymentLinkId, paymentLinkId, "LIVE", paymentId, PaymentStatus.COMPLETED));
                Seller seller = sellerService.getSellerById(order.getSellerId());
                SellerReport sellerReport = sellerReportService.getSellerReport(seller);
                sellerReport.setTotalOrders(sellerReport.getTotalOrders() + 1);
                sellerReport.setTotalEarnings(sellerReport.getTotalEarnings() + order.getTotalSellingPrice());
                sellerReport.setTotalSales(sellerReport.getTotalSales() + order.getOrderItems().size());
                sellerReportService.updateSellerReport(sellerReport);
            }
        }
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Payment successful");

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }
}