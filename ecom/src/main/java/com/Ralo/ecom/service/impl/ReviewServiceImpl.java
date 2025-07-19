package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.Review;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.ReviewRepository;
import com.Ralo.ecom.request.CreateReviewRequest;
import com.Ralo.ecom.service.ProductService;
import com.Ralo.ecom.service.ReviewService;
import com.Ralo.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ProductService productService;

    @Override
    public Review createReview(CreateReviewRequest createReviewRequest, User user, Product product) {
        Review review = new Review();
        review.setRating(createReviewRequest.getRating());
        review.setReviewText(createReviewRequest.getReviewText());
        review.setProduct(product);
        review.setUser(user);
        review.setProductImages(createReviewRequest.getProductImages());

        product.getReviews().add(review);

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review = getReviewById(reviewId);

        if (review.getUser().getId().equals(userId)) {
            review.setReviewText(reviewText);
            review.setRating(rating);

            return reviewRepository.save(review);
        }
        throw new Exception("You are not authorized to update this review");
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);

        if (review.getUser().getId().equals(userId)) {
            throw new Exception("You are not authorized to delete this review");
        }
        reviewRepository.delete(review);
    }

    @Override
    public Review getReviewById(Long reviewId) throws Exception {
        return reviewRepository.findById(reviewId).orElseThrow(() -> new Exception("Review not found with id " + reviewId));
    }
}