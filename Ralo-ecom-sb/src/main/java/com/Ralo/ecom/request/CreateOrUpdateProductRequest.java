package com.Ralo.ecom.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrUpdateProductRequest {
    private String title;
    private String description;
    private String brand;
    private String discount;
    private int quantity;
    private double mrpPrice;
    private double sellingPrice;
    private String color;
    private String size;
    private String category;
    private String category2;
    private String category3;
    private List<String> images;
}