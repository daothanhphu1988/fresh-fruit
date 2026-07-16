package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.ShippingSettingsRequest;
import com.freshfruit.backend.dto.ShippingSettingsResponse;
import com.freshfruit.backend.service.ShippingSettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Shipping Settings", description = "Ngưỡng miễn phí ship và phí vận chuyển")
public class ShippingSettingsController {

    private final ShippingSettingsService shippingSettingsService;

    @GetMapping("/api/shipping-settings")
    public ShippingSettingsResponse get() {
        return shippingSettingsService.get();
    }

    @PutMapping("/api/admin/shipping-settings")
    public ShippingSettingsResponse update(@Valid @RequestBody ShippingSettingsRequest request) {
        return shippingSettingsService.update(request);
    }
}
