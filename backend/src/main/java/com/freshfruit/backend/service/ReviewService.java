package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Product;
import com.freshfruit.backend.domain.Review;
import com.freshfruit.backend.dto.ReviewRequest;
import com.freshfruit.backend.dto.ReviewResponse;
import com.freshfruit.backend.repository.ProductRepository;
import com.freshfruit.backend.repository.ReviewRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public List<ReviewResponse> findByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrue(productId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ReviewResponse create(ReviewRequest request) {
        Product product =
                productRepository
                        .findById(request.productId())
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));

        Review review =
                reviewRepository.save(
                        Review.builder()
                                .product(product)
                                .author(request.author())
                                .rating(request.rating())
                                .content(request.content())
                                .build());

        List<Review> all = reviewRepository.findByProductIdAndApprovedTrue(product.getId());
        double avg = all.stream().mapToInt(Review::getRating).average().orElse(0);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        product.setReviewCount(all.size());
        productRepository.save(product);

        return toResponse(review);
    }

    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(
                r.getId(), r.getProduct().getId(), r.getAuthor(), r.getRating(), r.getContent(), r.getCreatedAt());
    }
}
