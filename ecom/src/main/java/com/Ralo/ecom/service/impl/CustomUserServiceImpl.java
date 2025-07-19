package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.SellerRepository;
import com.Ralo.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements UserDetailsService {
    private static final String SELLER_PREFIX = "seller_";
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Loading user by email: " + email);
        if (email.startsWith(SELLER_PREFIX)) {
            String actualEmail = email.substring(SELLER_PREFIX.length());

            Seller seller = sellerRepository.findByEmail(actualEmail);

            if (seller != null) {
                System.out.println("good seller");
                return buildUserDetails(seller.getEmail(), seller.getPassword(), USER_ROLE.ROLE_SELLER);
            }
            System.out.println("bad seller");
            throw new UsernameNotFoundException("Seller not found with email in custom user service " + email);
        } else {
            User user = userRepository.findByEmail(email);
            if (user != null) {
                System.out.println("good user");
                return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
            }
            System.out.println("bad user");
            throw new UsernameNotFoundException("user not found with email in custom user service " + email);
        }
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        if (role == null) {
            role = USER_ROLE.ROLE_CUSTOMER;
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.toString()));

        return new org.springframework.security.core.userdetails.User(email, password, authorities);
    }
}