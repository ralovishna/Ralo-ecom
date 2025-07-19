package com.Ralo.ecom.repository;

import com.Ralo.ecom.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findAllBySellerId(Long sellerId);

    //    @Query("SELECT p FROM Product p " +
//            "LEFT JOIN p.category c " +
//            "LEFT JOIN c.parentCategory pc " +
//            "WHERE (:query IS NULL OR LOWER(COALESCE(p.title, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
//            "(:query IS NULL OR LOWER(COALESCE(p.description, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
//            "(:query IS NULL OR LOWER(COALESCE(p.brand, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
//            "(:query IS NULL OR LOWER(COALESCE(p.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
//            "(:query IS NULL OR CAST(c.id AS STRING) LIKE CONCAT('%', :query, '%')) OR " +
//            "(:query IS NULL OR LOWER(COALESCE(c.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
//            "(:query IS NULL OR LOWER(COALESCE(pc.name, '')) LIKE LOWER(CONCAT('%', :query, '%')))")
//    List<Product> searchProduct(@Param("query") String query);
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.category c " +
            "LEFT JOIN c.parentCategory pc " +
            "WHERE (:query IS NULL OR LOWER(COALESCE(p.title, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "(:query IS NULL OR LOWER(COALESCE(p.description, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "(:query IS NULL OR LOWER(COALESCE(p.brand, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "(:query IS NULL OR LOWER(COALESCE(p.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "(:query IS NULL OR CAST(c.id AS STRING) LIKE CONCAT('%', :query, '%')) OR " +
            "(:query IS NULL OR LOWER(COALESCE(c.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "(:query IS NULL OR LOWER(COALESCE(pc.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:category IS NULL OR c.categoryId = :category OR pc.categoryId = :category) " +
            "AND (:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) " +
            "AND (:color IS NULL OR p.color = :color) " +
            "AND (:size IS NULL OR p.size = :size) " +
            "AND (:minPrice IS NULL OR p.sellingPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.sellingPrice <= :maxPrice) " +
            "AND (:minDiscount IS NULL OR p.discount >= :minDiscount) " +
            "AND (:stock IS NULL OR (:stock = 'in_stock' AND p.quantity > 0) OR (:stock = 'out_of_stock' AND p.quantity = 0))")
    Page<Product> searchProduct(
            @Param("query") String query,
            @Param("category") String category,
            @Param("brand") String brand,
            @Param("color") String color,
            @Param("size") String size,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minDiscount") Integer minDiscount,
            @Param("stock") String stock,
            Pageable pageable
    );

    long countByQuantityLessThan(int i);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.seller.id = :id AND p.quantity > 0")
    Long countBySellerAndStockGreaterThan(Long id, Integer quantity);
}