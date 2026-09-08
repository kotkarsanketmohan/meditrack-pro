package com.meditrack.backend.repository;

import com.meditrack.backend.entity.PharmacyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PharmacyUserRepository extends JpaRepository<PharmacyUser, Long> {
    Optional<PharmacyUser> findByEmail(String email);
    Optional<PharmacyUser> findByVerificationToken(String verificationToken);
    List<PharmacyUser> findByEnabledFalseAndCreatedAtBefore(java.time.LocalDateTime cutoff);
}
