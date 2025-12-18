package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.Service.RoleService;
import com.example.MobileStoreManagement.Entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
public class RoleController {
    @Autowired
    private RoleService service;

    @GetMapping
    public List<Role> getAll() {
        return service.getAllRoles();
    }

    @PostMapping
    public Role create(@RequestBody Role role) {
        return service.createRole(role);
    }

    @PutMapping("/{id}")
    public Role update(@PathVariable String id, @RequestBody Role role){
        return service.updateRole(id,role);
    }

    @GetMapping("/{id}")
    public Role getOne(@PathVariable String id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteById(id);
    }
}
