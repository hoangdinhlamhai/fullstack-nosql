package com.example.MobileStoreManagement.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ReviewRequest {

    private String orderId;

    private String comment;

    private MultipartFile video;

    private List<MultipartFile> photos;
}
