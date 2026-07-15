package com.freshfruit.backend.dto;

import java.time.Instant;

public record ReviewResponse(
        Long id, Long productId, String author, Integer rating, String content, Instant createdAt) {}
