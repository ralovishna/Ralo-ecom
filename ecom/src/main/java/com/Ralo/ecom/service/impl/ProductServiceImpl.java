package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.exception.ProductException;
import com.Ralo.ecom.model.Category;
import com.Ralo.ecom.model.Product;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.repository.CategoryRepository;
import com.Ralo.ecom.repository.ProductRepository;
import com.Ralo.ecom.repository.SellerRepository;
import com.Ralo.ecom.request.CreateOrUpdateProductRequest;
import com.Ralo.ecom.service.ProductService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    // private static final int PAGE_SIZE = 10; // Removed, now dynamic

    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateOrUpdateProductRequest request, Seller seller) {
        // ... (existing createProduct method - no changes needed here)
        // Create or retrieve nested categories
        Category category = getOrCreateCategory(request.getCategory(), null, 1);
        Category category2 = getOrCreateCategory(request.getCategory2(), category, 2);
        Category category3 = getOrCreateCategory(request.getCategory3(), category2, 3);

        int discountPercentage = calculateDiscountPercentage(request.getMrpPrice(), request.getSellingPrice());
        // brand, quantity
        Product product = new Product();
        product.setName(request.getTitle());
        product.setNumRating(0);
        product.setSeller(seller);
        product.setCategory(category3); // Ensure this is the most specific category
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCreatedAt(LocalDate.now());
        product.setColor(request.getColor());
        product.setReviews(new ArrayList<>());
        product.setMrpPrice(request.getMrpPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setSize(request.getSize());
        product.setImages(request.getImages());
        product.setDiscount(discountPercentage);

        log.info("Creating product: {}", product.getTitle());

        return productRepository.save(product);
    }

    private Category getOrCreateCategory(String categoryId, Category parentCategory, int level) {
        if (!StringUtils.hasText(categoryId)) {
            // Depending on your application logic, you might want to return null or throw an exception
            // if a categoryId is optional. But for now, keeping it consistent with existing check.
            throw new IllegalArgumentException("Category ID must not be null or empty");
        }

        Category category = categoryRepository.findByCategoryId(categoryId);

        if (category == null) {
            category = new Category();
            category.setCategoryId(categoryId);
            category.setLevel(level);
            category.setParentCategory(parentCategory);
            category = categoryRepository.save(category);
        }
        return category;
    }

    private int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0) {
            // Handle division by zero or invalid price more gracefully if needed
            return 0; // Or throw IllegalArgumentException("MRP price must be greater than 0");
        }
        return (int) (((mrpPrice - sellingPrice) / mrpPrice) * 100);
    }

    @Override
    public void deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);
        productRepository.deleteById(id);
    }

    @Override
    public Product updateProduct(Long id, CreateOrUpdateProductRequest updatedProduct) throws ProductException {
        Category category = getOrCreateCategory(updatedProduct.getCategory(), null, 1);
        Category category2 = getOrCreateCategory(updatedProduct.getCategory2(), category, 2);
        Category category3 = getOrCreateCategory(updatedProduct.getCategory3(), category2, 3);

        Product existing = findProductById(id);
        // Ensure you're copying properties from updatedProduct to existing,
        // or ensure updatedProduct is fully populated if you're saving it directly.
        // For simplicity, directly setting ID and saving might not update all fields
        // if updatedProduct only contains partial data.
        existing.setTitle(updatedProduct.getTitle());
        existing.setDescription(updatedProduct.getDescription());
        existing.setMrpPrice(updatedProduct.getMrpPrice());
        existing.setSellingPrice(updatedProduct.getSellingPrice());
        existing.setDiscount(existing.getDiscount());
        existing.setColor(updatedProduct.getColor());
        existing.setImages(updatedProduct.getImages());
        existing.setNumRating(existing.getNumRating());
        existing.setQuantity(updatedProduct.getQuantity());
        existing.setCategory(category3); // Be careful with updating relationships
        existing.setSeller(existing.getSeller());     // Ensure seller is handled properly
        existing.setSize(updatedProduct.getSize());
        // createdAt should probably not be updated here, or set to LocalDate.now()
        // existing.setCreatedAt(updatedProduct.getCreatedAt());

        log.info("Updating product with ID: {}", id);
        return productRepository.save(existing); // Save the existing entity
    }

    @Override
    public Product findProductById(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product not found with id " + id));
    }

    @Override
    public Page<Product> searchProducts(
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
    ) {
        log.info("Searching products with query: {}, category: {}, brand: {}, color: {}, size: {}, minPrice: {}, maxPrice: {}, minDiscount: {}, stock: {}",
                query, category, brand, color, size, minPrice, maxPrice, minDiscount, stock);
        return productRepository.searchProduct(query, category, brand, color, size, minPrice, maxPrice, minDiscount, stock, pageable);
    }

    @Override
    public Page<Product> getAllProducts(
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
            Integer pageSize // New: Accept pageSize
    ) {
        Specification<Product> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by category (using categoryId)
            if (StringUtils.hasText(category)) {
                // Ensure 'category' in `root.join("category")` maps to the Category entity in Product model
                // And then `get("categoryId")` maps to the categoryId field in Category model.
                predicates.add(cb.equal(cb.lower(root.join("category").get("categoryId")), category.toLowerCase()));
            }

            // Filter by brand (assuming Product has a 'brand' field or it's part of title/description for search)
            // If `brand` is a field in Product, ensure its case-insensitive
            if (StringUtils.hasText(brand)) {
                predicates.add(cb.like(cb.lower(root.get("brand")), "%" + brand.toLowerCase() + "%"));
            }

            // Filter by color (case-insensitive)
            if (StringUtils.hasText(colors)) {
                predicates.add(cb.equal(cb.lower(root.get("color")), colors.toLowerCase()));
            }

            // Filter by size (case-insensitive, like search)
            if (StringUtils.hasText(sizes)) {
                predicates.add(cb.like(cb.lower(root.get("size")), "%" + sizes.toLowerCase() + "%"));
            }

            // Filter by price range
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            // Filter by minimum discount
            if (minDiscount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discount"), minDiscount));
            }

            // Filter by stock (quantity) - for "in stock" or minimum quantity
            if (StringUtils.hasText(stock)) {
                // Assuming "stock" parameter implies filtering by quantity > 0 for "in stock"
                // Or you could parse it for a specific quantity threshold
                if ("in_stock".equalsIgnoreCase(stock)) {
                    predicates.add(cb.greaterThan(root.get("quantity"), 0));
                } else if ("out_of_stock".equalsIgnoreCase(stock)) {
                    predicates.add(cb.equal(root.get("quantity"), 0));
                } else {
                    // If stock is an integer, filter by that quantity or more
                    try {
                        int stockInt = Integer.parseInt(stock);
                        predicates.add(cb.greaterThanOrEqualTo(root.get("quantity"), stockInt));
                    } catch (NumberFormatException e) {
                        // Log or throw a more specific exception if an invalid stock string is passed
                        log.warn("Invalid stock value received: {}", stock);
                        // Consider returning a bad request status from controller, or default to some behavior
                    }
                }
            }


            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Use the dynamic pageSize here
        Pageable pageable = PageRequest.of(
                pageNumber != null ? pageNumber : 0,
                pageSize != null ? pageSize : 10, // Use provided pageSize or default to 10
                resolveSort(sort)
        );

        return productRepository.findAll(specification, pageable);
    }

    private Sort resolveSort(String sort) {
        if (!StringUtils.hasText(sort)) return Sort.unsorted();

        return switch (sort.toLowerCase()) {
            case "price_low" -> Sort.by(Sort.Direction.ASC, "sellingPrice");
            case "price_high" -> Sort.by(Sort.Direction.DESC, "sellingPrice");
            case "latest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "discount" -> Sort.by(Sort.Direction.DESC, "discount");
            case "rating" -> Sort.by(Sort.Direction.DESC, "numRating"); // Assuming numRating exists
            default -> Sort.unsorted();
        };
    }

    @Override
    public List<Product> getProductsBySellerId(Long sellerId) {
        log.info("Fetching products by sellerId: {}", sellerId);
        return productRepository.findAllBySellerId(sellerId);
    }
}