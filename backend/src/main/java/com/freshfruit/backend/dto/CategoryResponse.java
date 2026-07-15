package com.freshfruit.backend.dto;

public record CategoryResponse(
        Long id, String name, String slug, String icon, String image, String description) {}
