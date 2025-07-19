package com.Ralo.ecom.config;

import org.jetbrains.annotations.Contract;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - accessible without authentication
                        .requestMatchers(
                                "/auth/**",
                                "/sellers/login",       // ✅ allow seller OTP login
                                "/sellers",             // ✅ allow seller signup
                                "/sellers/verify/**",   // ✅ allow seller email OTP verification
                                "/products/**",
                                "/api/products/*/reviews"
                        ).permitAll()
                        .requestMatchers("/api/**").authenticated()
                        // Any other request not explicitly matched above - should be last
                        .anyRequest().permitAll()) // If you want to make all other unmatched paths public, or change to .authenticated()
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class) // Your custom JWT filter
                .csrf(csrf -> csrf.disable()) // Disable CSRF for Stateless API (common for JWT)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())); // Apply CORS config from the bean

        return http.build();
    }

    // Define the CORS Configuration Source
    @Bean // Make this a @Bean so it can be managed by Spring and used by http.cors()
    @Contract(" -> new")
    public CorsConfigurationSource corsConfigurationSource() { // Changed to public to be a Bean
        return request -> {
            CorsConfiguration cors = new CorsConfiguration();
            cors.setAllowedOrigins(List.of("http://localhost:3000")); // Specific origin for frontend
            cors.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")); // Explicitly list methods
            cors.setAllowedHeaders(Collections.singletonList("*")); // Allow all headers
            cors.setAllowCredentials(true); // Allow cookies/auth headers
            cors.setExposedHeaders(List.of("Authorization")); // Add any headers your frontend needs to read from the response
            cors.setMaxAge(3600L); // Max age of the CORS pre-flight request result (in seconds)

            return cors;
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}