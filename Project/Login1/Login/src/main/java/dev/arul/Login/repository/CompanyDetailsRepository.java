package dev.arul.Login.repository;

import dev.arul.Login.model.CompanyDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyDetailsRepository extends JpaRepository<CompanyDetails, Long> {
}
