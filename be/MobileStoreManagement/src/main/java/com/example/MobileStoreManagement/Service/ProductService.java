package com.example.MobileStoreManagement.Service;

import com.example.MobileStoreManagement.DTO.ProductDTO;
import com.example.MobileStoreManagement.DTO.ProductImageDTO;
import com.example.MobileStoreManagement.DTO.SpecificationDTO;
import com.example.MobileStoreManagement.Entity.Product;
import com.example.MobileStoreManagement.Entity.ProductImage;
import com.example.MobileStoreManagement.Entity.Specification;
import com.example.MobileStoreManagement.Repository.ProductImageRepository;
import com.example.MobileStoreManagement.Repository.ProductRepository;
import com.example.MobileStoreManagement.Repository.SpecificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SpecificationRepository specificationRepository;
    private final ProductImageRepository productImageRepository;

    /* =========================================================
       ======================= MAPPER ==========================
       ========================================================= */

    /* ===================== MAPPER ===================== */

    private SpecificationDTO toSpecDTO(Specification spec) {
        if (spec == null) return null;

        return SpecificationDTO.builder()
                .screen(spec.getScreen())
                .cpu(spec.getCpu())
                .ram(spec.getRam())
                .storage(spec.getStorage())
                .camera(spec.getCamera())
                .battery(spec.getBattery())
                .os(spec.getOs())
                .build();
    }

    private ProductDTO toDTO(Product product) {

        List<ProductImageDTO> images =
                productImageRepository
                        .findByProductIdOrderByImgIndexAsc(product.getId())
                        .stream()
                        .map(i -> ProductImageDTO.builder()
                                .id(i.getId())
                                .url(i.getUrl())
                                .imgIndex(i.getImgIndex())
                                .build())
                        .collect(Collectors.toList());

        return ProductDTO.builder()
                .productId(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .description(product.getDescription())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .specification(toSpecDTO(product.getSpecification()))
                .productImages(images)
                .build();
    }

    private Specification toSpecEntity(SpecificationDTO dto) {
        if (dto == null) return null;

        return Specification.builder()
                .screen(dto.getScreen())
                .cpu(dto.getCpu())
                .ram(dto.getRam())
                .storage(dto.getStorage())
                .camera(dto.getCamera())
                .battery(dto.getBattery())
                .os(dto.getOs())
                .build();
    }

    /* =========================================================
       ======================= READ =============================
       ========================================================= */

    public List<ProductDTO> getAll() {
        return productRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getById(String id) {
        return productRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    /* =========================================================
       ======================= CREATE ===========================
       ========================================================= */

    @Transactional
    public ProductDTO create(ProductDTO dto) {


        // 1️⃣ save spec vào collection riêng
        Specification savedSpec = null;
        if (dto.getSpecification() != null) {
            savedSpec = specificationRepository.save(
                    toSpecEntity(dto.getSpecification())
            );
        }

        // 2️⃣ embed snapshot vào product
        Product product = Product.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .description(dto.getDescription())
                .brandId(dto.getBrandId())
                .categoryId(dto.getCategoryId())
                .specification(savedSpec)                 // embed
                .specificationId(
                        savedSpec != null ? savedSpec.getSpecId() : null
                )
                .build();

        Product savedProduct = productRepository.save(product);
        // save images
        if (dto.getProductImages() != null && !dto.getProductImages().isEmpty()) {
            List<ProductImage> images = dto.getProductImages()
                    .stream()
                    .map(i -> ProductImage.builder()
                            .url(i.getUrl())
                            .imgIndex(i.getImgIndex())
                            .productId(savedProduct.getId())
                            .build())
                    .collect(Collectors.toList());

            productImageRepository.saveAll(images);
        }

        return toDTO(savedProduct);
    }

    /* =========================================================
       ======================= UPDATE ===========================
       ========================================================= */

    @Transactional
    public ProductDTO update(String id, ProductDTO dto) {

        Product exist = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ===== update field thường =====
        if (dto.getName() != null)
            exist.setName(dto.getName());

        if (dto.getPrice() != null)
            exist.setPrice(dto.getPrice());

        if (dto.getStockQuantity() != null)
            exist.setStockQuantity(dto.getStockQuantity());

        if (dto.getDescription() != null)
            exist.setDescription(dto.getDescription());

        if (dto.getBrandId() != null)
            exist.setBrandId(dto.getBrandId());

        if (dto.getCategoryId() != null)
            exist.setCategoryId(dto.getCategoryId());

        // ===== SPEC (DUAL WRITE) =====
        if (dto.getSpecification() != null) {

            Specification spec;

            // 1️⃣ nếu product đã có spec → load
            if (exist.getSpecificationId() != null) {
                spec = specificationRepository
                        .findById(exist.getSpecificationId())
                        .orElse(new Specification());
            }
            // 2️⃣ nếu chưa từng có spec → tạo mới
            else {
                spec = new Specification();
            }

            applySpecUpdate(spec, dto.getSpecification());

            // 3️⃣ save vào collection specifications
            Specification savedSpec = specificationRepository.save(spec);

            // 4️⃣ snapshot vào product
            exist.setSpecification(savedSpec);
            exist.setSpecificationId(savedSpec.getSpecId());
        }

        // ===== save product =====
        Product savedProduct = productRepository.save(exist);

        // ===== images (REPLACE ALL) =====
        if (dto.getProductImages() != null) {

            productImageRepository.deleteByProductId(id);

            List<ProductImage> images = dto.getProductImages()
                    .stream()
                    .map(i -> ProductImage.builder()
                            .url(i.getUrl())
                            .imgIndex(i.getImgIndex())
                            .productId(id)
                            .build())
                    .collect(Collectors.toList());

            productImageRepository.saveAll(images);
        }

        return toDTO(savedProduct);
    }


    /* =========================================================
       ======================= DELETE ===========================
       ========================================================= */

    @Transactional
    public void delete(String id) {

        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return;

        if (product.getSpecificationId() != null) {
            specificationRepository.deleteById(product.getSpecificationId());
        }

        productImageRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }

    private void applySpecUpdate(Specification spec, SpecificationDTO dto) {

        if (dto.getScreen() != null)
            spec.setScreen(dto.getScreen());

        if (dto.getCpu() != null)
            spec.setCpu(dto.getCpu());

        if (dto.getRam() != null)
            spec.setRam(dto.getRam());

        if (dto.getStorage() != null)
            spec.setStorage(dto.getStorage());

        if (dto.getCamera() != null)
            spec.setCamera(dto.getCamera());

        if (dto.getBattery() != null)
            spec.setBattery(dto.getBattery());

        if (dto.getOs() != null)
            spec.setOs(dto.getOs());
    }

    public List<ProductDTO> getByCategoryId(String id) {
        return productRepository.findByCategoryId(id)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
