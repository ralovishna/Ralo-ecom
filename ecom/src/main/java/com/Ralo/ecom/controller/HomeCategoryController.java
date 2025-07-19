package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Home;
import com.Ralo.ecom.model.HomeCategory;
import com.Ralo.ecom.service.HomeCategoryService;
import com.Ralo.ecom.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class HomeCategoryController {
    private final HomeCategoryService homeCategoryService;
    private final HomeService homeService;

    @PostMapping("/home/categories")
    public ResponseEntity<Home> createHomeCategories(
            @org.springframework.web.bind.annotation.RequestBody List
                    <HomeCategory> homeCategories) {
        System.out.println("\n\n\n\n\n\n\n\n\n\n\nksdfdsfadsf\n\n\n\n\n\n\n\n\n\n\n\n\n");
        List<HomeCategory> categories = homeCategoryService.createHomeCategories(homeCategories);
        Home home = homeService.createHomePageData(categories);

        return new ResponseEntity<>(home, HttpStatus.ACCEPTED);
    }


    @GetMapping("/admin/home-categories")
    public ResponseEntity<List<HomeCategory>> getHomeCategories() {
        return new ResponseEntity<>(homeCategoryService.getAllHomeCategories(), HttpStatus.OK);
    }

    @PatchMapping("/admin/home-category/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(
            @PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody HomeCategory homeCategory) throws Exception {
        return new ResponseEntity<>(homeCategoryService.updateHomeCategory(homeCategory, id), HttpStatus.OK);
    }
}