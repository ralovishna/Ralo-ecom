package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Home;
import com.Ralo.ecom.model.HomeCategory;

import java.util.List;

public interface HomeService {
    Home createHomePageData(List<HomeCategory> allCategories);
}