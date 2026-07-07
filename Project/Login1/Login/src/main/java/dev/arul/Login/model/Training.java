package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "trainings")
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private String trainer;
}
