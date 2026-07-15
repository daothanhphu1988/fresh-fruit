package com.freshfruit.backend.dto;

import java.time.Instant;

public record BlogPostResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
        String content,
        String coverImage,
        String category,
        String author,
        Instant publishedAt,
        Integer readMinutes) {}
