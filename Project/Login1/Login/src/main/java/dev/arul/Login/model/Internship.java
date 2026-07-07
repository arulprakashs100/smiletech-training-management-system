package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private Integer seats;
}
