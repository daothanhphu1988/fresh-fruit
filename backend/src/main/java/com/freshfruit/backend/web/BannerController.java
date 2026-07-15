package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.BannerResponse;
import com.freshfruit.backend.service.BannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Banners", description = "Banner trang chủ")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/api/banners")
    public List<BannerResponse> findActive() {
        return bannerService.findActive();
    }
}
