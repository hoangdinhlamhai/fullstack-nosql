package com.example.MobileStoreManagement.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MobileStoreManagement.DTO.BrandDTO;
import com.example.MobileStoreManagement.Service.BrandService;

@RestController
@RequestMapping("/api/brands")
public class BrandController {
    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping()
    public List<BrandDTO> getAllBrand() {
        return this.brandService.getAllBrands();
    }

    @GetMapping("/{id}")
    public BrandDTO getBrandById(@PathVariable String id) {
        return this.brandService.getBrandById(id);
    }

    @GetMapping("/search")
    public List<BrandDTO> searchBrands(@RequestParam String name) {
        return this.brandService.searchBrandByName(name);
    }

    @GetMapping("/country/{country}")
    public List<BrandDTO> getBrandsByCountry(@PathVariable String country) {
        return this.brandService.getBrandsByCountry(country);
    }

    @PostMapping
    public BrandDTO createBrand(@RequestBody BrandDTO brandDTO) {
        return this.brandService.createBrand(brandDTO);
    }

    @PutMapping("/{id}")
    public BrandDTO updateBrand(
            @PathVariable String id,
            @RequestBody BrandDTO brandDTO) {
        return this.brandService.updateBrand(id, brandDTO);
    }

    @DeleteMapping("/{id}")
    public Void deleteBrand(@PathVariable String id) {
        this.brandService.deleteBrand(id);
        return null;
    }
}
