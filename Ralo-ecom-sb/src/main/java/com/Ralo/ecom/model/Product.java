package com.Ralo.ecom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;
    private String title;
    private String description;
    private double mrpPrice;
    private double sellingPrice;
    private int discount;
    private String color;

    @Column(name = "brand")
    private String brand;

    @ElementCollection
    private List<String> images = new ArrayList<>();
    private int numRating;
    private int quantity;
    @ManyToOne
    private Category category;
    @ManyToOne
    private Seller seller;
    private String size;
    private LocalDate createdAt;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();
}