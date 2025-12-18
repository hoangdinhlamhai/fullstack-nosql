package com.example.MobileStoreManagement.Repository;

import java.util.List;
import com.example.MobileStoreManagement.Entity.Category;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);

    boolean existsByCategoryName(String categoryName);
}
