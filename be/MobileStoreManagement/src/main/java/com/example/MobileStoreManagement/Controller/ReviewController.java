package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.ReviewRequest;
import com.example.MobileStoreManagement.DTO.ReviewResponse;
import com.example.MobileStoreManagement.Entity.Review;
import com.example.MobileStoreManagement.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;


    // CREATE review (multipart/form-data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewResponse> create(@ModelAttribute ReviewRequest req) {

        Review saved = reviewService.createReview(req);

        return ResponseEntity.ok(reviewService.toResponse(saved));
    }

    // GET all
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAll() {
        return ResponseEntity.ok(reviewService.findAll());
    }


    // GET by review ID
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getById(@PathVariable String id) {
        Review review = reviewService.findById(id);
        return ResponseEntity.ok(reviewService.toResponse(review));
    }


    // GET by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ReviewResponse>> getByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(reviewService.findByOrderId(orderId));
    }


    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
