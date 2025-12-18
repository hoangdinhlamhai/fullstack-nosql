package com.example.MobileStoreManagement.DTO;

import com.example.MobileStoreManagement.Entity.Order;
import com.example.MobileStoreManagement.Entity.OrderDetail;
import com.example.MobileStoreManagement.Entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPaymentResponse {

    private Payment payment;
    private Order order;
    private List<OrderDetail> orderDetails;
}
