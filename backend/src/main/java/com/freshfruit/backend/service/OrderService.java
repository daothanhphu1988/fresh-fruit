package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Coupon;
import com.freshfruit.backend.domain.DiscountType;
import com.freshfruit.backend.domain.Order;
import com.freshfruit.backend.domain.OrderItem;
import com.freshfruit.backend.domain.OrderStatus;
import com.freshfruit.backend.domain.PaymentMethod;
import com.freshfruit.backend.domain.Product;
import com.freshfruit.backend.domain.User;
import com.freshfruit.backend.dto.OrderItemRequest;
import com.freshfruit.backend.dto.OrderItemResponse;
import com.freshfruit.backend.dto.OrderRequest;
import com.freshfruit.backend.dto.OrderResponse;
import com.freshfruit.backend.dto.OrderStatusRequest;
import com.freshfruit.backend.repository.CouponRepository;
import com.freshfruit.backend.repository.OrderRepository;
import com.freshfruit.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal FREE_SHIP_THRESHOLD = BigDecimal.valueOf(300_000);
    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(25_000);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    @Transactional
    public OrderResponse create(OrderRequest request, User user) {
        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.paymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức thanh toán không hợp lệ.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new java.util.ArrayList<>();
        for (OrderItemRequest itemReq : request.items()) {
            Product product =
                    productRepository
                            .findById(itemReq.productId())
                            .orElseThrow(
                                    () ->
                                            new ResponseStatusException(
                                                    HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm id=" + itemReq.productId()));
            BigDecimal unitPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.quantity()));
            subtotal = subtotal.add(lineTotal);

            items.add(
                    OrderItem.builder()
                            .product(product)
                            .productName(product.getName())
                            .image(product.getImages().isEmpty() ? null : product.getImages().get(0).getUrl())
                            .price(unitPrice)
                            .quantity(itemReq.quantity())
                            .build());

            product.setStock(Math.max(0, product.getStock() - itemReq.quantity()));
            product.setSoldCount(product.getSoldCount() + itemReq.quantity());
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (request.voucherCode() != null && !request.voucherCode().isBlank()) {
            discount = applyCoupon(request.voucherCode(), subtotal);
        }

        BigDecimal shippingFee =
                subtotal.compareTo(FREE_SHIP_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
        BigDecimal total = subtotal.subtract(discount).add(shippingFee);
        if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;

        Order order =
                Order.builder()
                        .code("FF" + System.currentTimeMillis())
                        .user(user)
                        .customerName(request.customerName())
                        .phone(request.phone())
                        .address(request.address())
                        .note(request.note())
                        .paymentMethod(paymentMethod)
                        .status(OrderStatus.PENDING)
                        .subtotal(subtotal)
                        .shippingFee(shippingFee)
                        .discount(discount)
                        .total(total)
                        .build();
        items.forEach(i -> i.setOrder(order));
        order.setItems(items);

        return toResponse(orderRepository.save(order));
    }

    private BigDecimal applyCoupon(String code, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code).orElse(null);
        if (coupon == null) return BigDecimal.ZERO;
        LocalDate today = LocalDate.now();
        if (today.isBefore(coupon.getStartDate()) || today.isAfter(coupon.getEndDate())) return BigDecimal.ZERO;
        if (subtotal.compareTo(coupon.getMinOrder()) < 0) return BigDecimal.ZERO;

        BigDecimal discount =
                coupon.getType() == DiscountType.PERCENT
                        ? subtotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100))
                        : coupon.getValue();
        if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
        return discount;
    }

    public List<OrderResponse> findMine(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    public OrderResponse updateStatus(Long id, OrderStatusRequest request) {
        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        try {
            order.setStatus(OrderStatus.valueOf(request.status().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ.");
        }
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order o) {
        List<OrderItemResponse> items =
                o.getItems().stream()
                        .map(
                                i ->
                                        new OrderItemResponse(
                                                i.getProduct() != null ? i.getProduct().getId() : null,
                                                i.getProductName(),
                                                i.getImage(),
                                                i.getPrice(),
                                                i.getQuantity()))
                        .toList();
        return new OrderResponse(
                o.getId(),
                o.getCode(),
                o.getCustomerName(),
                o.getPhone(),
                o.getAddress(),
                o.getNote(),
                o.getPaymentMethod().name().toLowerCase(),
                o.getStatus().name().toLowerCase(),
                o.getSubtotal(),
                o.getShippingFee(),
                o.getDiscount(),
                o.getTotal(),
                o.getCreatedAt(),
                items);
    }
}
