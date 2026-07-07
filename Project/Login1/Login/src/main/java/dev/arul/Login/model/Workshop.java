package dev.arul.Login.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "workshops")
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String trainer;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private Integer seats;
}
