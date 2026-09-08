package com.meditrack.backend.repository;

import com.meditrack.backend.entity.PatientHistory;
import com.meditrack.backend.entity.PharmacyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface PatientHistoryRepository extends JpaRepository<PatientHistory, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.medicine"})
    List<PatientHistory> findByPharmacyUserOrderByPurchaseDateDesc(PharmacyUser pharmacyUser);
    long countByPharmacyUser(PharmacyUser pharmacyUser);
    List<PatientHistory> findByPharmacyUserAndPurchaseDateBetween(PharmacyUser pharmacyUser, LocalDateTime startDate, LocalDateTime endDate);
    void deleteByPharmacyUser(PharmacyUser pharmacyUser);
}
