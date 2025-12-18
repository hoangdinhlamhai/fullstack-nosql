package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.ReviewPhoto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewPhotoRepository extends MongoRepository<ReviewPhoto, String> {
    List<ReviewPhoto> findByReviewId(String reviewId);
}

