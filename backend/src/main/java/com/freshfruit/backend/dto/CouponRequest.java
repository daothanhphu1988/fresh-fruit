package com.freshfruit.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponRequest(
        @NotBlank String code,
        @NotBlank String type,
        @NotNull BigDecimal value,
        BigDecimal minOrder,
        BigDecimal maxDiscount,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String description,
        Integer usageLimit) {}
