package com.freshfruit.backend.repository;

import com.freshfruit.backend.domain.ShippingSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingSettingsRepository extends JpaRepository<ShippingSettings, Long> {}
