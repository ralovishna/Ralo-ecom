package com.Ralo.ecom.controller;

import com.Ralo.ecom.exception.ProductException;
import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.response.ApiResponse;
import com.Ralo.ecom.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {
    public final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(defaultValue = "0") Integer pageNumber, // Frontend sends 0-indexed pageNumber
            @RequestParam(defaultValue = "10") Integer pageSize    // New: Add pageSize parameter with default
    ) {
        return ResponseEntity.ok(
                productService.getAllProducts(category, brand, color, size, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<ApiResponse> deleteProduct(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) throws ProductException {
        productService.deleteProduct(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Product deleted successfully");
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) throws ProductException {
        Product product = productService.findProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String query) {
//        if (query == null || query.trim().isEmpty()) {
//            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
//        }
//        List<Product> products = productService.searchProducts(query);
//        return new ResponseEntity<>(products, HttpStatus.OK);
//    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String stock,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "12") Integer pageSize,
            @RequestParam(required = false) String sort
    ) {
        Sort sortOrder = resolveSort(sort);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sortOrder);
        Page<Product> products = productService.searchProducts(
                query, category, brand, color, size, minPrice, maxPrice, minDiscount, stock, pageable
        );
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    private Sort resolveSort(String sort) {
        if (sort == null) return Sort.unsorted();
        return switch (sort.toLowerCase()) {
            case "price_low" -> Sort.by("sellingPrice").ascending();
            case "price_high" -> Sort.by("sellingPrice").descending();
            case "latest" -> Sort.by("createdAt").descending();
            case "discount" -> Sort.by("discount").descending();
            case "rating" -> Sort.by("numRating").descending();
            default -> Sort.unsorted();
        };
    }
}