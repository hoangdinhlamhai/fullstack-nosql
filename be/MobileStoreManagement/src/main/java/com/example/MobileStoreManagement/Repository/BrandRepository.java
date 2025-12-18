package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.Brand;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends MongoRepository<Brand, String> {
    List<Brand> findByNameContainingIgnoreCase(String name);

    List<Brand> findByCountry(String country);

    boolean existsByName(String name);
}