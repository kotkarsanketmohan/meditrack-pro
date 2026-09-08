package com.meditrack.backend.service.impl;

import com.meditrack.backend.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final RestTemplate restTemplate;
    private final String brevoApiUrl;
    private final String brevoApiKey;
    private final String senderName;
    private final String senderEmail;
    private final String frontendUrl;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    public EmailServiceImpl(
            @Value("${brevo.api.url:https://api.brevo.com/v3/smtp/email}") String brevoApiUrl,
            @Value("${brevo.api.key}") String brevoApiKey,
            @Value("${brevo.sender.name:MediTrack Pro}") String senderName,
            @Value("${brevo.sender.email:meditrackpro01@gmail.com}") String senderEmail,
            @Value("${app.frontend.url:http://localhost:5173}") String frontendUrl) {
        this.brevoApiUrl = brevoApiUrl;
        this.brevoApiKey = brevoApiKey;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.frontendUrl = frontendUrl;
        this.restTemplate = new RestTemplate();
    }

    private record BrevoSender(String name, String email) {}
    
    @com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
    private record BrevoRecipient(String email, String name) {}
    
    private record BrevoReplyTo(String email) {}
    
    @com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
    private record BrevoEmailRequest(
        BrevoSender sender, 
        List<BrevoRecipient> to, 
        String subject, 
        String htmlContent, 
        String textContent,
        BrevoReplyTo replyTo
    ) {}

    private void sendBrevoEmail(String toEmail, String subject, String htmlContent, String textContent, String replyToEmail, String customSenderName) {
        // Quick short-circuit check
        if (!emailEnabled) {
            log.info("Email functionality is currently DISABLED. Skipping email to: {}", toEmail);
            return;
        }

        String finalSenderName = customSenderName != null ? customSenderName : this.senderName;
        
        BrevoSender sender = new BrevoSender(finalSenderName, senderEmail);
        List<BrevoRecipient> to = List.of(new BrevoRecipient(toEmail, null));
        BrevoReplyTo replyTo = (replyToEmail != null && !replyToEmail.isEmpty()) ? new BrevoReplyTo(replyToEmail) : null;
        
        BrevoEmailRequest requestBody = new BrevoEmailRequest(
                sender,
                to,
                subject,
                htmlContent,
                textContent,
                replyTo
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String sanitizedKey = brevoApiKey != null ? brevoApiKey.trim() : "";
            headers.set("api-key", sanitizedKey);
            headers.set("accept", "application/json");

            log.info("Attempting to send email via Brevo. API Key starts with: '{}', Length: {}", 
                     sanitizedKey.length() >= 5 ? sanitizedKey.substring(0, 5) : "invalid", 
                     sanitizedKey.length());

            HttpEntity<BrevoEmailRequest> entity = new HttpEntity<>(requestBody, headers);

            restTemplate.postForEntity(brevoApiUrl, entity, Void.class);
            
            log.info("Email sent via Brevo to {}! Subject: {}", toEmail, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {} via Brevo: {}", toEmail, e.getMessage());
        }
    }

    @Override
    public void sendActivationEmail(String toEmail, String token) {
        String activationUrl = frontendUrl + "/activate?token=" + token;

        String htmlContent = """
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; color: #1f2937;">
                    <h2 style="color: #2563eb; margin-bottom: 20px;">Welcome to MediTrack Pro!</h2>
                    <p style="font-size: 16px; margin-bottom: 30px; color: #4b5563;">Thank you for registering. Please verify your email address to activate your account.</p>
                    <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">Activate Account</a>
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #3b82f6;">%s</p>
                    </div>
                </div>
                """
                .formatted(activationUrl, activationUrl);

        String textContent = "Welcome to MediTrack Pro!\n\n" +
                             "Thank you for registering. Please verify your email address to activate your account.\n\n" +
                             "Activate Account: " + activationUrl;

        sendBrevoEmail(toEmail, "Activate Your MediTrack Pro Account", htmlContent, textContent, null, "MediTrack Pro");
    }

    @Override
    public void sendWelcomeEmail(String toEmail, String pharmacyName) {
        String htmlContent = "<div style='font-family: \"Segoe UI\", Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>"
                +
                "<div style='background-color: #2563eb; padding: 30px; text-align: center; color: white;'>" +
                "<h1 style='margin: 0; font-size: 28px; font-weight: bold;'>Welcome to MediTrack Pro! \uD83C\uDF89</h1>"
                +
                "</div>" +
                "<div style='padding: 30px; background-color: #ffffff; color: #334155;'>" +
                "<h2 style='color: #1e293b; margin-top: 0;'>Hello " + pharmacyName + ",</h2>" +
                "<p style='font-size: 16px; line-height: 1.6;'>Your account has been successfully activated. We are thrilled to have you on board! MediTrack Pro is designed to make managing your pharmacy easier, faster, and more efficient.</p>"
                +
                "<h3 style='color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;'>Explore Your Features</h3>"
                +
                "<ul style='list-style: none; padding: 0;'>" +
                "<li style='margin-bottom: 15px; display: flex; align-items: start;'><span style='font-size: 20px; margin-right: 15px;'>\uD83D\uDCCA</span><div><strong>Dashboard Analytics:</strong> Get a bird's-eye view of your sales, stock, and revenue.</div></li>"
                +
                "<li style='margin-bottom: 15px; display: flex; align-items: start;'><span style='font-size: 20px; margin-right: 15px;'>\uD83D\uDCE6</span><div><strong>Stock Management:</strong> Easily add, update, and track your medicines in real-time.</div></li>"
                +
                "<li style='margin-bottom: 15px; display: flex; align-items: start;'><span style='font-size: 20px; margin-right: 15px;'>\u26A0\uFE0F</span><div><strong>Low Stock Alerts:</strong> Never run out of essential medicines with automatic low stock warnings.</div></li>"
                +
                "<li style='margin-bottom: 15px; display: flex; align-items: start;'><span style='font-size: 20px; margin-right: 15px;'>\uD83D\uDCDC</span><div><strong>Purchase History:</strong> Keep an accurate ledger of all your previous transactions.</div></li>"
                +
                "</ul>" +
                "<div style='text-align: center; margin-top: 40px;'>" +
                "<a href='" + frontendUrl
                + "' style='display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; color: white; background-color: #2563eb; text-decoration: none; border-radius: 8px;'>Log In to Your Dashboard</a>"
                +
                "</div>" +
                "</div>" +
                "<div style='background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0;'>"
                +
                "<p style='margin: 0;'>Need help? Contact our support team anytime.</p>" +
                "<p style='margin: 5px 0 0;'>&copy; 2026 MediTrack Pro. All rights reserved.</p>" +
                "</div>" +
                "</div>";

        String textContent = "Welcome to MediTrack Pro!\n\n" +
                             "Hello " + pharmacyName + ",\n" +
                             "Your account has been successfully activated. We are thrilled to have you on board! " +
                             "MediTrack Pro is designed to make managing your pharmacy easier, faster, and more efficient.\n\n" +
                             "Explore Your Features:\n" +
                             "- Dashboard Analytics: Get a bird's-eye view of your sales, stock, and revenue.\n" +
                             "- Stock Management: Easily add, update, and track your medicines in real-time.\n" +
                             "- Low Stock Alerts: Never run out of essential medicines with automatic low stock warnings.\n" +
                             "- Purchase History: Keep an accurate ledger of all your previous transactions.\n\n" +
                             "Log In to Your Dashboard: " + frontendUrl;

        sendBrevoEmail(toEmail, "Welcome to MediTrack Pro! \uD83D\uDE80", htmlContent, textContent, null, "MediTrack Pro");
    }

    @Override
    public void sendContactEmail(String name, String fromEmail, String messageBody) {
        String htmlContent = "<p><strong>Name:</strong> " + name + "</p>" +
                "<p><strong>Email:</strong> " + fromEmail + "</p><br/>" +
                "<p><strong>Message:</strong><br/>" + messageBody.replace("\n", "<br/>") + "</p>";

        String textContent = "Name: " + name + "\n" +
                             "Email: " + fromEmail + "\n\n" +
                             "Message:\n" + messageBody;

        sendBrevoEmail(this.senderEmail, "New Contact Request from " + name, htmlContent, textContent, fromEmail,
                "MediTrack Pro Contact Form");
    }
}
