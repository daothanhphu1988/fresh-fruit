package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Category;
import com.freshfruit.backend.domain.Product;
import com.freshfruit.backend.domain.ProductImage;
import com.freshfruit.backend.dto.ProductImageResponse;
import com.freshfruit.backend.dto.ProductRequest;
import com.freshfruit.backend.dto.ProductResponse;
import com.freshfruit.backend.repository.CategoryRepository;
import com.freshfruit.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> search(
            String categorySlug, String origin, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Product> spec = Specification.allOf();

        if (categorySlug != null && !categorySlug.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("slug"), categorySlug));
        }
        if (origin != null && !origin.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("origin"), origin));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public ProductResponse findBySlug(String slug) {
        Product product =
                productRepository
                        .findBySlug(slug)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));
        return toResponse(product);
    }

    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsBySku(request.sku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU đã tồn tại.");
        }
        if (productRepository.existsBySlug(request.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug sản phẩm đã tồn tại.");
        }
        Category category = getCategory(request.categoryId());

        Product product =
                Product.builder()
                        .sku(request.sku())
                        .slug(request.slug())
                        .name(request.name())
                        .category(category)
                        .price(request.price())
                        .salePrice(request.salePrice())
                        .stock(request.stock() != null ? request.stock() : 0)
                        .unit(request.unit())
                        .origin(request.origin())
                        .season(request.season())
                        .organic(Boolean.TRUE.equals(request.organic()))
                        .featured(Boolean.TRUE.equals(request.featured()))
                        .description(request.description())
                        .weight(request.weight())
                        .expiry(request.expiry())
                        .build();
        attachImages(product, request.imageUrls());
        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));
        Category category = getCategory(request.categoryId());

        product.setSku(request.sku());
        product.setSlug(request.slug());
        product.setName(request.name());
        product.setCategory(category);
        product.setPrice(request.price());
        product.setSalePrice(request.salePrice());
        if (request.stock() != null) product.setStock(request.stock());
        product.setUnit(request.unit());
        product.setOrigin(request.origin());
        product.setSeason(request.season());
        product.setOrganic(Boolean.TRUE.equals(request.organic()));
        product.setFeatured(Boolean.TRUE.equals(request.featured()));
        product.setDescription(request.description());
        product.setWeight(request.weight());
        product.setExpiry(request.expiry());

        if (request.imageUrls() != null) {
            product.getImages().clear();
            attachImages(product, request.imageUrls());
        }
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục."));
    }

    private void attachImages(Product product, List<String> urls) {
        if (urls == null) return;
        for (String url : urls) {
            product.getImages().add(ProductImage.builder().product(product).url(url).alt(product.getName()).build());
        }
    }

    public ProductResponse toResponse(Product p) {
        List<ProductImageResponse> images = new ArrayList<>();
        for (ProductImage img : p.getImages()) {
            images.add(new ProductImageResponse(img.getId(), img.getUrl(), img.getAlt()));
        }
        return new ProductResponse(
                p.getId(),
                p.getSku(),
                p.getSlug(),
                p.getName(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getCategory().getSlug(),
                p.getPrice(),
                p.getSalePrice(),
                p.getStock(),
                p.getUnit(),
                p.getOrigin(),
                p.getSeason(),
                p.getOrganic(),
                p.getFeatured(),
                p.getDescription(),
                p.getWeight(),
                p.getExpiry(),
                p.getRating(),
                p.getReviewCount(),
                p.getSoldCount(),
                images);
    }
}
