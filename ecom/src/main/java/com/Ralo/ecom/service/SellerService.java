package com.Ralo.ecom.service;

import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.exception.SellerException;
import com.Ralo.ecom.model.Seller;

import java.util.List;

public interface SellerService {
    Seller getSellerProfile(String token) throws Exception;

    Seller createSeller(Seller seller) throws Exception;

    Seller updateSeller(String token, Seller seller) throws Exception;

    Seller getSellerById(Long id) throws SellerException;

    Seller getSellerByEmail(String email) throws Exception;

    List<Seller> getAllSellers(AccountStatus status);

    void deleteSeller(Long id) throws Exception;

    Seller verifyEmail(String otp) throws Exception;

    Seller updateSellerAccountStatus(Long id, AccountStatus status) throws Exception;

    void updateSellerStatus(Long id, AccountStatus status) throws SellerException;

    void createVerificationCode(String email, String otp);
}