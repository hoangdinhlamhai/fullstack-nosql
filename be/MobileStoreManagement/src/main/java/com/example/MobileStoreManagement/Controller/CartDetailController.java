package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.CartDetailRequestDTO;
import com.example.MobileStoreManagement.DTO.CartDetailResponse;
import com.example.MobileStoreManagement.Entity.CartDetail;
import com.example.MobileStoreManagement.Service.CartDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-details")
public class CartDetailController {
    private final CartDetailService cartDetailService;

    public CartDetailController(CartDetailService cartDetailService) {
        this.cartDetailService = cartDetailService;
    }

    @GetMapping
    public List<CartDetail> getAll() {
        return cartDetailService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartDetailResponse> getById(@PathVariable String id) {
        CartDetail detail = cartDetailService.getById(id);
        return ResponseEntity.ok(cartDetailService.toResponse(detail));
    }

    @GetMapping("/cart/{cartId}")
    public List<CartDetail> getByCartId(@PathVariable String cartId) {
        return cartDetailService.getByCartId(cartId);
    }

    @PostMapping
    public ResponseEntity<CartDetailResponse> create(@RequestBody CartDetailRequestDTO dto) {
        CartDetail detail = cartDetailService.createCartDetail(dto);
        return ResponseEntity.ok(cartDetailService.toResponse(detail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartDetailResponse> update(
            @PathVariable String id,
            @RequestBody CartDetailRequestDTO dto) {
        CartDetail updated = cartDetailService.update(id, dto);
        return ResponseEntity.ok(cartDetailService.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        cartDetailService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deleteByProductId/{id}")
    public ResponseEntity<Void> deleteByProductId(@PathVariable String id) {
        cartDetailService.deleteSingleCartDetailByProductId(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deleteAll/{id}")
    public ResponseEntity<Void> deleteAll(@PathVariable String id) {
        cartDetailService.deleteAllById(id);
        return ResponseEntity.noContent().build();
    }
}