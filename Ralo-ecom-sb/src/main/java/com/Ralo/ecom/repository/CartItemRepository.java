package com.Ralo.ecom.repository;

import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.CartItem;
import com.Ralo.ecom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}