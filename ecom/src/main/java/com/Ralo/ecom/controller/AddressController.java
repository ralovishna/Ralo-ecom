package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Address;
import com.Ralo.ecom.model.User;
import com.Ralo.ecom.repository.AddressRepository;
import com.Ralo.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin("*")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

    // Get all addresses of the logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<Address>> getUserAddresses(@RequestHeader("Authorization") String token) throws Exception {
        User user = userService.findUserByJwtToken(token);
        List<Address> addresses = addressRepository.findByUser_Id(user.getId());
        return ResponseEntity.ok(addresses);
    }

    // Add a new address for the logged-in user
    @PostMapping("/add")
    public ResponseEntity<Address> addAddress(
            @RequestHeader("Authorization") String token,
            @RequestBody Address address
    ) throws Exception {
        User user = userService.findUserByJwtToken(token);
        address.setUser(user); // important!
        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }
}