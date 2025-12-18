package com.example.MobileStoreManagement.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    // ===== Order info =====
    private String orderId;
    private LocalDateTime orderDate;
    private String status;
    private String paymentStatus;

    // ===== Receiver snapshot =====
    private String fullname;
    private String sdt;

    // ===== Audit =====
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
