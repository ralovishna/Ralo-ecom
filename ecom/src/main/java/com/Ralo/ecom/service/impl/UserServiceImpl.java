package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.config.JwtProvider;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.UserRepository;
import com.Ralo.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    public User findUserByJwtToken(String token) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(token);

        User user = this.findUserByEmail(email);

        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new Exception("User not found with email " + email);
        }

        return user;
    }
}