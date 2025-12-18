package com.example.MobileStoreManagement.Service;

import com.example.MobileStoreManagement.DTO.CartDetailRequestDTO;
import com.example.MobileStoreManagement.DTO.CartDetailResponse;
import com.example.MobileStoreManagement.Entity.CartDetail;
import com.example.MobileStoreManagement.Repository.CartDetailRepository;
import com.example.MobileStoreManagement.Repository.CartRepository;
import com.example.MobileStoreManagement.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartDetailService {

    private final CartDetailRepository cartDetailRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public List<CartDetail> getAll() {
        return cartDetailRepository.findAll();
    }

    public CartDetail getById(String id) {
        return cartDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartDetail không tồn tại"));
    }

    public List<CartDetail> getByCartId(String cartId) {
        return cartDetailRepository.findByCartId(cartId);
    }

    public CartDetail createCartDetail(CartDetailRequestDTO dto) {

        cartRepository.findById(dto.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartDetail detail = CartDetail.builder()
                .cartId(dto.getCartId())
                .productId(dto.getProductId())
                .build();

        return cartDetailRepository.save(detail);
    }

    public CartDetail update(String id, CartDetailRequestDTO dto) {
        CartDetail existing = getById(id);

        if (dto.getCartId() != null) {
            existing.setCartId(dto.getCartId());
        }

        if (dto.getProductId() != null) {
            existing.setProductId(dto.getProductId());
        }

        return cartDetailRepository.save(existing);
    }

    public void delete(String id) {
        cartDetailRepository.deleteById(id);
    }

    public void deleteSingleCartDetailByProductId(String productId) {

        // BƯỚC 1: Tìm tài liệu đầu tiên (Find First) khớp với productId
        // Spring Data sẽ tự động thêm giới hạn 1 (LIMIT 1) vào truy vấn MongoDB.
        CartDetail detailToDelete = cartDetailRepository.findFirstByProductId(productId);

        // BƯỚC 2: Kiểm tra và Xóa tài liệu đó
        if (detailToDelete != null) {
            cartDetailRepository.delete(detailToDelete);
            System.out.println("Đã xóa thành công một chi tiết giỏ hàng với ProductId: " + productId);
        } else {
            System.out.println("Không tìm thấy chi tiết giỏ hàng nào với ProductId: " + productId);
        }
    }

    public void deleteAllById(String id) {
        cartDetailRepository.deleteByProductId(id);
    }

    public CartDetailResponse toResponse(CartDetail entity) {
        CartDetailResponse dto = new CartDetailResponse();
        dto.setId(entity.getId());
        dto.setCartId(entity.getCartId());
        dto.setProductId(entity.getProductId());
        return dto;
    }
}