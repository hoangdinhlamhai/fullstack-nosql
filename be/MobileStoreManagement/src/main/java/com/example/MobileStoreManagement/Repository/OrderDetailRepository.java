package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.Order;
import com.example.MobileStoreManagement.Entity.OrderDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends MongoRepository<OrderDetail,String> {
    List<OrderDetail> findByOrderId(String orderId);
}
