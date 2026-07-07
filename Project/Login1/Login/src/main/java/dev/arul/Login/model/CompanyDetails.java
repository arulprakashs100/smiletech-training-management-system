package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "company_details")
public class CompanyDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000, nullable = false)
    private String address;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String branches;

    @Column(length = 2000, nullable = false)
    private String about;
}
