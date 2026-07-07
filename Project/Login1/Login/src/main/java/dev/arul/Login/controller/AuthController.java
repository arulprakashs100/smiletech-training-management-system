package dev.arul.Login.controller;

import dev.arul.Login.dto.LoginRequest;
import dev.arul.Login.dto.LoginResponse;
import dev.arul.Login.model.User;
import dev.arul.Login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(new LoginResponse(true, "Login successful", user.getEmail(), user.getRole()));
            }
        }
        
        return ResponseEntity.status(401).body(new LoginResponse(false, "Invalid email or password", null, null));
    }

    // Registration endpoint supporting roles
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody dev.arul.Login.dto.RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email already exists", null, null));
        }
        
        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(registerRequest.getPassword());
        
        // Save selected role (default to "user" if none specified)
        String userRole = registerRequest.getRole();
        if (userRole == null || userRole.trim().isEmpty()) {
            userRole = "user";
        }
        newUser.setRole(userRole.trim().toLowerCase());
        
        userRepository.save(newUser);
        
        return ResponseEntity.ok(new LoginResponse(true, "Registration successful", newUser.getEmail(), newUser.getRole()));
    }
}
