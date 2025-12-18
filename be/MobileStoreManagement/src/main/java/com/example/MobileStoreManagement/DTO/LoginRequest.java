package com.example.MobileStoreManagement.DTO;

public class LoginRequest {
    private String sdt;
    private String matKhau;
    private String email;

    public LoginRequest(String sdt, String matKhau,String email) {
        this.sdt = sdt;
        this.matKhau = matKhau;
        this.email = email;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
