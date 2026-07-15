package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.OrderRequest;
import com.freshfruit.backend.dto.OrderResponse;
import com.freshfruit.backend.dto.OrderStatusRequest;
import com.freshfruit.backend.security.UserPrincipal;
import com.freshfruit.backend.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Đặt hàng (khách vãng lai hoặc đã đăng nhập)")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<OrderResponse> create(
            @AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.create(request, principal != null ? principal.getUser() : null));
    }

    @GetMapping("/api/me/orders")
    public List<OrderResponse> findMine(@AuthenticationPrincipal UserPrincipal principal) {
        return orderService.findMine(principal.getId());
    }

    @GetMapping("/api/admin/orders")
    public List<OrderResponse> findAll() {
        return orderService.findAll();
    }

    @PatchMapping("/api/admin/orders/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest request) {
        return orderService.updateStatus(id, request);
    }
}
