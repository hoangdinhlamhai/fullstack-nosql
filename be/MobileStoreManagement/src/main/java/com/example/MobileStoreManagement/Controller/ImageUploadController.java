package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.Service.UploadtocloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    private final UploadtocloudinaryService uploadtocloudinaryService;

    @PostMapping("/img-upload")
    public ResponseEntity<String> uploadImg(
            @RequestParam("file") MultipartFile file
    ) {
        String url = uploadtocloudinaryService.uploadImage(file, "product-images");
        return ResponseEntity.ok(url);
    }
}
