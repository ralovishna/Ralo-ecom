package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Cart;
import com.Ralo.ecom.model.CartItem;
import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.request.AddItemRequest;
import com.Ralo.ecom.response.ApiResponse;
import com.Ralo.ecom.service.CartItemService;
import com.Ralo.ecom.service.CartService;
import com.Ralo.ecom.service.ProductService;
import com.Ralo.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@org.springframework.web.bind.annotation.RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String token) throws Exception {
        User user = userService.findUserByJwtToken(token);
        Cart cart = cartService.findUserCart(user);

        return ResponseEntity.ok(cart);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addCartItem(@RequestHeader("Authorization") String token, @RequestBody AddItemRequest addItemRequest) throws Exception {
        User user = userService.findUserByJwtToken(token);

        Product product = productService.findProductById(addItemRequest.getProductId());

        CartItem cartItem = cartService.addCartItem(user, product, addItemRequest.getSize(), addItemRequest.getQuantity());

        ApiResponse response = new ApiResponse();
        response.setMessage("Item added to cart successfully");

        return new ResponseEntity<>(cartItem, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItem(@RequestHeader("Authorization") String token, @PathVariable Long cartItemId) throws Exception {
        User user = userService.findUserByJwtToken(token);
        cartItemService.deleteCartItem(user.getId(), cartItemId);

        ApiResponse response = new ApiResponse();
        response.setMessage("Item deleted from cart successfully");

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(@RequestHeader("Authorization") String token, @PathVariable Long cartItemId, @RequestBody CartItem cartItem) throws Exception {
        User user = userService.findUserByJwtToken(token);

        CartItem item = null;
        if (cartItem.getQuantity() > 0) {
            item = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
        }
        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }
}