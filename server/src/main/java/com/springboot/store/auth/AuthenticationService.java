package com.springboot.store.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.store.entity.Staff;
import com.springboot.store.entity.Token;
import com.springboot.store.exception.CustomException;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.repository.StaffRoleRepository;
import com.springboot.store.repository.TokenRepository;
import com.springboot.store.service.JwtService;
import com.springboot.store.utils.Role;
import com.springboot.store.utils.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final StaffRepository staffRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StaffRoleRepository staffRoleRepository;

    public AuthenticationResponse register(RegisterRequest request) {

        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already in use", HttpStatus.BAD_REQUEST);
        }

        var role = staffRoleRepository.findByName(Role.ADMIN).orElseThrow();

        Staff staff = new Staff();
        staff.setName(request.getName());
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setStaffRole(role);

        staffRepository.save(staff);
        var jwtToken = jwtService.generateToken(staff);
        var refreshToken = jwtService.generateRefreshToken(staff);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // check email and password
        var user = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Invalid username/password supplied", HttpStatus.UNPROCESSABLE_ENTITY));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid username/password supplied", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(Staff user, String jwtToken) {
        var token = Token.builder()
                .staff(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Staff user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
//        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
//            return;
//        }
//        refreshToken = authHeader.substring(7);

        // get the token from cookie
        refreshToken = jwtService.getJwtAccessFromCookie(request);
        if (refreshToken == null || refreshToken.isEmpty()) {
            return;
        }

        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.staffRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
//                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);

                // set the new access token in the cookie and body response
                var cookie = jwtService.generateCookie(authResponse.getAccessToken());
                response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                response.getWriter().write(new ObjectMapper().writeValueAsString("Refreshed token successfully"));
            }
        }
    }
}
