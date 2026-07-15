package com.freshfruit.backend.repository;

import com.freshfruit.backend.domain.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}
