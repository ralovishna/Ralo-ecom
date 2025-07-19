package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.HomeCategory;
import com.Ralo.ecom.repository.HomeCategoryRepository;
import com.Ralo.ecom.service.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {
    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }

    @Override
    public List<HomeCategory> createHomeCategories(List<HomeCategory> homeCategories) {
        if (homeCategoryRepository.findAll().isEmpty()) {
            return homeCategoryRepository.saveAll(homeCategories);
        }

        return homeCategoryRepository.findAll();
    }

    @Override
    public HomeCategory updateHomeCategory(HomeCategory homeCategory, Long id) throws Exception {
        HomeCategory existingHomeCategory = homeCategoryRepository.findById(id).orElseThrow(() -> new Exception("Home category not found"));

        if (homeCategory.getImage() != null) {
            existingHomeCategory.setImage(homeCategory.getImage());
        }

        if (homeCategory.getCategoryId() != null) {
            existingHomeCategory.setCategoryId(homeCategory.getCategoryId());
        }
        return homeCategoryRepository.save(existingHomeCategory);
    }

    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
}