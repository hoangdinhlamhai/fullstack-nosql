package com.example.MobileStoreManagement.Service;


import com.example.MobileStoreManagement.DTO.OrderDetailRequest;
import com.example.MobileStoreManagement.DTO.OrderDetailResponse;
import com.example.MobileStoreManagement.Entity.OrderDetail;
import com.example.MobileStoreManagement.Repository.OrderDetailRepository;
import com.example.MobileStoreManagement.Repository.OrderRepository;
import com.example.MobileStoreManagement.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // CREATE
    public OrderDetail createOrderDetail(OrderDetailRequest dto) {

        orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        var product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        OrderDetail detail = OrderDetail.builder()
                .orderId(dto.getOrderId())
                .productId(dto.getProductId())
                .quantity(dto.getQuantity())
                .build();


        return orderDetailRepository.save(detail);
    }

    // GET BY ID
    public OrderDetail getOrderDetailById(String id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail không tồn tại"));
    }

    // GET ALL BY ORDER ID
    public List<OrderDetail> getDetailsByOrderID(String orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }

    // GET ALL
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    // UPDATE
    public OrderDetail updateOrderDetail(String id, OrderDetailRequest dto) {
        OrderDetail detail = getOrderDetailById(id);

        // quantity
        if (dto.getQuantity() != null) {
            detail.setQuantity(dto.getQuantity());
        }

        if (dto.getOrderId() != null) {
            orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
            detail.setOrderId(dto.getOrderId());
        }

        if (dto.getProductId() != null) {
            var product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
            detail.setProductId(dto.getProductId());
        }

        return orderDetailRepository.save(detail);
    }

    // DELETE
    public void deleteOrderDetail(String id) {
        OrderDetail detail = getOrderDetailById(id);
        orderDetailRepository.delete(detail);
    }

    // Response DTO
    public OrderDetailResponse toResponse(OrderDetail detail) {

        OrderDetailResponse dto = new OrderDetailResponse();
        dto.setOrderId(detail.getOrderId());
        dto.setProductId(detail.getProductId());
        dto.setQuantity(detail.getQuantity());

        return dto;
    }
}