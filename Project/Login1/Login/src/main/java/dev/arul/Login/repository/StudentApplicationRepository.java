package dev.arul.Login.repository;

import dev.arul.Login.model.StudentApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, Long> {
}
