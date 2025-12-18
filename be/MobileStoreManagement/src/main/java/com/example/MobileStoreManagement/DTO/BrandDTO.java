package com.example.MobileStoreManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDTO {
    private String brandId;
    private String name;
    private String country;
    private String description;
}