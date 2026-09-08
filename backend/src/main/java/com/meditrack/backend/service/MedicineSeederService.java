package com.meditrack.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meditrack.backend.entity.Medicine;
import com.meditrack.backend.entity.PharmacyUser;
import com.meditrack.backend.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineSeederService {

    private final MedicineRepository medicineRepository;
    private final ObjectMapper objectMapper;

    public void seedNewUser(PharmacyUser newUser) {
        // Safety check: Do not seed if medicines already exist for this user
        long existingCount = medicineRepository.countByPharmacyUser(newUser);
        if (existingCount > 0) {
            return; // Abort seeding
        }

        try {
            ClassPathResource resource = new ClassPathResource("medicines.json");
            InputStream inputStream = resource.getInputStream();
            List<Medicine> medicines = objectMapper.readValue(inputStream, new TypeReference<List<Medicine>>() {});

            if (medicines != null) {
                for (Medicine medicine : medicines) {
                    medicine.setStockQuantity(0);
                    medicine.setPharmacyUser(newUser);
                }

                medicineRepository.saveAll(medicines);
            }
        } catch (Exception e) {
            // Log the error but don't fail the registration process
            System.err.println("Failed to seed medicines for user " + newUser.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
