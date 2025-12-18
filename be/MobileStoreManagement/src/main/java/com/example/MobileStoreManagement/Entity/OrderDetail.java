package com.example.MobileStoreManagement.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetail {

    @Id
    private String id;

    private String orderId;     // link sang Order

    private String productId;   // link sang Product

    private Integer quantity;

}