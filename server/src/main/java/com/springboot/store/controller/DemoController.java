package com.springboot.store.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
public class DemoController {
    @GetMapping
    public ResponseEntity<?> hello(HttpServletResponse response) {
        response.addCookie(new Cookie("hello", "world"));
        return ResponseEntity.ok().body("Hello world");
    }
}
