package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.CartItem;
import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.User;

public interface CartService {
    CartItem addCartItem(
            User user,
            Product product,
            String size,
            int quantity
    );

    Cart findUserCart(User user);
}