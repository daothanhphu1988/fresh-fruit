package com.freshfruit.backend.service;

import com.freshfruit.backend.domain.Role;
import com.freshfruit.backend.domain.User;
import com.freshfruit.backend.dto.AuthResponse;
import com.freshfruit.backend.dto.LoginRequest;
import com.freshfruit.backend.dto.RegisterRequest;
import com.freshfruit.backend.repository.RoleRepository;
import com.freshfruit.backend.repository.UserRepository;
import com.freshfruit.backend.security.JwtService;
import com.freshfruit.backend.security.UserPrincipal;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký.");
        }

        Role customerRole =
                roleRepository
                        .findByName("CUSTOMER")
                        .orElseGet(() -> roleRepository.save(Role.builder().name("CUSTOMER").build()));

        User user =
                User.builder()
                        .fullName(request.fullName())
                        .email(request.email())
                        .phone(request.phone())
                        .passwordHash(passwordEncoder.encode(request.password()))
                        .role(customerRole)
                        .build();
        userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal, Map.of("uid", user.getId()));
        return new AuthResponse(token, user.getFullName(), user.getEmail(), customerRole.getName());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user =
                userRepository
                        .findByEmail(request.email())
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai thông tin đăng nhập."));

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal, Map.of("uid", user.getId()));
        return new AuthResponse(token, user.getFullName(), user.getEmail(), user.getRole().getName());
    }
}
