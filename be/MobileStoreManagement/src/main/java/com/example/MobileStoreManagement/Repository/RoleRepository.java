package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<Role,String > {
}
