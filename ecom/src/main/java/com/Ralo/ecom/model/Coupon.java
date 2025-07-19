package com.Ralo.ecom.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "coupon", indexes = @Index(name = "idx_coupon_code", columnList = "code", unique = true))
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Coupon code is required")
    @Size(min = 5, max = 20, message = "Coupon code must be between 5-20 characters")
    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @DecimalMin(value = "0.1", message = "Discount must be at least 0.1%")
    @DecimalMax(value = "100.0", message = "Discount cannot exceed 100%")
    @Column(nullable = false)
    private double discountPercent;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    @Column(nullable = false)
    private LocalDate validityStartDate;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    @Column(nullable = false)
    private LocalDate validityExpiryDate;

    @DecimalMin(value = "0.0", message = "Minimum amount cannot be negative")
    @Column(nullable = false)
    private double minAmount;

    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToMany(mappedBy = "usedCoupons", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> users = new HashSet<>();
}