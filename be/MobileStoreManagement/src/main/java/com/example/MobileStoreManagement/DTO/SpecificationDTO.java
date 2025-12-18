package com.example.MobileStoreManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificationDTO {
    private String specId;
    private String screen;
    private String cpu;
    private String ram;
    private String storage;
    private String camera;
    private String battery;
    private String os;
}
