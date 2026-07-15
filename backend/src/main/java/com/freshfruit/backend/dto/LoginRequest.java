package com.freshfruit.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank @Email(message = "Email không hợp lệ") String email,
        @NotBlank(message = "Mật khẩu không được để trống") String password) {}
