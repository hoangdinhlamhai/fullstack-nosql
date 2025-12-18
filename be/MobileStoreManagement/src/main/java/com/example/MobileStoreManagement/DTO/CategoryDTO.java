package com.example.MobileStoreManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private String categoryId;
    private String categoryName;
    private String description;
}
