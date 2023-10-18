package com.springboot.store.service.impl;

import com.springboot.store.entity.Staff;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.AuthService;
import com.springboot.store.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final JwtService jwtService;
    private final StaffRepository staffRepository;

    @Autowired
    public AuthServiceImpl(JwtService jwtService, StaffRepository staffRepository) {
        this.jwtService = jwtService;
        this.staffRepository = staffRepository;
    }

    @Override
    public Staff getCurrentStaff(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        return staffRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
    }
}
