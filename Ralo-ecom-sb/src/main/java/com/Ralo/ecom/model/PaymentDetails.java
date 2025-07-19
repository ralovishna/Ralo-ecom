package com.Ralo.ecom.model;

import com.Ralo.ecom.domain.PaymentStatus;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class PaymentDetails {
    private String paymentId;
    private String razorpayPaymentLinkId;
    private String razorpayPaymentLinkReferenceId;
    private String razorpayPaymentLinkStatus;
    private String razorpayPaymentIdZWSP;
    @Column(name = "payment_status_details")
    private PaymentStatus status;
    public PaymentDetails(String paymentId, String razorpayPaymentLinkId, String razorpayPaymentLinkReferenceId, String razorpayPaymentLinkStatus, String razorpayPaymentIdZWSP, PaymentStatus status) {
        this.paymentId = paymentId;
        this.razorpayPaymentLinkId = razorpayPaymentLinkId;
        this.razorpayPaymentLinkReferenceId = razorpayPaymentLinkReferenceId;
        this.razorpayPaymentLinkStatus = razorpayPaymentLinkStatus;
        this.razorpayPaymentIdZWSP = razorpayPaymentIdZWSP;
        this.status = status;
    }
    public PaymentDetails() {
        this.status = PaymentStatus.PENDING;
        this.paymentId = "";
        this.razorpayPaymentLinkId = "";
        this.razorpayPaymentLinkReferenceId = "";
        this.razorpayPaymentLinkStatus = "";
        this.razorpayPaymentIdZWSP = "";
    }
}