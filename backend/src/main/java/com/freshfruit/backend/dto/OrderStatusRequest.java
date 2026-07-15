package com.freshfruit.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record OrderStatusRequest(@NotBlank String status) {}
