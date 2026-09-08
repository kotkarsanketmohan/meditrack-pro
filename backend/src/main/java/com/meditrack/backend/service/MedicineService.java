package com.meditrack.backend.service;

import com.meditrack.backend.entity.Medicine;
import com.meditrack.backend.entity.PharmacyUser;
import com.meditrack.backend.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    
    // Cache: PharmacyUser ID -> List of Medicines
    private final Map<Long, List<Medicine>> inventoryCache = new ConcurrentHashMap<>();

    public List<Medicine> getInventory(PharmacyUser user) {
        return inventoryCache.computeIfAbsent(user.getId(), k -> medicineRepository.findByPharmacyUser(user));
    }

    public void invalidateCache(PharmacyUser user) {
        inventoryCache.remove(user.getId());
    }

    public List<Medicine> getLowStockAlerts(PharmacyUser user) {
        List<Medicine> allMedicines = getInventory(user);
        return allMedicines.stream()
                .filter(m -> m.getStockQuantity() != null && m.getStockQuantity() <= 15 && !m.isAlertIgnored())
                .collect(Collectors.toList());
    }

    public void ignoreAlert(Long medicineId, PharmacyUser user) {
        if (medicineId == null) {
            throw new IllegalArgumentException("medicineId must not be null");
        }
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        if (!medicine.getPharmacyUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        medicine.setAlertIgnored(true);
        medicineRepository.save(medicine);

        // Update the cache instantly
        invalidateCache(user);
    }

    public int bulkUpdateStock(Map<Long, Integer> updates, PharmacyUser user) {
        List<Medicine> toSave = new java.util.ArrayList<>();
        for (Map.Entry<Long, Integer> entry : updates.entrySet()) {
            Long medicineId = entry.getKey();
            Integer quantityToAdd = entry.getValue();
            if (medicineId != null && quantityToAdd != null && quantityToAdd > 0) {
                medicineRepository.findById(medicineId).ifPresent(medicine -> {
                    if (medicine.getPharmacyUser().getId().equals(user.getId())) {
                        medicine.setStockQuantity(medicine.getStockQuantity() + quantityToAdd);
                        toSave.add(medicine);
                    }
                });
            }
        }
        if (!toSave.isEmpty()) {
            medicineRepository.saveAll(toSave);
            invalidateCache(user);
        }
        return toSave.size();
    }
}
