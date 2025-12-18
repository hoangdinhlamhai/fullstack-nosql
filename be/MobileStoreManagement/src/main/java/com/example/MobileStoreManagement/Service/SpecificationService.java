package com.example.MobileStoreManagement.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.MobileStoreManagement.DTO.SpecificationDTO;
import com.example.MobileStoreManagement.Entity.Specification;
import com.example.MobileStoreManagement.Repository.SpecificationRepository;

@Service
public class SpecificationService {
    private final SpecificationRepository specificationRepository;

    public SpecificationService(SpecificationRepository specificationRepository) {
        this.specificationRepository = specificationRepository;
    }

    private SpecificationDTO convertToDTO(Specification spec) {
        return SpecificationDTO.builder()
                .specId(spec.getSpecId()) // ⚠️ QUAN TRỌNG
                .screen(spec.getScreen())
                .cpu(spec.getCpu())
                .ram(spec.getRam())
                .storage(spec.getStorage())
                .camera(spec.getCamera())
                .battery(spec.getBattery())
                .os(spec.getOs())
                .build();
    }


    public List<SpecificationDTO> getAllSpecifications() {
        return this.specificationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SpecificationDTO getSpecificationById(String id) {
        Specification spec = this.specificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specification not found with id: " + id));
        return convertToDTO(spec);
    }

    public SpecificationDTO createSpecification(SpecificationDTO specDTO) {
        Specification spec = Specification.builder()
                .screen(specDTO.getScreen())
                .cpu(specDTO.getCpu())
                .ram(specDTO.getRam())
                .storage(specDTO.getStorage())
                .camera(specDTO.getCamera())
                .battery(specDTO.getBattery())
                .os(specDTO.getOs())
                .build();
        return convertToDTO(this.specificationRepository.save(spec));
    }

    public SpecificationDTO updateSpecification(String id, SpecificationDTO specDTO) {
        Specification spec = specificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specification not found with id: " + id));

        if (specDTO.getScreen() != null)
            spec.setScreen(specDTO.getScreen());
        if (specDTO.getCpu() != null)
            spec.setCpu(specDTO.getCpu());
        if (specDTO.getRam() != null)
            spec.setRam(specDTO.getRam());
        if (specDTO.getStorage() != null)
            spec.setStorage(specDTO.getStorage());
        if (specDTO.getCamera() != null)
            spec.setCamera(specDTO.getCamera());
        if (specDTO.getBattery() != null)
            spec.setBattery(specDTO.getBattery());
        if (specDTO.getOs() != null)
            spec.setOs(specDTO.getOs());

        return convertToDTO(specificationRepository.save(spec));
    }


    public void deleteSpecification(String id) {
        if (!specificationRepository.existsById(id)) {
            throw new RuntimeException("Specification not found with id: " + id);
        }
        this.specificationRepository.deleteById(id);
    }
}
