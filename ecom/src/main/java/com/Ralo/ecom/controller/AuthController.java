package com.Ralo.ecom.controller;

import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.request.LoginOtpRequest;
import com.Ralo.ecom.request.LoginRequest;
import com.Ralo.ecom.request.SignupRequest;
import com.Ralo.ecom.response.ApiResponse;
import com.Ralo.ecom.response.AuthResponse;
import com.Ralo.ecom.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest request) throws Exception {
        String jwt = authService.createUser(request);

        AuthResponse response = new AuthResponse();
        response.setJwt(jwt);
        response.setMessage("User created successfully");
        response.setRole("ROLE_CUSTOMER");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sentOtpHandler(@RequestBody LoginOtpRequest request) throws Exception {
        System.out.println(request.getRole() + " otp sent to " + request.getEmail() + " successfully");
        if ("krishnashyammalavia15030973@gmail.com".equals(request.getEmail()))
            authService.sentLoginOtp(request.getEmail(), USER_ROLE.ROLE_ADMIN);
        else
            authService.sentLoginOtp(request.getEmail(), request.getRole());

        ApiResponse response = new ApiResponse();
        response.setMessage("Otp sent successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) throws Exception {
//        authService.sentLoginOtp(request.getEmail());

        AuthResponse response = authService.siginUser(request);

        return ResponseEntity.ok(response);
    }
}