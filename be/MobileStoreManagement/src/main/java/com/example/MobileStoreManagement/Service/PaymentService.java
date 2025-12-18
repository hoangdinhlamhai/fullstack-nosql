package com.example.MobileStoreManagement.Service;

import com.example.MobileStoreManagement.Client.PayPalClient;
import com.example.MobileStoreManagement.Entity.Order;
import com.example.MobileStoreManagement.Entity.OrderDetail;
import com.example.MobileStoreManagement.Entity.Payment;
import com.example.MobileStoreManagement.Entity.Product;
import com.example.MobileStoreManagement.Repository.OrderDetailRepository;
import com.example.MobileStoreManagement.Repository.OrderRepository;
import com.example.MobileStoreManagement.Repository.PaymentRepository;
import com.example.MobileStoreManagement.Repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PayPalClient payPalClient;
    private final FxRateService fxRateService;
    private final ProductRepository productRepository;
    @Value("${app.fe-base-url}")
    private String feBaseUrl;

    @Value("${app.base-url}")
    private String appBaseUrl;

    public String createPayment(String orderId) {

        // 1) Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));

        // Optional: chặn luôn nếu order đã PAID
        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new RuntimeException("Order đã thanh toán rồi");
        }

        // 2) OrderDetails
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        if (details == null || details.isEmpty()) {
            throw new RuntimeException("Order không có sản phẩm");
        }

        // 3) Tổng tiền VND (tính từ Product.price)
        BigDecimal totalVnd = BigDecimal.ZERO;

        for (OrderDetail d : details) {
            if (d.getQuantity() == null || d.getQuantity() <= 0) {
                throw new RuntimeException("Quantity không hợp lệ, orderDetailId=" + d.getId());
            }

            Product product = productRepository.findById(d.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product không tồn tại: " + d.getProductId()));

            if (product.getPrice() == null || product.getPrice() <= 0) {
                throw new RuntimeException("Product chưa có price hợp lệ: " + product.getId());
            }

            // NOTE: nếu Product.price là Double (VND) thì vẫn ok, nhưng tốt nhất nên lưu Long VND
            BigDecimal priceVnd = BigDecimal.valueOf(product.getPrice());
            totalVnd = totalVnd.add(priceVnd.multiply(BigDecimal.valueOf(d.getQuantity())));
        }

        if (totalVnd.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Tổng tiền VND không hợp lệ");
        }

        // 4) Check payment history: nếu đã có payment COMPLETED thì chặn
        List<Payment> payments = paymentRepository.findAllByOrderId(orderId);
        boolean alreadyPaid = payments.stream()
                .anyMatch(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()));
        if (alreadyPaid) {
            throw new RuntimeException("Order đã thanh toán rồi");
        }

        // (tuỳ chọn) dọn các payment cũ bị CREATED/CANCELLED/FAILED để đỡ rác
        // bạn có thể bỏ đoạn này nếu muốn giữ lịch sử
        payments.stream()
                .filter(p -> p.getStatus() == null
                        || "CREATED".equalsIgnoreCase(p.getStatus())
                        || "CANCELLED".equalsIgnoreCase(p.getStatus())
                        || "FAILED".equalsIgnoreCase(p.getStatus()))
                .forEach(paymentRepository::delete);

        // 5) Tỷ giá USD/VND realtime
        BigDecimal usdVndRate = fxRateService.getUsdVndRate();
        if (usdVndRate == null || usdVndRate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Tỷ giá USD/VND không hợp lệ");
        }

        // 6) Quy đổi sang USD (PayPal cần 2 chữ số thập phân)
        BigDecimal totalUsd = totalVnd.divide(usdVndRate, 10, RoundingMode.HALF_UP);
        BigDecimal usdRounded = totalUsd.setScale(2, RoundingMode.HALF_UP);

        if (usdRounded.compareTo(new BigDecimal("0.01")) < 0) {
            throw new RuntimeException("Số tiền USD quá nhỏ cho PayPal");
        }

        // 7) Tạo PayPal Order
        JsonNode orderRes = payPalClient.createOrder(
                usdRounded.doubleValue(),
                "USD",
                "Thanh toán Order #" + orderId,

                // ✅ Pay xong → HOME
                "http://localhost:5173/",

                // ❌ Huỷ → HOME luôn
                "http://localhost:5173/"
        );


        String paypalOrderId = orderRes.path("id").asText(null);
        if (paypalOrderId == null || paypalOrderId.isBlank()) {
            throw new RuntimeException("PayPal không trả về orderId");
        }

        // 8) Lưu Payment mới
        Payment payment = Payment.builder()
                .orderId(orderId)
                .paypalOrderId(paypalOrderId)
                .amount(usdRounded.doubleValue())
                .currency("USD")
                .amountVnd(totalVnd.longValue())
                .exchangeRate(usdVndRate.doubleValue())
                .status("CREATED")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // 9) Lấy approval URL
        JsonNode links = orderRes.path("links");
        if (links.isArray()) {
            for (JsonNode link : links) {
                if ("approve".equalsIgnoreCase(link.path("rel").asText())) {
                    String href = link.path("href").asText(null);
                    if (href != null && !href.isBlank()) return href;
                }
            }
        }

        throw new RuntimeException("Không lấy được approvalUrl từ PayPal");
    }

    public Payment completePayment(String paypalOrderId) {
        if (paypalOrderId == null || paypalOrderId.isBlank()) {
            throw new RuntimeException("paypalOrderId không hợp lệ");
        }

        JsonNode capture = payPalClient.captureOrder(paypalOrderId);
        String status = capture.path("status").asText(null);

        // extract captureId
        String captureId = null;
        try {
            captureId = capture
                    .path("purchase_units").path(0)
                    .path("payments").path("captures").path(0)
                    .path("id").asText(null);
        } catch (Exception ignored) {}

        Payment payment = paymentRepository.findByPaypalOrderId(paypalOrderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy payment với paypalOrderId=" + paypalOrderId));

        payment.setPaypalCaptureId(captureId);
        payment.setStatus(status != null ? status : "UNKNOWN");
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // update Order
        if ("COMPLETED".equalsIgnoreCase(status)) {
            Order order = orderRepository.findById(payment.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

            order.setPaymentStatus("PAID");
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);
        }

        return payment;
    }

    public void cancelPayment(String paypalOrderId) {
        if (paypalOrderId == null || paypalOrderId.isBlank()) return;

        Optional<Payment> paymentOpt = paymentRepository.findByPaypalOrderId(paypalOrderId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus("CANCELLED");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }
    }
}
