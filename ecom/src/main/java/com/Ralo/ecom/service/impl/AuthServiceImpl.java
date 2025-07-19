package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.config.JwtProvider;
import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.model.VerificationCode;
import com.Ralo.ecom.repository.CartRepository;
import com.Ralo.ecom.repository.SellerRepository;
import com.Ralo.ecom.repository.UserRepository;
import com.Ralo.ecom.repository.VerificationCodeRepository;
import com.Ralo.ecom.request.LoginRequest;
import com.Ralo.ecom.request.SignupRequest;
import com.Ralo.ecom.response.AuthResponse;
import com.Ralo.ecom.service.EmailService;
import com.Ralo.ecom.util.OtpUtil;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements com.Ralo.ecom.service.AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserDetailsService;
    private final SellerRepository sellerRepository;

    @Override
    public String createUser(SignupRequest signupRequest) throws Exception {
        List<VerificationCode> verificationCodes = verificationCodeRepository.findByEmail(signupRequest.getEmail());

        if (verificationCodes.isEmpty()) {
            throw new Exception("No OTP found for this email. Please request a new one.");
        }

        VerificationCode verificationCode = verificationCodes.getFirst();

        if (!verificationCode.getOtp().equals(signupRequest.getOtp())) {
            throw new Exception("Invalid OTP. Please check and try again.");
        }

        User user = userRepository.findByEmail(signupRequest.getEmail());

        if (user == null) {
            user = new User();
            user.setFullName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setRole(USER_ROLE.ROLE_CUSTOMER);
//            user.setMobile(); // Default/fake — consider removing
            user.setPassword(passwordEncoder.encode(signupRequest.getOtp()));
            user = userRepository.save(user);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);

            return "User created successfully";
        }

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(signupRequest.getEmail(), signupRequest.getOtp(), authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    @Override
    @Transactional
    public void sentLoginOtp(String email, USER_ROLE role) throws Exception {
        final String SIGNING_PREFIX = "signing_";
        System.out.println("\n\n\n\n\n\n" + role.toString() + " : " + email);
        if (email.startsWith(SIGNING_PREFIX)) {
            String actualEmail = email.substring(SIGNING_PREFIX.length());

            if (role == USER_ROLE.ROLE_SELLER) {
                Seller seller = sellerRepository.findByEmail(actualEmail);
                if (seller == null) throw new Exception("Seller not found with email " + actualEmail);
            } else {
                User user = userRepository.findByEmail(actualEmail);
                if (user == null) throw new Exception("User not found with email " + actualEmail);
            }
        }

        System.out.println("2");
        // Remove old OTPs for this email
        List<VerificationCode> existingCodes = verificationCodeRepository.findByEmail(email);
        for (VerificationCode code : existingCodes) {
            System.out.println("email: " + code.getEmail() + " otp: " + code.getOtp());
        }
        if (!existingCodes.isEmpty()) {
            verificationCodeRepository.deleteAll(existingCodes);
        }
        System.out.println("3");

        // Generate and store new OTP
        String otp = OtpUtil.generateOtp();
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setOtp(otp);
        System.out.println("email: " + verificationCode.getEmail() + " otp: " + verificationCode.getOtp() + " saved to db. Sending email... 5 seconds... 4... ");
        verificationCodeRepository.save(verificationCode);

        VerificationCode a = verificationCodeRepository.findByOtp(verificationCode.getOtp());
        System.out.println("readf" + a.getEmail() + " " + a.getOtp());

        System.out.println("4 verify email" + verificationCode.getEmail());
        // Send OTP
        String subject = "Login/Signup OTP for RaloEcom";
        String message = "Your login/Signup OTP is " + otp;
        emailService.sendVerificationOtpEmail(email, subject, message);
        System.out.println("5");
    }

    @Override
    public AuthResponse siginUser(LoginRequest loginRequest) throws Exception {
        String email = loginRequest.getEmail();
        String otp = loginRequest.getOtp();

//        System.out.println("in siginUser");
//        System.out.println("Email: " + email);
//        System.out.println("OTP: " + otp);

        Authentication authentication = authenticate(email, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);
//        System.out.println("b1");
        String token = jwtProvider.generateToken(authentication);

//        System.out.println("b2");
        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("User signed in successfully");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        response.setRole(roleName);

//        System.out.println("b3");
        return response;
    }

    private Authentication authenticate(String email, String otp) throws Exception {
        final String SELLER_PREFIX = "seller_";
//        System.out.println("inside authenticate " + email);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        if (userDetails == null) throw new BadCredentialsException("Invalid email or password.");

        if (email.startsWith(SELLER_PREFIX)) {
            email = email.substring(SELLER_PREFIX.length());
        }

        List<VerificationCode> codes = verificationCodeRepository.findByEmail(email);
        if (codes.isEmpty()) throw new Exception("No OTP found for this email. Please request a new one.");

        VerificationCode verificationCode = codes.getFirst();
        if (!verificationCode.getOtp().equals(otp)) {
            throw new Exception("Invalid OTP. Please check and try again.");
        }
        System.out.println("av");
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Override
    public void sendVerificationOtpEmail(String email, String otp, String subject, String message) throws MessagingException {
        String verificationLink = "http://localhost:3000/verify-seller/" + otp;
        String fullMessage = message + "\n\nClick here to verify your email: " + verificationLink;
        emailService.sendVerificationOtpEmail(email, subject, fullMessage);

    }
}