package dev.arul.Login.repository;

import dev.arul.Login.model.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
}
