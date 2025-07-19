package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.model.Wishlist;

public interface WishlistService {
    Wishlist createWishlist(User user);

    Wishlist getWishlistByUser(User user);

    Wishlist addProductToWishlist(User user, Product product);
}