package com.Ralo.ecom.controller;

import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.Transaction;
import com.Ralo.ecom.service.SellerService;
import com.Ralo.ecom.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final SellerService sellerService;

    @GetMapping("/seller")
    public ResponseEntity<?> getTransactionsBySeller(
            @RequestHeader("Authorization") String token
    ) throws Exception {
        Seller seller = sellerService.getSellerProfile(token);

        List<Transaction> transactions = transactionService.getTransactionsBySellerId(seller);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }
}