package com.freshfruit.backend.dto;

public record BannerResponse(
        Long id, String title, String subtitle, String image, String ctaText, String ctaHref, Integer sortOrder) {}
