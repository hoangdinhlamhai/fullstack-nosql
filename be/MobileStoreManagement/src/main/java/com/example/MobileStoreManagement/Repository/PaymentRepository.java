package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByPaypalOrderId(String paypalOrderId);

    // 1 order có thể nhiều payment (retry, cancel, test sandbox)
    List<Payment> findAllByOrderId(String orderId);

}
