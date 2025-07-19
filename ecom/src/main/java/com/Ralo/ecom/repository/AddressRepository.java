package com.Ralo.ecom.repository;

import com.Ralo.ecom.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<com.Ralo.ecom.model.Address, Long> {
    List<Address> findByUser_Id(Long userId);
}