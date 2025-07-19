package com.Ralo.ecom.service.impl;

import com.Ralo.ecom.model.Order;
import com.Ralo.ecom.model.Seller;
import com.Ralo.ecom.model.Transaction;
import com.Ralo.ecom.repository.SellerRepository;
import com.Ralo.ecom.repository.TransactionRepository;
import com.Ralo.ecom.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;

    @Override
    public Transaction createTransaction(Order order, String paymentId, String paymentLinkId) {
        Seller seller = sellerRepository.findById(order.getSellerId()).get();

        Transaction transaction = new Transaction();
        transaction.setCustomer(order.getUser());
        transaction.setOrder(order);
        transaction.setSeller(seller);
        transaction.setPaymentId(paymentId);
        transaction.setPaymentLinkId(paymentLinkId);
        transaction.setAmount(Double.valueOf(order.getTotalSellingPrice()));

        return transactionRepository.save(transaction);
    }


    @Override
    public List<Transaction> getTransactionsBySellerId(Seller seller) {
        return transactionRepository.findBySellerId(seller.getId());
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}