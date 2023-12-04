package com.springboot.store.controller;

import com.springboot.store.repository.StaffRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
public class DemoController {
    private final StaffRepository staffRepository;
    @GetMapping
    public ResponseEntity<?> hello(HttpServletResponse response) {
        response.addCookie(new Cookie("hello", "world"));
        return ResponseEntity.ok().body("Hello world");
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> hello(@PathVariable Integer id) {
        return ResponseEntity.status(201).body(staffRepository.findByStoreId(id));
    }
}
