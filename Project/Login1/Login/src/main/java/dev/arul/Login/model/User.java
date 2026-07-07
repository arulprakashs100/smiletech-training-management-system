package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password; // In a real app, always store hashed passwords

    @Column(nullable = false)
    private String role; // admin or user
}
