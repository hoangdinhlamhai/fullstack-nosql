package com.example.MobileStoreManagement.Service;

import com.example.MobileStoreManagement.Repository.UserRepository;
import com.example.MobileStoreManagement.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;


    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }


    public User getBySdt(String sdt) {
        return userRepository.findBySdt(sdt)
                .orElseThrow(() -> new RuntimeException("User not found with phone number: " + sdt));
    }


    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }


    public boolean existsBySdt(String sdt) {
        return userRepository.existsBySdt(sdt);
    }


    public User saveUser(User user) {
        return userRepository.save(user);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public void deleteById(String id) {
        User user = getById(id);
        user.setDeleted(true);
        userRepository.save(user);
    }

    public void deleteBySdt(String sdt) {

        if (sdt == null || sdt.trim().isEmpty()) {
            throw new RuntimeException("SĐT không hợp lệ");
        }

        User user = userRepository
                .findBySdtAndDeletedFalse(sdt.trim())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy user với SĐT: " + sdt)
                );

        // xoá mềm
        user.setDeleted(true);
        userRepository.save(user);
    }
}
