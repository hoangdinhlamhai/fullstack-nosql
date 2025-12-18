package com.example.MobileStoreManagement.Service;

import com.example.MobileStoreManagement.Repository.RoleRepository;
import com.example.MobileStoreManagement.Entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService  {
    @Autowired
    private  RoleRepository repo;

    public RoleService(RoleRepository repo) {
        this.repo = repo;
    }


    public List<Role> getAllRoles() {
        return repo.findAll();
    }


    public Role createRole(Role role) {
        // Có thể thêm logic validate trùng tên chẳng hạn
        return repo.save(role);
    }


    public Role updateRole(String  roleId, Role role){
        Role r = repo.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        r.setRoleName(role.getRoleName());

        return repo.save(r);
    }


    public Role getById(String  id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại!"));
    }


    public void deleteById(String  id) {
        repo.deleteById(id);
    }
}