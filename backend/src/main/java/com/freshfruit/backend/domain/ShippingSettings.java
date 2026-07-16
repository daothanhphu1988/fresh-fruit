package com.freshfruit.backend.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shipping_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal freeShipThreshold = BigDecimal.valueOf(300_000);

    @Builder.Default
    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal shippingFee = BigDecimal.valueOf(25_000);
}
