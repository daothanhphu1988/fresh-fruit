package com.freshfruit.backend.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId, String productName, String image, BigDecimal price, Integer quantity) {}
