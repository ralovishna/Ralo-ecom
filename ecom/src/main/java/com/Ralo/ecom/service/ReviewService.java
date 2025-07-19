package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.Review;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {
    Review createReview(
            CreateReviewRequest createReviewRequest,
            User user,
            Product product
    );

    List<Review> getReviewsByProductId(Long productId);

    Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;
}