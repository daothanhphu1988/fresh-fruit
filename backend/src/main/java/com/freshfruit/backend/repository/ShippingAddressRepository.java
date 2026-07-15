package com.freshfruit.backend.repository;

import com.freshfruit.backend.domain.ShippingAddress;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {
    List<ShippingAddress> findByUserId(Long userId);
}
