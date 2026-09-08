package com.meditrack.backend.controller;

import com.meditrack.backend.dto.CheckoutItemDto;
import com.meditrack.backend.dto.CheckoutRequest;
import com.meditrack.backend.entity.BillItem;
import com.meditrack.backend.entity.Medicine;
import com.meditrack.backend.entity.PatientHistory;
import com.meditrack.backend.repository.MedicineRepository;
import com.meditrack.backend.repository.PatientHistoryRepository;
import com.meditrack.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final PatientHistoryRepository patientHistoryRepository;
    private final MedicineRepository medicineRepository;

    @GetMapping
    public ResponseEntity<List<PatientHistory>> getTransactions(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<PatientHistory> histories = patientHistoryRepository.findByPharmacyUserOrderByPurchaseDateDesc(userDetails.getPharmacyUser());
        return ResponseEntity.ok(histories);
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        PatientHistory history = PatientHistory.builder()
                .patientName(request.getPatientName())
                .purchaseDate(LocalDateTime.now())
                .totalAmount(request.getTotalAmount())
                .pharmacyUser(userDetails.getPharmacyUser())
                .items(new ArrayList<>())
                .build();

        for (CheckoutItemDto itemDto : request.getItems()) {
            Long medicineId = itemDto.getMedicineId();
            if (medicineId == null) {
                throw new IllegalArgumentException("Medicine ID cannot be null");
            }
            Medicine medicine = medicineRepository.findById(medicineId)
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            if (medicine.getStockQuantity() < itemDto.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for " + medicine.getName());
            }

            // Deduct stock
            medicine.setStockQuantity(medicine.getStockQuantity() - itemDto.getQuantity());
            medicineRepository.save(medicine);

            // Add bill item
            BillItem billItem = BillItem.builder()
                    .quantity(itemDto.getQuantity())
                    .priceAtTimeOfSale(medicine.getPrice())
                    .patientHistory(history)
                    .medicine(medicine)
                    .build();

            history.getItems().add(billItem);
        }

        @SuppressWarnings("null")
        PatientHistory savedHistory = patientHistoryRepository.save(history);
        return ResponseEntity.ok(savedHistory);
    }
}
