package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.CartDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CartDetailRepository extends MongoRepository<CartDetail, String> {
    List<CartDetail> findByCartId(String cartId);

    CartDetail findFirstByProductId(String productId);

    void deleteByProductId(String productId);
}