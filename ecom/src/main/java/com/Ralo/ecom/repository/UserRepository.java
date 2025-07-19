package com.Ralo.ecom.repository;

import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface UserRepository extends JpaRepository<com.Ralo.ecom.model.User, Long> {
    User findByEmail(String email);

    long countByRole(USER_ROLE role);

    long countByRoleAndCreatedAtBetween(USER_ROLE role, LocalDateTime start, LocalDateTime end);
}