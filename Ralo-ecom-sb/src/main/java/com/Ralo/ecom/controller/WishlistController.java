package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.model.Wishlist;
import com.Ralo.ecom.service.ProductService;
import com.Ralo.ecom.service.UserService;
import com.Ralo.ecom.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@lombok.RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Wishlist> getWishlist(@RequestHeader("Authorization") String token) throws Exception {
        User user = userService.findUserByJwtToken(token);
        Wishlist wishlist = wishlistService.getWishlistByUser(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("add-product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(@RequestHeader("Authorization") String token, @PathVariable Long productId) throws Exception {
        User user = userService.findUserByJwtToken(token);
        Product product = productService.findProductById(productId);
        Wishlist wishlist = wishlistService.addProductToWishlist(user, product);
        return ResponseEntity.ok(wishlist);
    }
}