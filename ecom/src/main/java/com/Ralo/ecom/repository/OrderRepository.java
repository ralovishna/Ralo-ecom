package com.Ralo.ecom.repository;

import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.domain.PaymentStatus;
import com.Ralo.ecom.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findBySellerId(Long sellerId);

    @Query("SELECT SUM(o.totalSellingPrice) FROM Order o WHERE o.status <> :excludedStatus")
    Long getTotalRevenue(@Param("excludedStatus") OrderStatus excludedStatus);


    Long countByStatus(OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    long countByOrderDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.orderDate BETWEEN :start AND :end")
    long countByStatusAndOrderDateBetween(@Param("status") OrderStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.totalSellingPrice), 0) FROM Order o WHERE o.paymentStatus = 2 AND o.orderDate BETWEEN :start AND :end")
    double sumTotalSellingPriceByPaymentStatusAndOrderDateBetween(@Param("status") PaymentStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.discount), 0) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    double sumDiscountByOrderDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.deliveryDate > :now AND o.status != 4")
    long countByDeliveryDateAfterAndStatusNot(@Param("now") LocalDateTime now, @Param("status") OrderStatus status);

    @Query("SELECT SUM(o.totalSellingPrice) FROM Order o WHERE o.orderDate BETWEEN :start AND :end AND o.status != :status")
    Double sumTotalSellingPriceByOrderDateBetweenAndStatusNot(LocalDateTime start, LocalDateTime end, OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :start AND :end AND o.status != :status")
    Long countByOrderDateBetweenAndStatusNot(LocalDateTime start, LocalDateTime end, OrderStatus status);

    @Query("SELECT SUM(o.totalSellingPrice) FROM Order o WHERE o.sellerId = :sellerId AND o.orderDate BETWEEN :start AND :end AND o.status != :status")
    Double sumTotalSellingPriceBySellerIdAndOrderDateBetweenAndStatusNot(Long sellerId, LocalDateTime start, LocalDateTime end, OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.sellerId = :sellerId AND o.orderDate BETWEEN :start AND :end AND o.status != :status")
    Long countBySellerIdAndOrderDateBetweenAndStatusNot(Long sellerId, LocalDateTime start, LocalDateTime end, OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.sellerId = :sellerId AND o.status = :status")
    Long countBySellerIdAndStatus(Long sellerId, OrderStatus status);
}