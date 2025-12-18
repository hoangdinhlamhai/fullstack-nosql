package com.example.MobileStoreManagement.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String userId;
    private String sdt;
    private String fullName;
    private String email;
    private String role; // Admin / User

    public LoginResponse(String userId, String sdt, String fullName, String email, String role) {
        this.userId = userId;
        this.sdt = sdt;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    // getter
}
