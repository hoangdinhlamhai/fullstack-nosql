package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart,String> {
    Optional<Cart> findByUserId(String userId);
}
