package com.meditrack.backend.service;

public interface EmailService {
    void sendActivationEmail(String toEmail, String token);
    void sendWelcomeEmail(String toEmail, String pharmacyName);
    void sendContactEmail(String name, String fromEmail, String messageBody);
}
