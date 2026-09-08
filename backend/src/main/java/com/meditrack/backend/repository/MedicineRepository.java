package com.meditrack.backend.repository;

import com.meditrack.backend.entity.Medicine;
import com.meditrack.backend.entity.PharmacyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByPharmacyUser(PharmacyUser pharmacyUser);
    long countByPharmacyUser(PharmacyUser pharmacyUser);
    Optional<Medicine> findByPharmacyUserAndNameIgnoreCase(PharmacyUser pharmacyUser, String name);
    void deleteByPharmacyUser(PharmacyUser pharmacyUser);
}
