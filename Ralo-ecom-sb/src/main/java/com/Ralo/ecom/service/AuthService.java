package com.Ralo.ecom.service;

import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.request.LoginRequest;
import com.Ralo.ecom.request.SignupRequest;
import com.Ralo.ecom.response.AuthResponse;
import jakarta.mail.MessagingException;

public interface AuthService {
    String createUser(SignupRequest signupRequest) throws Exception;

    void sentLoginOtp(String email, USER_ROLE role) throws Exception;

    AuthResponse siginUser(LoginRequest loginRequest) throws Exception;

    void sendVerificationOtpEmail(String email, String otp, String subject, String message) throws MessagingException;
}