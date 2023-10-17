package com.springboot.store.service;


import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String extractUsername(String jwt);
    String generateToken(UserDetails userDetails);

    String generateRefreshToken(
            UserDetails userDetails
    );

    Boolean isTokenValid(String jwt, UserDetails userDetails);
}
