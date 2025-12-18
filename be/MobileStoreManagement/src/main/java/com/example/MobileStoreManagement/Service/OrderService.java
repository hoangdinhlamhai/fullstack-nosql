package com.example.MobileStoreManagement.Service;

import com.example.MobileStoreManagement.DTO.OrderRequest;
import com.example.MobileStoreManagement.DTO.OrderResponse;
import com.example.MobileStoreManagement.Entity.Order;
import com.example.MobileStoreManagement.Entity.User;
import com.example.MobileStoreManagement.Repository.OrderRepository;
import com.example.MobileStoreManagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // CREATE
    public Order createOrder(OrderRequest dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        Order order = Order.builder()
                .orderDate(dto.getOrderDate() != null ? dto.getOrderDate() : now)
                .status(dto.getStatus() != null ? dto.getStatus() : "PENDING")
                .paymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : "UNPAID")
                .userId(user.getUserId())
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : now)
                .updatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : now)
                .build();

        return orderRepository.save(order);
    }


    // GET BY ID
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
    }

    // GET ALL ORDER BY USER
    public List<Order> getOrdersByUser(String userID) {
        return orderRepository.findByUserId(userID);
    }

    // GET ALL
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // UPDATE
    public Order updateOrder(String id, OrderRequest dto) {
        Order order = getOrderById(id);

        if (dto.getOrderDate() != null) {
            order.setOrderDate(dto.getOrderDate());
        }

        if (dto.getStatus() != null) {
            order.setStatus(dto.getStatus());
        }

        if (dto.getPaymentStatus() != null) {
            order.setPaymentStatus(dto.getPaymentStatus());
        }

        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }


    // DELETE
    public void deleteOrder(String id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    public OrderResponse toOrderResponse(Order order, User user) {
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
    }

}
