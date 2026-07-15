package com.freshfruit.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Họ tên không được để trống") String fullName,
        @NotBlank @Email(message = "Email không hợp lệ") String email,
        @NotBlank(message = "Số điện thoại không được để trống") String phone,
        @NotBlank @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự") String password) {}
