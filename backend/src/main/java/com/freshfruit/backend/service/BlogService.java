package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.BlogPost;
import com.freshfruit.backend.dto.BlogPostResponse;
import com.freshfruit.backend.repository.BlogPostRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public List<BlogPostResponse> findAll() {
        return blogPostRepository.findAll().stream()
                .sorted(Comparator.comparing(BlogPost::getPublishedAt).reversed())
                .map(this::toResponse)
                .toList();
    }

    public BlogPostResponse findBySlug(String slug) {
        BlogPost post =
                blogPostRepository
                        .findBySlug(slug)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết."));
        return toResponse(post);
    }

    private BlogPostResponse toResponse(BlogPost b) {
        return new BlogPostResponse(
                b.getId(), b.getSlug(), b.getTitle(), b.getExcerpt(), b.getContent(), b.getCoverImage(),
                b.getCategory(), b.getAuthor(), b.getPublishedAt(), b.getReadMinutes());
    }
}
