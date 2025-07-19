package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@org.springframework.stereotype.Component
@RequiredArgsConstructor
public class DataInitializationComponent implements org.springframework.boot.CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "krishnashyammalavia15030973@gmail.com";

        if (userRepository.findByEmail(adminUsername) == null) {
            User adminUser = new User();
            adminUser.setEmail(adminUsername);
            adminUser.setFullName("Krishna Shyam Malavia");
//            adminUser.setMobile("1234567890");
            adminUser.setPassword(passwordEncoder.encode("PASSWORD1234K"));
            adminUser.setRole(USER_ROLE.ROLE_ADMIN);

            User admin = userRepository.save(adminUser);
        }
    }

}