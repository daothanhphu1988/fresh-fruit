package com.freshfruit.backend.dto;

public record AddressResponse(
        Long id, String label, String fullName, String phone, String address, Boolean isDefault) {}
