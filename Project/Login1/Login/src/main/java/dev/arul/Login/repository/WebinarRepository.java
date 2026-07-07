package dev.arul.Login.repository;

import dev.arul.Login.model.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WebinarRepository extends JpaRepository<Webinar, Long> {
}
