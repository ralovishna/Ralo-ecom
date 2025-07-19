package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.OrderStatus;
import com.Ralo.ecom.domain.PaymentStatus;
import com.Ralo.ecom.model.*;
import com.Ralo.ecom.repository.AddressRepository;
import com.Ralo.ecom.repository.CartRepository;
import com.Ralo.ecom.repository.OrderItemRepository;
import com.Ralo.ecom.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@lombok.RequiredArgsConstructor
@Service
public class OrderServiceImpl implements com.Ralo.ecom.service.OrderService {
    private final com.Ralo.ecom.repository.OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @Override // Ensure this matches your interface method signature precisely
    @Transactional // This is crucial! All operations within this method will be in one session.
    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

        // --- STEP 1: Ensure User entity is MANAGED ---
        // The 'user' parameter here might be detached if it came from findUserByJwtToken
        // outside of this transactional context. Re-fetch it to ensure it's managed.
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found for order creation"));


        // --- STEP 2: Handle Shipping Address ---
        // The 'shippingAddress' passed here is a DTO or a detached entity.
        // We need to decide if it's a new address to be saved or an existing one to be re-attached.
        Address managedShippingAddress;
        if (shippingAddress.getId() != null) {
            // It's an existing address. Fetch it to make it managed by the current session.
            managedShippingAddress = addressRepository.findById(shippingAddress.getId())
                    .orElseThrow(() -> new RuntimeException("Shipping address not found with ID: " + shippingAddress.getId()));

            // Optional: If the client can update address details, copy them here:
            // managedShippingAddress.setName(shippingAddress.getName());
            // managedShippingAddress.setLocality(shippingAddress.getLocality());
            // ... copy other fields if necessary
        } else {
            // It's a brand new address that needs to be persisted.
            // Assign the MANAGED User to this new address before saving it.
            shippingAddress.setUser(managedUser);
            managedShippingAddress = addressRepository.save(shippingAddress); // This will persist the new address
        }

        // --- STEP 3: Update User's addresses collection (if bidirectional) ---
        // If your User entity has a @OneToMany(mappedBy="user", cascade = CascadeType.ALL)
        // it's a good practice to ensure consistency by adding the managed address to the user's collection.
        // However, if the address is already existing, it should already be in the user's collection.
        // This line is often more relevant for NEW addresses, or if you strictly manage
        // both sides of the relationship manually.
        // You might consider adding `managedShippingAddress` to `managedUser.getAddresses()`
        // IF and ONLY IF it's a new address or you need to ensure the collection is fresh.
        // The `save(order)` will handle the association correctly because `order.setShippingAddress` uses a managed `Address`.
        // If `User.addresses` has `cascade = CascadeType.PERSIST` or `ALL`, adding a detached entity there would cause issues.
        // Since we're now working with a `managedShippingAddress`, this line is safe if needed, but often not strictly required
        // if the relationship is handled primarily by setting the Address on the Order.
        // However, it's good for ensuring collection consistency if you explicitly access user.getAddresses() elsewhere.
        // To be safe and avoid re-adding if it's an existing address:
        if (shippingAddress.getId() == null) { // Only add if it was a newly created address
            managedUser.getAddresses().add(managedShippingAddress);
            // userRepository.save(managedUser); // Only needed if User changes need to be flushed immediately
        }


        // --- Rest of your logic (already good, just using managed entities) ---
        Map<Long, List<CartItem>> itemsBySeller = cart.getCartItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));

        Set<Order> orders = new HashSet<>();

        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> cartItems = entry.getValue();

            int totalOrderPrice = cartItems.stream().mapToInt(CartItem::getSellingPrice).sum();
            int totalOrderQuantity = cartItems.stream().mapToInt(CartItem::getQuantity).sum();

            Order order = new Order();
            order.setUser(managedUser); // Use the MANAGED User
            order.setSellerId(sellerId);
            order.setTotalMrpPrice(totalOrderPrice);
            order.setTotalSellingPrice(totalOrderPrice);
            order.setShippingAddress(managedShippingAddress); // Use the MANAGED Address
            order.setTotalQuantity(totalOrderQuantity);
            order.setStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);

            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem cartItem : cartItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order); // ✅ very important
                orderItem.setProduct(cartItem.getProduct()); // Ensure Product is also managed if OrderItem cascades
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setMrpPrice(cartItem.getMrpPrice());
                orderItem.setSellingPrice(cartItem.getSellingPrice());
                orderItem.setSize(cartItem.getSize());
                orderItem.setUserId(managedUser.getId()); // Use managedUser ID
                orderItems.add(orderItem);
            }
            order.setShippingAddress(shippingAddress);
            order.setOrderItems(orderItems);
            Order savedOrder = orderRepository.save(order); // ✅ saves both order & items via cascade
            orders.add(savedOrder);
        }

        // --- STEP 4: Clear the Cart AFTER all orders are successfully saved ---
        // The 'cart' object passed as a parameter should ideally be the managed cart.
        // If your createOrder method receives a detached cart, you might need to re-fetch it:
        // Cart managedCart = cartRepository.findById(cart.getId()).orElseThrow(...);
        // Then delete the managedCart.
        // However, if the `cart` parameter itself is a managed entity from within the current
        // transaction (e.g., if it was loaded earlier in a transactional service method that
        // called this one), then `cartRepository.delete(cart);` is fine.
        cartRepository.delete(cart);

        return orders;
    }


    @Override
    public Order findOrderById(Long id) throws Exception {
        return orderRepository.findById(id).orElseThrow(() -> new Exception("Order not found with id " + id));
    }

    @Override
    public List<Order> userOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getSellersOrder(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        order.setStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    public Order CancelOrder(Long orderId, User user) throws Exception {
        Order order = findOrderById(orderId);

        if (!Objects.equals(order.getUser().getId(), user.getId())) {
            throw new Exception("You are not authorized to cancel this order");
        }
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);

    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepository.findById(id).orElseThrow(() -> new Exception("Order item not found with id " + id));
    }
}