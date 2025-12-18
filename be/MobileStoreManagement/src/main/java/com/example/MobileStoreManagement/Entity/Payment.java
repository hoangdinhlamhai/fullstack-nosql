package com.example.MobileStoreManagement.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    private String id;

    private String orderId;
    private String paypalOrderId;
    private String paypalCaptureId;

    // CREATED / CANCELLED / COMPLETED / FAILED (tuỳ bạn)
    private String status;

    // USD
    private Double amount;
    private String currency;

    // optional but rất nên lưu
    private Long amountVnd;
    private Double exchangeRate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
