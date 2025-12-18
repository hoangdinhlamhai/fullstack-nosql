package com.example.MobileStoreManagement.Repository;
import com.example.MobileStoreManagement.Entity.ReceiveNotifications;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReceiveNotificationRepository extends MongoRepository<ReceiveNotifications, String> {
    List<ReceiveNotifications> findByUserId(String userId);
    List<ReceiveNotifications> findByUserIdAndIsReadFalse(String userId);
}
