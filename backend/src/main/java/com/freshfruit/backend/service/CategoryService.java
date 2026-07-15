package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Category;
import com.freshfruit.backend.dto.CategoryRequest;
import com.freshfruit.backend.dto.CategoryResponse;
import com.freshfruit.backend.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CategoryResponse findBySlug(String slug) {
        Category category =
                categoryRepository
                        .findBySlug(slug)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục."));
        return toResponse(category);
    }

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug danh mục đã tồn tại.");
        }
        Category category =
                Category.builder()
                        .name(request.name())
                        .slug(request.slug())
                        .icon(request.icon())
                        .image(request.image())
                        .description(request.description())
                        .build();
        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục."));
        category.setName(request.name());
        category.setSlug(request.slug());
        category.setIcon(request.icon());
        category.setImage(request.image());
        category.setDescription(request.description());
        return toResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getIcon(), c.getImage(), c.getDescription());
    }
}
