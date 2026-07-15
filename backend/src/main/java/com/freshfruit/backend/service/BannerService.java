package com.freshfruit.backend.service;

import com.freshfruit.backend.dto.BannerResponse;
import com.freshfruit.backend.repository.BannerRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<BannerResponse> findActive() {
        return bannerRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(
                        b ->
                                new BannerResponse(
                                        b.getId(), b.getTitle(), b.getSubtitle(), b.getImage(), b.getCtaText(),
                                        b.getCtaHref(), b.getSortOrder()))
                .toList();
    }
}
