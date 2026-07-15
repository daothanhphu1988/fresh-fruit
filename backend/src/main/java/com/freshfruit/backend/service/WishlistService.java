package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Product;
import com.freshfruit.backend.domain.User;
import com.freshfruit.backend.domain.Wishlist;
import com.freshfruit.backend.dto.ProductResponse;
import com.freshfruit.backend.repository.ProductRepository;
import com.freshfruit.backend.repository.WishlistRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<ProductResponse> findMine(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(w -> productService.toResponse(w.getProduct()))
                .toList();
    }

    public void add(User user, Long productId) {
        if (wishlistRepository.findByUserIdAndProductId(user.getId(), productId).isPresent()) return;
        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));
        wishlistRepository.save(Wishlist.builder().user(user).product(product).build());
    }

    public void remove(Long userId, Long productId) {
        wishlistRepository
                .findByUserIdAndProductId(userId, productId)
                .ifPresent(wishlistRepository::delete);
    }
}
