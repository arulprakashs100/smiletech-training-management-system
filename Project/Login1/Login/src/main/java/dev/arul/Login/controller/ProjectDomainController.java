package dev.arul.Login.controller;

import dev.arul.Login.model.ProjectDomain;
import dev.arul.Login.repository.ProjectDomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "*")
public class ProjectDomainController {

    @Autowired
    private ProjectDomainRepository projectDomainRepository;

    @GetMapping
    public List<ProjectDomain> getAllDomains() {
        return projectDomainRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createDomain(@RequestBody ProjectDomain domain) {
        if (projectDomainRepository.findByName(domain.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Domain already exists");
        }
        return ResponseEntity.ok(projectDomainRepository.save(domain));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDomain> updateDomain(@PathVariable Long id, @RequestBody ProjectDomain domainDetails) {
        java.util.Optional<ProjectDomain> optionalDomain = projectDomainRepository.findById(id);
        if (optionalDomain.isPresent()) {
            ProjectDomain domain = optionalDomain.get();
            domain.setName(domainDetails.getName());
            return ResponseEntity.ok(projectDomainRepository.save(domain));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDomain(@PathVariable Long id) {
        if (projectDomainRepository.existsById(id)) {
            projectDomainRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
