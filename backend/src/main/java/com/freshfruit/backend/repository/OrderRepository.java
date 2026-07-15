package com.freshfruit.backend.repository;

import com.freshfruit.backend.domain.Order;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByCode(String code);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
