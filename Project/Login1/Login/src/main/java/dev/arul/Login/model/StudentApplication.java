package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_applications")
public class StudentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String whatsapp;

    @Column(nullable = false)
    private String college;

    @Column(nullable = false)
    private String department;

    @Column(name = "year_of_study", nullable = false)
    private String yearOfStudy;

    @Column(length = 1000, nullable = false)
    private String address;

    @Column(name = "selected_course", nullable = false)
    private String selectedCourse;

    @Column(name = "selected_domain", nullable = false)
    private String selectedDomain;

    @Column(name = "team_size", nullable = false)
    private Integer teamSize;

    @Column(nullable = false)
    private String status; // pending, approved, rejected, completed
}
