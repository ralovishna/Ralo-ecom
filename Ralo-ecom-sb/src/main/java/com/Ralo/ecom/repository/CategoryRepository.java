package com.Ralo.ecom.repository;

import com.Ralo.ecom.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByCategoryId(String category);

//    @Query("SELECT new com.Ralo.ecom.model.AdminDashboardStats$CategoryStats(c.name, COALESCE(SUM(o.totalSellingPrice), 0), COUNT(DISTINCT o.id)) " +
//            "FROM Order o JOIN o.orderItems oi JOIN oi.product p JOIN p.category c " +
//            "WHERE o.paymentStatus = 'COMPLETED' AND o.orderDate BETWEEN :start AND :end " +
//            "GROUP BY c.name ORDER BY SUM(o.totalSellingPrice) DESC")
//    List<AdminDashboardStats.CategoryStats> findTopCategoriesByRevenue(
//            @Param("start") LocalDateTime start,
//            @Param("end") LocalDateTime end,
//            @Param("limit") int limit
//    );
}