package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.BlogPostResponse;
import com.freshfruit.backend.service.BlogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Blog", description = "Cẩm nang trái cây")
public class BlogController {

    private final BlogService blogService;

    @GetMapping("/api/blogs")
    public List<BlogPostResponse> findAll() {
        return blogService.findAll();
    }

    @GetMapping("/api/blogs/{slug}")
    public BlogPostResponse findBySlug(@PathVariable String slug) {
        return blogService.findBySlug(slug);
    }
}
