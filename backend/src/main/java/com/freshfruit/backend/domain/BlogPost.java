package com.freshfruit.backend.domain;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "blogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(nullable = false, length = 250)
    private String title;

    @Column(length = 500)
    private String excerpt;

    @Column(columnDefinition = "text")
    private String content;

    @Column(length = 500)
    private String coverImage;

    @Column(length = 100)
    private String category;

    @Column(length = 150)
    private String author;

    @Builder.Default
    private Instant publishedAt = Instant.now();

    @Builder.Default
    private Integer readMinutes = 5;
}
