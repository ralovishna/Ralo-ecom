package com.Ralo.ecom.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User customer;

    @OneToOne
    private Order order;

    @ManyToOne
    private Seller seller;

    private String paymentId;          // ✅ Razorpay payment ID
    private String paymentLinkId;      // ✅ Razorpay payment link ID
    private Double amount;             // ✅ Total amount paid
    private LocalDateTime date = LocalDateTime.now();
}