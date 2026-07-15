package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.ShippingAddress;
import com.freshfruit.backend.domain.User;
import com.freshfruit.backend.dto.AddressRequest;
import com.freshfruit.backend.dto.AddressResponse;
import com.freshfruit.backend.repository.ShippingAddressRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final ShippingAddressRepository shippingAddressRepository;

    public List<AddressResponse> findMine(Long userId) {
        return shippingAddressRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    public AddressResponse create(User user, AddressRequest request) {
        ShippingAddress address =
                shippingAddressRepository.save(
                        ShippingAddress.builder()
                                .user(user)
                                .label(request.label())
                                .fullName(request.fullName())
                                .phone(request.phone())
                                .address(request.address())
                                .isDefault(Boolean.TRUE.equals(request.isDefault()))
                                .build());
        return toResponse(address);
    }

    public void delete(Long userId, Long addressId) {
        ShippingAddress address =
                shippingAddressRepository
                        .findById(addressId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy địa chỉ."));
        if (!address.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xóa địa chỉ này.");
        }
        shippingAddressRepository.delete(address);
    }

    private AddressResponse toResponse(ShippingAddress a) {
        return new AddressResponse(a.getId(), a.getLabel(), a.getFullName(), a.getPhone(), a.getAddress(), a.getIsDefault());
    }
}
