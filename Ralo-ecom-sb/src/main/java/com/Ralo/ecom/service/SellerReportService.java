package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.SellerReport;

public interface SellerReportService {
    SellerReport getSellerReport(Seller seller);

    SellerReport updateSellerReport(SellerReport sellerReport);
}