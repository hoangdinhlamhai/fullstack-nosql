package com.example.MobileStoreManagement.Controller;


import com.example.MobileStoreManagement.DTO.OrderDetailRequest;
import com.example.MobileStoreManagement.DTO.OrderDetailResponse;
import com.example.MobileStoreManagement.Entity.OrderDetail;
import com.example.MobileStoreManagement.Service.OrderDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {
    private final OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<OrderDetailResponse> createOrderDetail(@RequestBody OrderDetailRequest dto) {
        OrderDetail detail = orderDetailService.createOrderDetail(dto);
        return ResponseEntity.ok(orderDetailService.toResponse(detail));
    }

    // GET DETAIL BY ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOrderDetailById(@PathVariable String id) {
        OrderDetail detail = orderDetailService.getOrderDetailById(id);
        return ResponseEntity.ok(orderDetailService.toResponse(detail));
    }

    // GET ALL DETAILS BY ORDER ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getDetailsByOrderId(@PathVariable String orderId) {
        List<OrderDetail> details = orderDetailService.getDetailsByOrderID(orderId);
        return ResponseEntity.ok(details);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<OrderDetail>> getAllOrderDetails() {
        List<OrderDetail> list = orderDetailService.getAllOrderDetails();
        return ResponseEntity.ok(list);
    }

    // UPDATE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> updateOrderDetail(
            @PathVariable String id,
            @RequestBody OrderDetailRequest dto
    ) {
        OrderDetail updated = orderDetailService.updateOrderDetail(id, dto);
        return ResponseEntity.ok(orderDetailService.toResponse(updated));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderDetail(@PathVariable String id) {
        orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.ok("OrderDetail đã được xoá thành công");
    }
}
