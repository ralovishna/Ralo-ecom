package com.Ralo.ecom.request;

import lombok.Data;

@Data
public class AddItemRequest {
    private Long productId;
    private int quantity;
    private String size;
}