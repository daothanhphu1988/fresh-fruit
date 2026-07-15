package com.freshfruit.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
        @NotNull Long productId,
        @NotBlank String author,
        @NotNull @Min(1) @Max(5) Integer rating,
        @NotBlank String content) {}
