package com.example.MobileStoreManagement.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "receive_notifications")
public class ReceiveNotifications {

    @Id
    private String id;

    private String notificationId;   // reference
    private String userId;           // reference

    private Boolean isRead = false;
    private Instant readAt;
}
