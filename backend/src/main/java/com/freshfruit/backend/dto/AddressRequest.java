package com.freshfruit.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank String label,
        @NotBlank String fullName,
        @NotBlank String phone,
        @NotBlank String address,
        Boolean isDefault) {}
