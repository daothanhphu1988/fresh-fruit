package com.freshfruit.backend.web;

import com.freshfruit.backend.dto.AddressRequest;
import com.freshfruit.backend.dto.AddressResponse;
import com.freshfruit.backend.security.UserPrincipal;
import com.freshfruit.backend.service.AddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "Sổ địa chỉ của khách hàng (yêu cầu đăng nhập)")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressResponse> findMine(@AuthenticationPrincipal UserPrincipal principal) {
        return addressService.findMine(principal.getId());
    }

    @PostMapping
    public ResponseEntity<AddressResponse> create(
            @AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.create(principal.getUser(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        addressService.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
