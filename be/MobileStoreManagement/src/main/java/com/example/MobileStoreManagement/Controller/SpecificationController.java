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
import org.springframework.web.bind.annotation.RestController;

import com.example.MobileStoreManagement.DTO.SpecificationDTO;
import com.example.MobileStoreManagement.Service.SpecificationService;

@RestController
@RequestMapping("/api/specifications")
public class SpecificationController {
    private final SpecificationService specificationService;

    public SpecificationController(SpecificationService specificationService) {
        this.specificationService = specificationService;
    }

    @GetMapping
    public List<SpecificationDTO> getAllSpecifications() {
        return this.specificationService.getAllSpecifications();
    }

    @GetMapping("/{id}")
    public SpecificationDTO getSpecificationById(@PathVariable String id) {
        return this.specificationService.getSpecificationById(id);
    }

    @PostMapping
    public SpecificationDTO createSpecification(@RequestBody SpecificationDTO specDTO) {
        return this.specificationService.createSpecification(specDTO);
    }

    @PutMapping("/{id}")
    public SpecificationDTO updateSpecification(
            @PathVariable String id,
            @RequestBody SpecificationDTO specDTO) {
        return this.specificationService.updateSpecification(id, specDTO);
    }

    @DeleteMapping("/{id}")
    public Void deleteSpecification(@PathVariable String id) {
        this.specificationService.deleteSpecification(id);
        return null;
    }
}
