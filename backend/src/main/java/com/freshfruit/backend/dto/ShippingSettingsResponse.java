package com.freshfruit.backend.dto;

import java.math.BigDecimal;

public record ShippingSettingsResponse(BigDecimal freeShipThreshold, BigDecimal shippingFee) {}
