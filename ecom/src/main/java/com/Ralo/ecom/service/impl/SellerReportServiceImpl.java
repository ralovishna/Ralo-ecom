package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.SellerReport;
import com.Ralo.ecom.repository.SellerReportRepository;
import com.Ralo.ecom.service.SellerReportService;

@org.springframework.stereotype.Service
@lombok.RequiredArgsConstructor
public class SellerReportServiceImpl implements SellerReportService {
    private final SellerReportRepository sellerReportRepository;

    @Override
    public SellerReport getSellerReport(Seller seller) {
        SellerReport sellerReport = sellerReportRepository.findBySellerId(seller.getId());

        if (sellerReport == null) {
            SellerReport newSellerReport = new SellerReport();
            newSellerReport.setSeller(seller);
            return sellerReportRepository.save(newSellerReport);
        }

        return sellerReport;
    }

    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {
        return sellerReportRepository.save(sellerReport);
    }
}