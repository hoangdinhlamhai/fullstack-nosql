package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByOrderId(String id);
}

