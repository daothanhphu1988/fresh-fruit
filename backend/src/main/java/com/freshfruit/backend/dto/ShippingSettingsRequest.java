package com.freshfruit.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ShippingSettingsRequest(
        @NotNull @PositiveOrZero BigDecimal freeShipThreshold,
        @NotNull @PositiveOrZero BigDecimal shippingFee) {}
