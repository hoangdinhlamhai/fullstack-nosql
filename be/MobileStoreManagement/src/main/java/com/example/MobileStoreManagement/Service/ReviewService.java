package com.example.MobileStoreManagement.Service;


import com.example.MobileStoreManagement.DTO.ReviewRequest;
import com.example.MobileStoreManagement.DTO.ReviewResponse;
import com.example.MobileStoreManagement.Entity.Review;
import com.example.MobileStoreManagement.Entity.ReviewPhoto;
import com.example.MobileStoreManagement.Repository.OrderRepository;
import com.example.MobileStoreManagement.Repository.ReviewPhotoRepository;
import com.example.MobileStoreManagement.Repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewPhotoRepository reviewPhotoRepository;
    private final OrderRepository orderRepository;
    private final UploadtocloudinaryService uploadtocloudinaryService;


    // ===================== CREATE ===================== //
    public Review createReview(ReviewRequest req) {

        // Check Order tồn tại
        orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        String videoUrl = null;
        if (req.getVideo() != null && !req.getVideo().isEmpty()) {
            videoUrl = uploadtocloudinaryService.uploadVideo(req.getVideo(), "reviews/videos");
        }

        Review review = Review.builder()
                .orderId(req.getOrderId())   // IMPORTANT
                .comment(req.getComment())
                .videoUrl(videoUrl)
                .build();

        Review saved = reviewRepository.save(review);

        // Upload multiple photos
        if (req.getPhotos() != null) {
            for (var file : req.getPhotos()) {
                if (file != null && !file.isEmpty()) {
                    String url = uploadtocloudinaryService.uploadImage(file, "reviews/photos");

                    reviewPhotoRepository.save(
                            ReviewPhoto.builder()
                                    .reviewId(saved.getId())
                                    .photoUrl(url)
                                    .build()
                    );
                }
            }
        }

        return saved;
    }


    // ===================== GET ===================== //
    public Review findById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));
    }

    public List<ReviewResponse> findByOrderId(String orderId) {
        return reviewRepository.findByOrderId(orderId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReviewResponse> findAll() {
        return reviewRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // ===================== DELETE ===================== //
    public void deleteReview(String id) {
        Review review = findById(id);

        // delete video
        if (review.getVideoUrl() != null) {
            uploadtocloudinaryService.deleteFile(extractPublicId(review.getVideoUrl()), "video");
        }

        // delete photos
        List<ReviewPhoto> photos = reviewPhotoRepository.findByReviewId(id);
        for (ReviewPhoto p : photos) {
            uploadtocloudinaryService.deleteFile(extractPublicId(p.getPhotoUrl()), "image");
        }
        reviewPhotoRepository.deleteAll(photos);

        reviewRepository.deleteById(id);
    }


    // ===================== MAP DTO ===================== //
    public ReviewResponse toResponse(Review review) {
        if (review == null) return null;

        List<String> photoUrls = reviewPhotoRepository.findByReviewId(review.getId())
                .stream()
                .map(ReviewPhoto::getPhotoUrl)
                .toList();

        return ReviewResponse.builder()
                .reviewId(review.getId())
                .orderId(review.getOrderId())
                .comment(review.getComment())
                .videoUrl(review.getVideoUrl())
                .photoUrls(photoUrls)
                .build();
    }


    // ===================== Extract public_id ===================== //
    public String extractPublicId(String url) {
        try {
            String noExt = url.substring(0, url.lastIndexOf('.'));
            int idx = noExt.indexOf("/upload/") + "/upload/".length();
            return noExt.substring(idx);
        } catch (Exception e) {
            throw new RuntimeException("Cannot extract public_id: " + url);
        }
    }
}
