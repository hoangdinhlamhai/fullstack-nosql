package com.example.MobileStoreManagement.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String orderId;

    private LocalDateTime orderDate;

    private String status;

    private String paymentStatus;

    private String userId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
