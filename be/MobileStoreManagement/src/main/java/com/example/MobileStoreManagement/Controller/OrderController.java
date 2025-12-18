package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.OrderRequest;
import com.example.MobileStoreManagement.DTO.OrderResponse;
import com.example.MobileStoreManagement.Entity.Order;
import com.example.MobileStoreManagement.Entity.User;
import com.example.MobileStoreManagement.Repository.OrderRepository;
import com.example.MobileStoreManagement.Repository.UserRepository;
import com.example.MobileStoreManagement.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // CREATE
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest dto) {
        Order order = orderService.createOrder(dto);
        return ResponseEntity.ok(order);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // GET ALL ORDERS BY USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    // GET ALL
    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(order -> {
                    User user = userRepository.findById(order.getUserId()).orElse(null);

                    return OrderResponse.builder()
                            .orderId(order.getOrderId())
                            .orderDate(order.getOrderDate())
                            .status(order.getStatus())
                            .paymentStatus(order.getPaymentStatus())
                            .fullname(user != null ? user.getFullName() : null)
                            .sdt(user != null ? user.getSdt() : null)
                            .createdAt(order.getCreatedAt())
                            .updatedAt(order.getUpdatedAt())
                            .build();
                })
                .toList();
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable String id,
            @RequestBody OrderRequest dto
    ) {
        Order updatedOrder = orderService.updateOrder(id, dto);
        return ResponseEntity.ok(updatedOrder);
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order đã được xoá thành công");
    }
}
