package com.Ralo.ecom.repository;

import com.Ralo.ecom.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    List<VerificationCode> findByEmail(String email);

    VerificationCode findByOtp(String otp);
}