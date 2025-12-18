package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.ProductDTO;
import com.example.MobileStoreManagement.DTO.ProductImageDTO;
import com.example.MobileStoreManagement.Repository.ProductImageRepository;
import com.example.MobileStoreManagement.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/products")
@CrossOrigin
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductImageRepository productImageRepository;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/get-by-category/{id}")
    public List<ProductDTO> getByCategory(@PathVariable String id) {
        return productService.getByCategoryId(id);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> create(@RequestBody ProductDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(
            @PathVariable String id,
            @RequestBody ProductDTO dto
    ) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/images")
    public List<ProductImageDTO> getImages(@PathVariable String id) {
        return productImageRepository
                .findByProductIdOrderByImgIndexAsc(id)
                .stream()
                .map(i -> ProductImageDTO.builder()
                        .id(i.getId())
                        .url(i.getUrl())
                        .imgIndex(i.getImgIndex())
                        .build()
                ).toList();
    }

}
