package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.OrderPaymentResponse;
import com.example.MobileStoreManagement.Entity.Order;
import com.example.MobileStoreManagement.Entity.OrderDetail;
import com.example.MobileStoreManagement.Entity.Payment;
import com.example.MobileStoreManagement.Repository.OrderDetailRepository;
import com.example.MobileStoreManagement.Repository.OrderRepository;
import com.example.MobileStoreManagement.Repository.PaymentRepository;
import com.example.MobileStoreManagement.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/paypal")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    // 1️⃣ Tạo link thanh toán
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam String orderId) {
        String approvalUrl = paymentService.createPayment(orderId);
        return ResponseEntity.ok(Map.of("approvalUrl", approvalUrl));
    }

    // 2️⃣ Lấy payment mới nhất của order
    @GetMapping("/payment/{orderId}")
    public ResponseEntity<?> getLatestPaymentByOrderId(@PathVariable String orderId) {

        List<Payment> payments = paymentRepository.findAllByOrderId(orderId);
        if (payments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment latest = payments.stream()
                .max(Comparator.comparing(Payment::getCreatedAt))
                .orElse(null);

        return ResponseEntity.ok(latest);
    }

    // 3️⃣ Lấy full thông tin: payment + order + orderDetail
    @GetMapping("/payment/full/{orderId}")
    public ResponseEntity<?> getFullPayment(@PathVariable String orderId) {

        List<Payment> payments = paymentRepository.findAllByOrderId(orderId);
        if (payments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment latestPayment = payments.stream()
                .max(Comparator.comparing(Payment::getCreatedAt))
                .orElseThrow();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order"));

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        return ResponseEntity.ok(
                new OrderPaymentResponse(latestPayment, order, details)
        );
    }

    // 4️⃣ PayPal redirect về: /paypal/return?token=XYZ
    @GetMapping("/return")
    public ResponseEntity<?> paymentReturn(@RequestParam("token") String paypalOrderId) {
        Payment payment = paymentService.completePayment(paypalOrderId);
        return ResponseEntity.ok(payment);
    }

    // 5️⃣ User cancel trên PayPal
    @GetMapping("/cancel")
    public ResponseEntity<?> cancel(@RequestParam("token") String paypalOrderId) {
        paymentService.cancelPayment(paypalOrderId);
        return ResponseEntity.ok(Map.of("status", "CANCELLED"));
    }
}
