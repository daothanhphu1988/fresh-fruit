package com.freshfruit.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderRequest(
        @NotBlank String customerName,
        @NotBlank String phone,
        @NotBlank String address,
        String note,
        @NotNull String paymentMethod,
        String voucherCode,
        @NotEmpty @Valid List<OrderItemRequest> items) {}
