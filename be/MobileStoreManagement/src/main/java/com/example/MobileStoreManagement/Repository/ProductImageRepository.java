package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.ProductImage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductImageRepository extends MongoRepository<ProductImage,String> {
    List<ProductImage> findByProductIdOrderByImgIndexAsc(String productId);
    void deleteByProductId(String productId);
}
