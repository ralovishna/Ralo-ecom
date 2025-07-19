package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.model.Wishlist;
import com.Ralo.ecom.repository.WishlistRepository;
import com.Ralo.ecom.service.WishlistService;

@org.springframework.stereotype.Service
@lombok.RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final WishlistRepository wishlistRepository;

    @Override
    public Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    @Override
    public Wishlist getWishlistByUser(User user) {
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId());

        if (wishlist == null) {
            wishlist = createWishlist(user);
        }

        return wishlist;
    }

    @Override
    public Wishlist addProductToWishlist(User user, Product product) {
        Wishlist wishlist = getWishlistByUser(user);

        if (wishlist.getProducts().contains(product)) {
            wishlist.getProducts().remove(product);
        } else {
            wishlist.getProducts().add(product);
        }

        return wishlistRepository.save(wishlist);
    }
}