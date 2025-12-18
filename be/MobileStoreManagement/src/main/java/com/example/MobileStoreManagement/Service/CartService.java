package com.example.MobileStoreManagement.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.MobileStoreManagement.DTO.CartDTO;
import com.example.MobileStoreManagement.Entity.Cart;
import com.example.MobileStoreManagement.Repository.CartRepository;
import com.example.MobileStoreManagement.Repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getId());        // Mongo id
        dto.setUserId(cart.getUserId());
        dto.setStatus(cart.getStatus());
        return dto;
    }

    public CartDTO createCart(CartDTO DTO) {

        // check user tồn tại
        userRepository.findById(DTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Cart cart = Cart.builder()
                .userId(DTO.getUserId())
                .status(DTO.getStatus())
                .build();

        Cart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    public CartDTO getCartByUserId(String userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart không tồn tại"));

        return toDTO(cart);
    }

    public List<CartDTO> getAllCarts() {
        return cartRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public void deleteCartByUserId(String userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart không tồn tại"));

        cartRepository.delete(cart);
    }
}
