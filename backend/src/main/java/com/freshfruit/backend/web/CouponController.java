package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.CouponRequest;
import com.freshfruit.backend.dto.CouponResponse;
import com.freshfruit.backend.service.CouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Mã giảm giá")
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/api/coupons/{code}")
    public CouponResponse findByCode(@PathVariable String code) {
        return couponService.findByCode(code);
    }

    @GetMapping("/api/admin/coupons")
    public List<CouponResponse> findAll() {
        return couponService.findAll();
    }

    @PostMapping("/api/admin/coupons")
    public ResponseEntity<CouponResponse> create(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(couponService.create(request));
    }

    @PutMapping("/api/admin/coupons/{id}")
    public CouponResponse update(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        return couponService.update(id, request);
    }

    @DeleteMapping("/api/admin/coupons/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        couponService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
