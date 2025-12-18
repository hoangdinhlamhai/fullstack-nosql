package com.example.MobileStoreManagement.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Role")
public class Role {
    @Id
    private String  roleId;
    private String roleName;

    // Constructors
    public Role() {}

    public Role(String roleName) {
        this.roleName = roleName;
    }

    // Getters & Setters
    public String  getRoleId() {
        return roleId;
    }

    public void setRoleId(String  roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
