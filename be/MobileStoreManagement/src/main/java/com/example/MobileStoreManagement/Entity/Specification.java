package com.example.MobileStoreManagement.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Document(collection = "specifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Specification {
    @Id
    private String specId;

    private String screen;

    private String cpu;

    private String ram;

    private String storage;

    private String camera;

    private String battery;

    private String os;
}
