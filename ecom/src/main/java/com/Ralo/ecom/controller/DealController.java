package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Deal;
import com.Ralo.ecom.response.ApiResponse;
import com.Ralo.ecom.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Deal deal) {
        return new ResponseEntity<>(dealService.createDeal(deal), HttpStatus.ACCEPTED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(@RequestBody Deal deal, @PathVariable Long id) throws Exception {
        return new ResponseEntity<>(dealService.updateDeal(deal, id), HttpStatus.OK);
    }

    @DeleteMapping("/{dealId}")
    public ResponseEntity<ApiResponse> deleteDeal(@PathVariable Long dealId) throws Exception {
        dealService.deleteDeal(dealId);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Deal deleted successfully");
        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
    }

    // ✅ GET all deals
    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals() {
        List<Deal> deals = dealService.getDeals();
        return new ResponseEntity<>(deals, HttpStatus.OK);
    }
}