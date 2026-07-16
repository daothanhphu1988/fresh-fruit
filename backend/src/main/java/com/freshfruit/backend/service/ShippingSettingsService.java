package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.ShippingSettings;
import com.freshfruit.backend.dto.ShippingSettingsRequest;
import com.freshfruit.backend.dto.ShippingSettingsResponse;
import com.freshfruit.backend.repository.ShippingSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShippingSettingsService {

    private final ShippingSettingsRepository shippingSettingsRepository;

    public ShippingSettings getEntity() {
        return shippingSettingsRepository
                .findById(1L)
                .orElseGet(() -> shippingSettingsRepository.save(ShippingSettings.builder().id(1L).build()));
    }

    public ShippingSettingsResponse get() {
        return toResponse(getEntity());
    }

    public ShippingSettingsResponse update(ShippingSettingsRequest request) {
        ShippingSettings settings = getEntity();
        settings.setFreeShipThreshold(request.freeShipThreshold());
        settings.setShippingFee(request.shippingFee());
        return toResponse(shippingSettingsRepository.save(settings));
    }

    private ShippingSettingsResponse toResponse(ShippingSettings s) {
        return new ShippingSettingsResponse(s.getFreeShipThreshold(), s.getShippingFee());
    }
}
