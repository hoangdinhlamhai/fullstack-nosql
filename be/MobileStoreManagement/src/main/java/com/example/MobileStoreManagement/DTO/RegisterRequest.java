package com.example.MobileStoreManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String sdt;
    private String hoVaTen;
    private String email;
    private String diaChi;
    private String matKhau;
    private String roleId;
}
