package com.example.MobileStoreManagement.Repository;

import com.example.MobileStoreManagement.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional <User> findBySdt(String sdt);
    Optional <User>  findByEmail(String email);
    boolean existsBySdt(String sdt);
    List<User> findByRoleIdIn(List<String> roleIds);
    Optional<User> findBySdtAndDeletedFalse(String sdt);

    boolean existsBySdtAndDeletedFalse(String sdt);
}
