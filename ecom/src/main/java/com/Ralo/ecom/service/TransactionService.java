package com.Ralo.ecom.service;

import com.Ralo.ecom.model.Order;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.Transaction;

import java.util.List;

public interface TransactionService {
    Transaction createTransaction(Order order, String paymentId, String paymentLinkId);

    List<Transaction> getTransactionsBySellerId(Seller seller);

    List<Transaction> getAllTransactions();
}