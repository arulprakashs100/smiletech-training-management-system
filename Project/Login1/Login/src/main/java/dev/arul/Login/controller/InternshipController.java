package dev.arul.Login.controller;

import dev.arul.Login.model.Internship;
import dev.arul.Login.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "*")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    @PostMapping
    public Internship createInternship(@RequestBody Internship internship) {
        return internshipRepository.save(internship);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internshipDetails) {
        Optional<Internship> optionalInternship = internshipRepository.findById(id);
        if (optionalInternship.isPresent()) {
            Internship internship = optionalInternship.get();
            internship.setName(internshipDetails.getName());
            internship.setDuration(internshipDetails.getDuration());
            internship.setSeats(internshipDetails.getSeats());
            return ResponseEntity.ok(internshipRepository.save(internship));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        if (internshipRepository.existsById(id)) {
            internshipRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
