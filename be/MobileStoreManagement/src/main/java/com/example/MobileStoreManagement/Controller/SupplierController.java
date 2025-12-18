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

import com.example.MobileStoreManagement.DTO.SupplierDTO;
import com.example.MobileStoreManagement.Service.SupplierService;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<SupplierDTO> getAllSuppliers() {
        return this.supplierService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public SupplierDTO getSupplierById(@PathVariable String id) {
        return this.supplierService.getSupplierById(id);
    }

    @PostMapping
    public SupplierDTO createSupplier(@RequestBody SupplierDTO supplierDTO) {
        return this.supplierService.createSupplier(supplierDTO);
    }

    @PutMapping("/{id}")
    public SupplierDTO updateSupplier(
            @PathVariable String id,
            @RequestBody SupplierDTO supplierDTO) {
        return this.supplierService.updateSupplier(id, supplierDTO);
    }

    @DeleteMapping("/{id}")
    public Void deleteSupplier(@PathVariable String id) {
        this.supplierService.deleteSupplier(id);
        return null;
    }
}
