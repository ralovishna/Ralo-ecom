package com.Ralo.ecom.repository;

import com.Ralo.ecom.model.HomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomeCategoryRepository extends JpaRepository<HomeCategory, Long> {
}