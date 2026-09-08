package com.meditrack.backend.controller;

import com.meditrack.backend.dto.ProfileDto;
import com.meditrack.backend.entity.PharmacyUser;
import com.meditrack.backend.repository.PharmacyUserRepository;
import com.meditrack.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final PharmacyUserRepository pharmacyUserRepository;

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        PharmacyUser user = userDetails.getPharmacyUser();

        ProfileDto profileDto = ProfileDto.builder()
                .pharmacyName(user.getPharmacyName())
                .email(user.getEmail())
                .mobileNo(user.getMobileNo())
                .address(user.getAddress())
                .licenseNumber(user.getLicenseNumber())
                .build();

        return ResponseEntity.ok(profileDto);
    }

    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profileDto, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // Fetch fresh from DB to avoid overriding session's stale object issues if any,
        // but userDetails.getPharmacyUser() might be sufficient. Let's fetch fresh.
        PharmacyUser user = pharmacyUserRepository.findById(java.util.Objects.requireNonNull(userDetails.getPharmacyUser().getId()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPharmacyName(profileDto.getPharmacyName());
        user.setMobileNo(profileDto.getMobileNo());
        user.setAddress(profileDto.getAddress());
        user.setLicenseNumber(profileDto.getLicenseNumber());
        // Note: Email typically shouldn't be changeable without verification, so we skip it here.
        
        PharmacyUser savedUser = pharmacyUserRepository.save(user);

        ProfileDto updatedProfileDto = ProfileDto.builder()
                .pharmacyName(savedUser.getPharmacyName())
                .email(savedUser.getEmail())
                .mobileNo(savedUser.getMobileNo())
                .address(savedUser.getAddress())
                .licenseNumber(savedUser.getLicenseNumber())
                .build();

        return ResponseEntity.ok(updatedProfileDto);
    }
}
