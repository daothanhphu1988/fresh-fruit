package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Coupon;
import com.freshfruit.backend.domain.DiscountType;
import com.freshfruit.backend.dto.CouponRequest;
import com.freshfruit.backend.dto.CouponResponse;
import com.freshfruit.backend.repository.CouponRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<CouponResponse> findAll() {
        return couponRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CouponResponse findByCode(String code) {
        Coupon coupon =
                couponRepository
                        .findByCodeIgnoreCase(code)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mã giảm giá không tồn tại."));
        return toResponse(coupon);
    }

    public CouponResponse create(CouponRequest request) {
        if (couponRepository.findByCodeIgnoreCase(request.code()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã giảm giá đã tồn tại.");
        }
        Coupon coupon =
                Coupon.builder()
                        .code(request.code().toUpperCase())
                        .type(parseType(request.type()))
                        .value(request.value())
                        .minOrder(request.minOrder() != null ? request.minOrder() : BigDecimal.ZERO)
                        .maxDiscount(request.maxDiscount())
                        .startDate(request.startDate())
                        .endDate(request.endDate())
                        .description(request.description())
                        .usageLimit(request.usageLimit() != null ? request.usageLimit() : 0)
                        .build();
        return toResponse(couponRepository.save(coupon));
    }

    public CouponResponse update(Long id, CouponRequest request) {
        Coupon coupon =
                couponRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mã giảm giá."));
        coupon.setCode(request.code().toUpperCase());
        coupon.setType(parseType(request.type()));
        coupon.setValue(request.value());
        coupon.setMinOrder(request.minOrder() != null ? request.minOrder() : BigDecimal.ZERO);
        coupon.setMaxDiscount(request.maxDiscount());
        coupon.setStartDate(request.startDate());
        coupon.setEndDate(request.endDate());
        coupon.setDescription(request.description());
        if (request.usageLimit() != null) coupon.setUsageLimit(request.usageLimit());
        return toResponse(couponRepository.save(coupon));
    }

    public void delete(Long id) {
        couponRepository.deleteById(id);
    }

    private DiscountType parseType(String type) {
        try {
            return DiscountType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại giảm giá không hợp lệ.");
        }
    }

    private CouponResponse toResponse(Coupon c) {
        return new CouponResponse(
                c.getId(),
                c.getCode(),
                c.getType().name().toLowerCase(),
                c.getValue(),
                c.getMinOrder(),
                c.getMaxDiscount(),
                c.getStartDate(),
                c.getEndDate(),
                c.getDescription(),
                c.getUsageLimit(),
                c.getUsedCount());
    }
}
