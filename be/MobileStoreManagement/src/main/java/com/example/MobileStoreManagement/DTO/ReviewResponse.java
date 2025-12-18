package com.example.MobileStoreManagement.DTO;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ReviewResponse {

    private String reviewId;

    private String orderId;

    private String comment;

    private String videoUrl;

    private List<String> photoUrls; // Multiple photos
}

