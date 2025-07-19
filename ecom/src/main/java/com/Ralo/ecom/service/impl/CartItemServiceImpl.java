package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.CartItem;
import com.Ralo.ecom.model.User;
import org.springframework.stereotype.Service;

@lombok.RequiredArgsConstructor
@Service
public class CartItemServiceImpl implements com.Ralo.ecom.service.CartItemService {
    private final com.Ralo.ecom.repository.CartItemRepository cartItemRepository;

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
        CartItem item = findCartItemById(id);

        User user = item.getCart().getUser();

        if (user.getId().equals(userId)) {
            item.setQuantity(cartItem.getQuantity());
            item.setMrpPrice((int) (item.getQuantity() * item.getProduct().getMrpPrice()));
            item.setSellingPrice((int) (item.getQuantity() * item.getProduct().getSellingPrice()));

            return cartItemRepository.save(item);
        }

        throw new Exception("You are not authorized to update this cart item");

    }

    @Override
    public void deleteCartItem(Long userId, Long cartItemId) throws Exception {
        CartItem item = findCartItemById(cartItemId);

        User user = item.getCart().getUser();

        if (user.getId().equals(userId)) {
            cartItemRepository.delete(item);
        } else throw new Exception("You are not authorized to delete this cart item");
    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {
        return cartItemRepository.findById(id).orElseThrow(() -> new Exception("Cart item not found with id " + id));
    }
}