package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Review;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.request.CreateReviewRequest;
import com.Ralo.ecom.response.ApiResponse;
import com.Ralo.ecom.service.ProductService;
import com.Ralo.ecom.service.ReviewService;
import com.Ralo.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@org.springframework.web.bind.annotation.RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(
            @PathVariable Long productId,
            @org.springframework.web.bind.annotation.RequestBody CreateReviewRequest request,
            @org.springframework.web.bind.annotation.RequestHeader("Authorization") String token
    ) throws Exception {
        User user = userService.findUserByJwtToken(token);
        Review review = reviewService.createReview(request, user, productService.findProductById(productId));
        return ResponseEntity.ok(review);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @org.springframework.web.bind.annotation.RequestBody CreateReviewRequest request,
            @org.springframework.web.bind.annotation.RequestHeader("Authorization") String token
    ) throws Exception {
        User user = userService.findUserByJwtToken(token);
        Review review = reviewService.updateReview(reviewId, request.getReviewText(), request.getRating(), user.getId());
        return ResponseEntity.ok(review);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId, @org.springframework.web.bind.annotation.RequestHeader("Authorization") String token) throws Exception {
        User user = userService.findUserByJwtToken(token);
        reviewService.deleteReview(reviewId, user.getId());

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Review deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}