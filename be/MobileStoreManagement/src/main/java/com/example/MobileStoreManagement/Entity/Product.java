package com.example.MobileStoreManagement.Entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;

    private String name;
    private Double price;
    private Integer stockQuantity;
    private String description;

    private String brandId;
    private String categoryId;

    // snapshot
    private Specification specification;

    // trace / audit
    private String specificationId;
}

