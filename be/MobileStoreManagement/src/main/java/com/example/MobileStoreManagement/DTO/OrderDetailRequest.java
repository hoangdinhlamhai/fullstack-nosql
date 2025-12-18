package com.example.MobileStoreManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailRequest {
    private String orderId;
    private String productId;
    private Integer quantity;
}
