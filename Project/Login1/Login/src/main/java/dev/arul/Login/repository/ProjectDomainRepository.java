package dev.arul.Login.repository;

import dev.arul.Login.model.ProjectDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectDomainRepository extends JpaRepository<ProjectDomain, Long> {
    Optional<ProjectDomain> findByName(String name);
}
