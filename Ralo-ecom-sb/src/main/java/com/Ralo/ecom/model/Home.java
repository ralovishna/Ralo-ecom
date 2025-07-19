package com.Ralo.ecom.model;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class Home {
    private List<HomeCategory> grid = new ArrayList<>();

    private List<HomeCategory> electricCategories = new ArrayList<>();

    private List<HomeCategory> shopByCategories = new ArrayList<>();

    private List<HomeCategory> dealsCategories = new ArrayList<>();

    private List<Deal> deals;
}