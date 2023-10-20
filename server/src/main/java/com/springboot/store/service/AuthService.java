package com.springboot.store.service;

import com.springboot.store.entity.Staff;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    Staff getCurrentStaff(HttpServletRequest request);
}
