package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "project_domains")
public class ProjectDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
