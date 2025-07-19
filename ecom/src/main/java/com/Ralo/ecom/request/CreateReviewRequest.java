package com.Ralo.ecom.request;

import java.util.List;

@lombok.Data
public class CreateReviewRequest {
    private String reviewText;
    private double rating;
    private List<String> productImages;
}