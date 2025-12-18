package com.example.MobileStoreManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private String cartId;     // String
    private String userId;     // String
    private String status;

    private List<CartDetailRequestDTO> cartItems;

    private List<String> productIds;
}
