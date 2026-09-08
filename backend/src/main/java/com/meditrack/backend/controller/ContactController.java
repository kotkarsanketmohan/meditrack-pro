package com.meditrack.backend.controller;

import com.meditrack.backend.dto.ContactRequest;
import com.meditrack.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@RequestBody ContactRequest request) {
        try {
            emailService.sendContactEmail(request.getName(), request.getEmail(), request.getMessage());
            return ResponseEntity.ok(Map.of("message", "Contact form submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to submit contact form"));
        }
    }
}
