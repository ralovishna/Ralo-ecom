package com.Ralo.ecom.service;

import com.Ralo.ecom.exception.ProductException;
import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.request.CreateOrUpdateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Product createProduct(CreateOrUpdateProductRequest request, Seller seller);

    void deleteProduct(Long id);

    Product updateProduct(Long id, CreateOrUpdateProductRequest request) throws ProductException;

    Product findProductById(Long id) throws ProductException;

    Page<Product> searchProducts(
            String query,
            String category,
            String brand,
            String color,
            String size,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String stock,
            Pageable pageable
    );

    Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber,
            Integer pageSize // New: Add pageSize parameter here
    );

    List<Product> getProductsBySellerId(Long sellerId);
}