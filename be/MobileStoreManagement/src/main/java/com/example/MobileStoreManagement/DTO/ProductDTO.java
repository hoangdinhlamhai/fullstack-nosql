package com.example.MobileStoreManagement.DTO;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private String productId;
    private String name;
    private Double price;
    private Integer stockQuantity;
    private String description;
    private String brandId;
    private String categoryId;
    private SpecificationDTO specification;
    private List<ProductImageDTO> productImages;
}
