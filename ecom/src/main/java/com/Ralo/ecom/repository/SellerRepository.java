package com.Ralo.ecom.repository;

import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellerRepository extends JpaRepository<com.Ralo.ecom.model.Seller, Long> {
    Seller findByEmail(String actualUsername);

    List<Seller> findByAccountStatus(AccountStatus status);

    long countByAccountStatus(AccountStatus accountStatus);
}