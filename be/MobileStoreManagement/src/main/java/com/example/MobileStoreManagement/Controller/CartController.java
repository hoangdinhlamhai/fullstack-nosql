package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.CartDTO;
import com.example.MobileStoreManagement.Service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getAllCart() {
        return ResponseEntity.ok(this.cartService.getAllCarts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartDTO> getCartByUser(@PathVariable String id) {
        return ResponseEntity.ok(this.cartService.getCartByUserId(id));
    }

    @PostMapping
    public ResponseEntity<CartDTO> create(@RequestBody CartDTO dto) {
        return ResponseEntity.ok(cartService.createCart(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCartByUser(@PathVariable String id) {
        cartService.deleteCartByUserId(id);
        return ResponseEntity.ok("Cart deleted successfully");
    }
}