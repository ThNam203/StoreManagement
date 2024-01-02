package com.springboot.store.controller;

import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.NotificationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
public class DemoController {
    private final StaffRepository staffRepository;
    private final NotificationService notificationService;
    @GetMapping
    public ResponseEntity<?> hello(HttpServletResponse response) {
        response.addCookie(new Cookie("hello", "world"));
        notificationService.notifyLowStock(1, 2);
        return ResponseEntity.ok().body("Hello world: " + new Date());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> hello(@PathVariable Integer id) {
        return ResponseEntity.status(201).body(staffRepository.findByStoreId(id));
    }
}
