package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.ProductResponse;
import com.freshfruit.backend.security.UserPrincipal;
import com.freshfruit.backend.service.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Sản phẩm yêu thích (yêu cầu đăng nhập)")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<ProductResponse> findMine(@AuthenticationPrincipal UserPrincipal principal) {
        return wishlistService.findMine(principal.getId());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> add(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable Long productId) {
        wishlistService.add(principal.getUser(), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable Long productId) {
        wishlistService.remove(principal.getId(), productId);
        return ResponseEntity.noContent().build();
    }
}
