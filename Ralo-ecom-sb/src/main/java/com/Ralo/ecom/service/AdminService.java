package com.Ralo.ecom.service;

import com.Ralo.ecom.model.AdminDashboardStats;

public interface AdminService {
    AdminDashboardStats getAdminDashboardStats(String timeframe, String startDate, String endDate);
}