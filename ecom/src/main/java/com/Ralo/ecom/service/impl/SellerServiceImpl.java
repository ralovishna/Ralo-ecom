package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.config.JwtProvider;
import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.domain.USER_ROLE;
import com.Ralo.ecom.exception.SellerException;
import com.Ralo.ecom.model.Address;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.VerificationCode;
import com.Ralo.ecom.repository.AddressRepository;
import com.Ralo.ecom.repository.SellerRepository;
import com.Ralo.ecom.repository.VerificationCodeRepository;
import com.Ralo.ecom.service.SellerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;
    private final VerificationCodeRepository verificationCodeRepository;

    @Override
    public Seller getSellerProfile(String token) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(token);

        return this.getSellerByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {
        Seller sellerExist = sellerRepository.findByEmail(seller.getEmail());

        if (sellerExist != null) {
            throw new Exception("Seller already exist with email " + seller.getEmail());
        }

        Address savedAddress = addressRepository.save(seller.getPickupAddress());

        Seller newSeller = new Seller();
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setEmail(seller.getEmail());
        newSeller.setMobile(seller.getMobile());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setEmailVerified(false);
        newSeller.setPickupAddress(savedAddress);
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setAccountStatus(AccountStatus.ACTIVE);
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());

        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller updateSeller(String token, Seller seller) throws Exception {
        Seller profile = getSellerProfile(token);
        Seller existingSeller = this.getSellerById(profile.getId());

        if (seller.getSellerName() != null) {
            existingSeller.setSellerName(seller.getSellerName());
        }

        if (seller.getMobile() != null) {
            existingSeller.setMobile(seller.getMobile());
        }

        if (seller.getEmail() != null) {
            existingSeller.setEmail(seller.getEmail());
        }

        if (seller.getBusinessDetails() != null && seller.getBusinessDetails().getBusinessName() != null) {
            existingSeller.getBusinessDetails().setBusinessName(seller.getBusinessDetails().getBusinessName());
        }

        if (seller.getBankDetails() != null && seller.getBankDetails().getAccountHolderName() != null
                && seller.getBankDetails().getAccountNumber() != null
                && seller.getBankDetails().getIfscCode() != null) {

            existingSeller.getBankDetails().setAccountHolderName(seller.getBankDetails().getAccountHolderName());
            existingSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
            existingSeller.getBankDetails().setIfscCode(seller.getBankDetails().getIfscCode());
        }

        if (seller.getPickupAddress() != null
                && seller.getPickupAddress().getAddress() != null
                && seller.getPickupAddress().getCity() != null
                && seller.getPickupAddress().getMobile() != null
                && seller.getPickupAddress().getState() != null) {

            existingSeller.getPickupAddress().setAddress(seller.getPickupAddress().getAddress());
            existingSeller.getPickupAddress().setCity(seller.getPickupAddress().getCity());
            existingSeller.getPickupAddress().setMobile(seller.getPickupAddress().getMobile());
            existingSeller.getPickupAddress().setState(seller.getPickupAddress().getState());
            existingSeller.getPickupAddress().setPinCode(seller.getPickupAddress().getPinCode());
        }

        if (seller.getGSTIN() != null) {
            existingSeller.setGSTIN(seller.getGSTIN());
        }

        return sellerRepository.save(existingSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepository.findById(id).orElseThrow(() -> new SellerException("Seller not found with id " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new Exception("Seller not found with email " + email);
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        System.out.println(status);
        List<Seller> sellers = sellerRepository.findByAccountStatus(status);
        for (Seller seller : sellers) {
            System.out.println(seller.getSellerName()+ " " +seller.getAccountStatus());
        }
        return sellers;
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller = this.getSellerById(id);
        sellerRepository.delete(seller);

    }

    @Override
    @Transactional
    public Seller verifyEmail(String otp) throws Exception {
        VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);
        if (verificationCode == null) {
            throw new Exception("Invalid OTP. Please check and try again.");
        }

        Seller seller = sellerRepository.findByEmail(verificationCode.getEmail());

        if (seller != null) {
            seller.setEmailVerified(true);
            seller.setAccountStatus(AccountStatus.ACTIVE);

            // Optionally delete the used OTP
            verificationCodeRepository.delete(verificationCode);

            return sellerRepository.save(seller);
        }
        throw new SellerException("Seller not found with email " + verificationCode.getEmail());
    }

    @Override
    public Seller updateSellerAccountStatus(Long id, AccountStatus status) throws Exception {
        Seller seller = this.getSellerById(id);
        seller.setAccountStatus(status);
        seller.setEmailVerified(true);
        return sellerRepository.save(seller);
    }

    @Override
    public void updateSellerStatus(Long id, AccountStatus status) throws SellerException {
        Seller seller = this.getSellerById(id);
        System.out.println("inside seller service update" + status +" " + seller.getAccountStatus());
        seller.setAccountStatus(status);
        sellerRepository.save(seller);
    }

    @Override
    public void createVerificationCode(String email, String otp) {
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setOtp(otp);
        System.out.println("Verification code generated: " + otp);
        verificationCodeRepository.save(verificationCode);
    }
}