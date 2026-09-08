package com.meditrack.backend.controller;

import com.meditrack.backend.dto.AuthRequest;
import com.meditrack.backend.dto.AuthResponse;
import com.meditrack.backend.dto.RegisterRequest;
import com.meditrack.backend.entity.PharmacyUser;
import com.meditrack.backend.repository.PharmacyUserRepository;
import com.meditrack.backend.security.CustomUserDetails;
import com.meditrack.backend.security.JwtUtil;
import com.meditrack.backend.service.MedicineSeederService;
import com.meditrack.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import java.util.Map;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final PharmacyUserRepository pharmacyUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MedicineSeederService medicineSeederService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required."));
        }
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email format. Please enter a valid email address."));
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required."));
        }
        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters long."));
        }
        if (request.getPharmacyName() == null || request.getPharmacyName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Pharmacy name is required."));
        }
        if (pharmacyUserRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email Address Already Registered. Please log in instead."));
        }

        String token = java.util.UUID.randomUUID().toString();
        PharmacyUser user = PharmacyUser.builder()
                .pharmacyName(request.getPharmacyName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(false)
                .verificationToken(token)
                .build();

        if (user != null) {
            PharmacyUser savedUser = pharmacyUserRepository.save(user);
            medicineSeederService.seedNewUser(savedUser);
            try {
                emailService.sendActivationEmail(savedUser.getEmail(), token);
            } catch (Exception e) {
                // Ignore email failure for local testing if SMTP is not configured
                System.err.println("Warning: Email failed to send. " + e.getMessage());
            }
        }

        return ResponseEntity.ok(Map.of("message", "Pharmacy registered successfully! You can now login."));
    }

    @GetMapping(value = "/activate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> activateAccount(@RequestParam("token") String token) {
        PharmacyUser user = pharmacyUserRepository.findByVerificationToken(token).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid Link: This activation link has expired or is invalid."));
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        pharmacyUserRepository.save(user);

        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getPharmacyName());
        } catch (Exception e) {
            System.err.println("Warning: Welcome email failed to send. " + e.getMessage());
        }

        return ResponseEntity
                .ok(Map.of("message", "Account Activated! Your MediTrack Pro email has been successfully verified."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required to login."));
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required to login."));
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getPharmacyUser().getPharmacyName(),
                    userDetails.getPharmacyUser().getEmail()));
        } catch (org.springframework.security.authentication.DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid Account. Please activate your account via the link sent to your email."));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during login."));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            String accessToken = payload.get("token");
            if (accessToken == null || accessToken.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Google token is missing from request."));
            }

            // Call Google to verify the access token and get user info
            String googleUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
            RestTemplate restTemplate = new RestTemplate();

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setBearerAuth(accessToken);
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);

            ResponseEntity<Map<String, Object>> googleResponse = restTemplate.exchange(
                    googleUrl,
                    HttpMethod.valueOf("GET"),
                    entity,
                    new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {
                    });
            Map<String, Object> googleData = googleResponse.getBody();

            if (googleData != null && googleData.containsKey("email")) {
                String email = (String) googleData.get("email");
                String name = (String) googleData.get("name");

                PharmacyUser user = pharmacyUserRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    user = new PharmacyUser();
                    user.setEmail(email);
                    user.setPharmacyName(name + "'s Pharmacy");
                    user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    user.setEnabled(false);

                    String verificationToken = java.util.UUID.randomUUID().toString();
                    user.setVerificationToken(verificationToken);

                    user = pharmacyUserRepository.save(user);

                    try {
                        medicineSeederService.seedNewUser(user);
                        emailService.sendActivationEmail(user.getEmail(), verificationToken);
                    } catch (Exception e) {
                        System.err.println("Seeding or email failed: " + e.getMessage());
                    }
                    
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("message", "Account created successfully. Please check your email to activate your account."));
                } else if (!user.isEnabled()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("message", "Invalid Account. Please activate your account via the link sent to your email."));
                }

                CustomUserDetails userDetails = new CustomUserDetails(user);
                String jwtToken = jwtUtil.generateToken(userDetails);

                Map<String, String> response = new java.util.HashMap<>();
                response.put("token", jwtToken);
                response.put("pharmacyName", user.getPharmacyName());
                response.put("email", user.getEmail());
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid Google token or email not found."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Google Authentication Server Error: " + e.getMessage()));
        }
    }
}
