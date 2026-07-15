package com.freshfruit.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String code,
        String customerName,
        String phone,
        String address,
        String note,
        String paymentMethod,
        String status,
        BigDecimal subtotal,
        BigDecimal shippingFee,
        BigDecimal discount,
        BigDecimal total,
        Instant createdAt,
        List<OrderItemResponse> items) {}
