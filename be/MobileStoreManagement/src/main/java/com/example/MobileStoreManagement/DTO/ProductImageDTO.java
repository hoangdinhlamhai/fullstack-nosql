package com.example.MobileStoreManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {
    private String id;
    private String url;
    private Long imgIndex;
}
