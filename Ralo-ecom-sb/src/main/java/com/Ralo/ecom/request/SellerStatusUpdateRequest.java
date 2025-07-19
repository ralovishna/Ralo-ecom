package com.Ralo.ecom.request;

import com.Ralo.ecom.domain.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SellerStatusUpdateRequest {
    @NotNull
    private AccountStatus status;
}