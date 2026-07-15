package com.freshfruit.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Long id,
        String sku,
        String slug,
        String name,
        Long categoryId,
        String categoryName,
        String categorySlug,
        BigDecimal price,
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
        Double rating,
        Integer reviewCount,
        Integer soldCount,
        List<ProductImageResponse> images) {}
