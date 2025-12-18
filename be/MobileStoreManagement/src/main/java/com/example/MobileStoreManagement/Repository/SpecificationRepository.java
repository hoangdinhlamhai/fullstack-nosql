package com.example.MobileStoreManagement.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.MobileStoreManagement.Entity.Specification;

public interface SpecificationRepository extends MongoRepository<Specification, String> {
}
