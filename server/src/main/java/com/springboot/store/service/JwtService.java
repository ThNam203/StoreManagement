package com.springboot.store.service;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String extractUsername(String jwt);
    String generateToken(UserDetails userDetails);
    String generateRefreshToken(
            UserDetails userDetails
    );
    Boolean isTokenValid(String jwt, UserDetails userDetails);
    ResponseCookie generateCookie(String token);
    ResponseCookie generateRefreshCookie(String token);
    String getJwtAccessFromCookie(HttpServletRequest request);
    String getJwtRefreshFromCookie(HttpServletRequest request);
}
