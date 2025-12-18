package com.example.MobileStoreManagement.DTO;

import lombok.Data;

@Data
public class PayPalPaymentRequest {
    private String localOrderId;
    private Double amount;
    private String currency;   // "USD"
    private String description;
}
