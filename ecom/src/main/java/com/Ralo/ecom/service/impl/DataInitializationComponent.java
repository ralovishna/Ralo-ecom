package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializationComponent implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        // Fetch from environment variables or fallback
        String adminEmail = System.getenv("ADMIN_EMAIL");
        String adminPassword = System.getenv("ADMIN_PASSWORD");

        if (adminEmail == null || adminPassword == null) {
            log.warn("Admin user not created: Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variable.");
            return;
        }

        if (userRepository.findByEmail(adminEmail) == null) {
            User adminUser = new User();
            adminUser.setEmail(adminEmail);
            adminUser.setFullName("System Admin");
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(USER_ROLE.ROLE_ADMIN);

            userRepository.save(adminUser);
            log.info("✅ Admin user initialized with email: {}", adminEmail);
        } else {
            log.info("ℹ️ Admin user already exists with email: {}", adminEmail);
        }
    }
}
