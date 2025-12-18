package com.example.MobileStoreManagement.DTO;

import lombok.Data;

@Data
public class CartDetailRequestDTO {
    private String cartId;
    private String productId;
}