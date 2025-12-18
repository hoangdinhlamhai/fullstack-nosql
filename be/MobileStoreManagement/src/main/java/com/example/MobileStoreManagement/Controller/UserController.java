package com.example.MobileStoreManagement.Controller;

import com.example.MobileStoreManagement.DTO.LoginRequest;
import com.example.MobileStoreManagement.DTO.LoginResponse;
import com.example.MobileStoreManagement.DTO.RegisterRequest;
import com.example.MobileStoreManagement.Repository.RoleRepository;
import com.example.MobileStoreManagement.Repository.UserRepository;
import com.example.MobileStoreManagement.Service.RoleService;
import com.example.MobileStoreManagement.Service.UserService;
import com.example.MobileStoreManagement.Entity.Role;
import com.example.MobileStoreManagement.Entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private RoleService roleService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        if (userService.existsBySdt(req.getSdt())) {
            return ResponseEntity.badRequest().body("SĐT đã tồn tại");
        }

        // check role tồn tại
        Role role = roleRepository.findById("693400b32d6b723a60534f15")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền"));

        User user = new User();
        user.setSdt(req.getSdt());
        user.setPassword(passwordEncoder.encode(req.getMatKhau()));
        user.setAddress(req.getDiaChi());
        user.setFullName(req.getHoVaTen());
        user.setEmail(req.getEmail());
        user.setRoleId(role.getRoleId()); // ✅ CHỈ LƯU STRING

        userService.saveUser(user);

        return ResponseEntity.ok("Đăng ký thành công");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        String input = (req.getSdt() != null && !req.getSdt().isBlank())
                ? req.getSdt()
                : req.getEmail();

        Optional<User> optionalUser = userRepository.findBySdt(input);
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByEmail(input);
        }

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Không tìm thấy người dùng");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(req.getMatKhau(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Sai mật khẩu");
        }

        // 🔥 LẤY ROLE
        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        LoginResponse response = new LoginResponse(
                user.getUserId(),
                user.getSdt(),
                user.getFullName(),
                user.getEmail(),
                role.getRoleName() // ✅ OK
        );

        return ResponseEntity.ok(response);
    }



    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Nếu dùng session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // xóa session hiện tại
        }

        return ResponseEntity.ok("Đăng xuất thành công");
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/sdt/{sdt}")
    public ResponseEntity<User> getUserBySdt(@PathVariable String sdt) {
        User user = userService.getBySdt(sdt);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        User existingUser = userService.getById(id);

        if(userDetails.getFullName() != null)
            existingUser.setFullName(userDetails.getFullName());
        if(userDetails.getEmail() != null)
            existingUser.setEmail(userDetails.getEmail());
        if(userDetails.getSdt() != null)
            existingUser.setSdt(userDetails.getSdt());
        if(userDetails.getAddress() != null)
            existingUser.setAddress(userDetails.getAddress());
        if(userDetails.getAvatar() != null)
            existingUser.setAvatar(userDetails.getAvatar());
        if(userDetails.getPassword() != null)
            existingUser.setPassword(userDetails.getPassword());
        if(userDetails.getRoleId() != null)
            existingUser.setRoleId(userDetails.getRoleId());
        if(userDetails.getGoogleId() != null)
            existingUser.setGoogleId(userDetails.getGoogleId());

        User updatedUser = userService.saveUser(existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteById(id);
    }

    @DeleteMapping("/by-sdt/{sdt}")
    public ResponseEntity<?> deleteUserBySdt(@PathVariable String sdt) {

        userService.deleteBySdt(sdt);

        return ResponseEntity.ok("Đã xóa (khóa) user với SĐT: " + sdt);
    }

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest req) {

        if (userService.existsBySdt(req.getSdt())) {
            return ResponseEntity.badRequest().body("SĐT đã tồn tại");
        }

        // check role tồn tại
        Role role = roleRepository.findById(req.getRoleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền"));

        User user = new User();
        user.setSdt(req.getSdt());
        user.setPassword(passwordEncoder.encode(req.getMatKhau()));
        user.setAddress(req.getDiaChi());
        user.setFullName(req.getHoVaTen());
        user.setEmail(req.getEmail());
        user.setRoleId(role.getRoleId()); // chỉ lưu ID

        userService.saveUser(user);

        return ResponseEntity.ok("Đăng ký thành công");
    }

}
