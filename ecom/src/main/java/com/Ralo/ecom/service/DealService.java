package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Deal;

import java.util.List;

public interface DealService {
    List<Deal> getDeals();

    Deal createDeal(Deal deal);

    Deal updateDeal(Deal deal, Long id) throws Exception;

    void deleteDeal(Long id) throws Exception;
}