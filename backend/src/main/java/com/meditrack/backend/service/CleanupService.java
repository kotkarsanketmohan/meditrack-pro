package com.meditrack.backend.service;

import com.meditrack.backend.entity.PharmacyUser;
import com.meditrack.backend.repository.MedicineRepository;
import com.meditrack.backend.repository.PatientHistoryRepository;
import com.meditrack.backend.repository.PharmacyUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupService {

    private final PharmacyUserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final PatientHistoryRepository historyRepository;

    @Scheduled(cron = "0 0 * * * *") // Runs every hour at minute 0
    @Transactional
    public void cleanupUnverifiedAccounts() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        List<PharmacyUser> unverified = userRepository.findByEnabledFalseAndCreatedAtBefore(cutoff);
        
        if (!unverified.isEmpty()) {
            log.info("Found {} unverified accounts older than 24 hours. Deleting...", unverified.size());
            for (PharmacyUser user : unverified) {
                medicineRepository.deleteByPharmacyUser(user);
                historyRepository.deleteByPharmacyUser(user);
                userRepository.delete(user);
                log.info("Deleted unverified account: {}", user.getEmail());
            }
        }
    }
}
