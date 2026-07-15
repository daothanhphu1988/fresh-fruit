package com.freshfruit.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank String sku,
        @NotBlank String slug,
        @NotBlank String name,
        @NotNull Long categoryId,
        @NotNull BigDecimal price,
        BigDecimal salePrice,
        Integer stock,
        String unit,
        String origin,
        String season,
        Boolean organic,
        Boolean featured,
        String description,
        String weight,
        String expiry,
        List<String> imageUrls) {}
