package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.domain.HomeCategorySection;
import com.Ralo.ecom.model.Deal;
import com.Ralo.ecom.model.Home;
import com.Ralo.ecom.model.HomeCategory;
import com.Ralo.ecom.repository.DealRepository;
import com.Ralo.ecom.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final DealRepository dealRepository;

    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {
        if (allCategories == null) {
            throw new IllegalArgumentException("Category list cannot be null");
        }

        List<HomeCategory> grid = filterBySection(allCategories, HomeCategorySection.GRID);
        List<HomeCategory> electricCategories = filterBySection(allCategories, HomeCategorySection.ELECTRONIC_CATEGORIES);
        List<HomeCategory> shopByCategories = filterBySection(allCategories, HomeCategorySection.SHOP_BY_CATEGORIES);
        List<HomeCategory> dealsCategories = filterBySection(allCategories, HomeCategorySection.DEALS);

        List<Deal> deals = fetchOrCreateDeals(dealsCategories);

        return Home.builder()
                .grid(grid)
                .electricCategories(electricCategories)
                .shopByCategories(shopByCategories)
                .dealsCategories(dealsCategories)
                .deals(deals)
                .build();
    }

    private List<HomeCategory> filterBySection(List<HomeCategory> categories, HomeCategorySection section) {
        return categories.stream()
                .filter(c -> c.getSection() == section)
                .collect(Collectors.toList());
    }

    private List<Deal> fetchOrCreateDeals(List<HomeCategory> dealsCategories) {
        List<Deal> existingDeals = dealRepository.findAll();

        if (!existingDeals.isEmpty()) {
            return existingDeals;
        }

        List<Deal> newDeals = dealsCategories.stream()
                .map(category -> new Deal(null, 10, category))
                .collect(Collectors.toList());

        return dealRepository.saveAll(newDeals);
    }
}