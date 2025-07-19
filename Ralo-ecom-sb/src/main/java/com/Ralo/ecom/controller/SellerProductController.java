package com.Ralo.ecom.controller;

import com.Ralo.ecom.exception.ProductException;
import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.request.CreateOrUpdateProductRequest;
import com.Ralo.ecom.service.ProductService;
import com.Ralo.ecom.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class SellerProductController {

    private final SellerService sellerService;
    private final ProductService productService;

    @GetMapping

    public ResponseEntity<List<Product>> getProductsBySeller(@RequestHeader("Authorization") String token) throws Exception {
        Seller seller = sellerService.getSellerProfile(token);
        List<Product> products = productService.getProductsBySellerId(seller.getId());
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<Product> createProduct(@RequestBody CreateOrUpdateProductRequest request,
                                                 @RequestHeader("Authorization") String token) throws Exception {
        Seller seller = sellerService.getSellerProfile(token);
        Product product = productService.createProduct(request, seller);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestHeader("Authorization") String token,
                                                 @RequestBody CreateOrUpdateProductRequest updatedProduct) throws ProductException {
        Product product = productService.updateProduct(id, updatedProduct);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}