package com.example.MobileStoreManagement.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.MobileStoreManagement.Entity.Supplier;

@Repository
public interface SupplierRepository extends MongoRepository<Supplier, String> {
    boolean existsBySupplierName(String supplierName);
}
