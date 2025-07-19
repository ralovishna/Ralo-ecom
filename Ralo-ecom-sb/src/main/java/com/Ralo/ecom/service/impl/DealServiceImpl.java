package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.Deal;
import com.Ralo.ecom.model.HomeCategory;
import com.Ralo.ecom.repository.DealRepository;
import com.Ralo.ecom.repository.HomeCategoryRepository;
import com.Ralo.ecom.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {
    private final DealRepository dealRepository;
    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    public List<Deal> getDeals() {
        return dealRepository.findAll();
    }

    @Override
    public Deal createDeal(Deal deal) {
        HomeCategory homeCategory = homeCategoryRepository.findById(deal.getCategory().getId()).orElse(null);
        Deal newDeal = dealRepository.save(deal);
        newDeal.setCategory(homeCategory);
        newDeal.setDiscount(deal.getDiscount());

        return dealRepository.save(newDeal);
    }

    @Override
    public Deal updateDeal(Deal deal, Long id) throws Exception {
        Deal existingDeal = dealRepository.findById(id).orElse(null);
        HomeCategory homeCategory = homeCategoryRepository.findById(deal.getCategory().getId()).orElse(null);

        if (existingDeal != null) {
            if (existingDeal.getDiscount() != null) {
                existingDeal.setDiscount(deal.getDiscount());
            }
            if (existingDeal.getCategory() != null) {
                existingDeal.setCategory(homeCategory);
            }
            return dealRepository.save(existingDeal);
        }
        throw new Exception("Deal not found with id " + id);
    }

    @Override
    public void deleteDeal(Long id) throws Exception {
        Deal existingDeal = dealRepository.findById(id)
                .orElseThrow(() -> new Exception("Deal not found with id " + id));

        dealRepository.delete(existingDeal);
    }

}