package com.example.MobileStoreManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderRequest {
    private LocalDateTime orderDate;
    private String status;
    private String paymentStatus;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
