package com.meditrack.backend.controller;

import com.meditrack.backend.entity.Medicine;
import com.meditrack.backend.repository.MedicineRepository;
import com.meditrack.backend.security.CustomUserDetails;
import com.meditrack.backend.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineRepository medicineRepository;
    private final MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<Medicine>> getMedicines(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<Medicine> medicines = medicineRepository.findByPharmacyUser(userDetails.getPharmacyUser());
        return ResponseEntity.ok(medicines);
    }

    @PostMapping
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        String normalizedName = medicine.getName() != null ? medicine.getName().trim().toLowerCase() : "";
        Optional<Medicine> existingOpt = medicineRepository.findByPharmacyUserAndNameIgnoreCase(userDetails.getPharmacyUser(), normalizedName);
        
        if (existingOpt.isPresent()) {
            Medicine existing = existingOpt.get();
            int newQuantity = existing.getStockQuantity() + (medicine.getStockQuantity() != null ? medicine.getStockQuantity() : 0);
            existing.setStockQuantity(newQuantity);
            Medicine savedMedicine = medicineRepository.save(existing);
            medicineService.invalidateCache(userDetails.getPharmacyUser());
            return ResponseEntity.ok(savedMedicine);
        } else {
            medicine.setPharmacyUser(userDetails.getPharmacyUser());
            medicine.setName(toTitleCase(normalizedName));
            Medicine savedMedicine = medicineRepository.save(medicine);
            medicineService.invalidateCache(userDetails.getPharmacyUser());
            return ResponseEntity.ok(savedMedicine);
        }
    }

    @PutMapping("/{id}/add-stock")
    public ResponseEntity<Medicine> addStock(@PathVariable @NonNull Long id, @RequestBody Map<String, Integer> payload, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Optional<Medicine> existingOpt = medicineRepository.findById(id);
        
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Medicine existing = existingOpt.get();
        if (!existing.getPharmacyUser().getId().equals(userDetails.getPharmacyUser().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Integer quantityToAdd = payload.get("quantityToAdd");
        if (quantityToAdd != null && quantityToAdd > 0) {
            existing.setStockQuantity(existing.getStockQuantity() + quantityToAdd);
            Medicine saved = medicineRepository.save(existing);
            medicineService.invalidateCache(userDetails.getPharmacyUser());
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/bulk-update-stock")
    public ResponseEntity<?> bulkUpdateStock(@RequestBody Map<Long, Integer> payload, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        int updatedCount = medicineService.bulkUpdateStock(payload, userDetails.getPharmacyUser());
        return ResponseEntity.ok(Map.of("message", "Successfully updated " + updatedCount + " medicines!"));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStock(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(medicineService.getLowStockAlerts(userDetails.getPharmacyUser()));
    }

    @PutMapping("/{id}/ignore-alert")
    public ResponseEntity<?> ignoreAlert(@PathVariable Long id, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        try {
            medicineService.ignoreAlert(id, userDetails.getPharmacyUser());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    private String toTitleCase(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        StringBuilder titleCase = new StringBuilder(input.length());
        boolean nextTitleCase = true;

        for (char c : input.toCharArray()) {
            if (Character.isSpaceChar(c)) {
                nextTitleCase = true;
            } else if (nextTitleCase) {
                c = Character.toUpperCase(c);
                nextTitleCase = false;
            } else {
                c = Character.toLowerCase(c);
            }
            titleCase.append(c);
        }

        return titleCase.toString();
    }
}
