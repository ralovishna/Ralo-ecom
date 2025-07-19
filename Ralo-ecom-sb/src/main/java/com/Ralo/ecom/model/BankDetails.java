package com.Ralo.ecom.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Embeddable
@NoArgsConstructor
public class BankDetails {
    private String accountNumber;
    private String accountHolderName;
    private String ifscCode;
}