package com.example.MobileStoreManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDetailResponse {
    private String orderId;
    private String productId;
    private Integer quantity;
    private Long priceVnd;
}
