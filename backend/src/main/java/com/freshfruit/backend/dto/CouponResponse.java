package com.freshfruit.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponResponse(
        Long id,
        String code,
        String type,
        BigDecimal value,
        BigDecimal minOrder,
        BigDecimal maxDiscount,
        LocalDate startDate,
        LocalDate endDate,
        String description,
        Integer usageLimit,
        Integer usedCount) {}
