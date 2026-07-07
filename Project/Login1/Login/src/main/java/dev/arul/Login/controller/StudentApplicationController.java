package dev.arul.Login.controller;

import dev.arul.Login.model.StudentApplication;
import dev.arul.Login.repository.StudentApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class StudentApplicationController {

    @Autowired
    private StudentApplicationRepository studentApplicationRepository;

    @GetMapping
    public List<StudentApplication> getAllApplications() {
        return studentApplicationRepository.findAll();
    }

    @PostMapping
    public StudentApplication createApplication(@RequestBody StudentApplication application) {
        if (application.getStatus() == null || application.getStatus().isEmpty()) {
            application.setStatus("pending");
        }
        return studentApplicationRepository.save(application);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentApplication> updateApplication(@PathVariable Long id, @RequestBody StudentApplication applicationDetails) {
        Optional<StudentApplication> optionalApp = studentApplicationRepository.findById(id);
        if (optionalApp.isPresent()) {
            StudentApplication application = optionalApp.get();
            application.setName(applicationDetails.getName());
            application.setEmail(applicationDetails.getEmail());
            application.setPhone(applicationDetails.getPhone());
            application.setWhatsapp(applicationDetails.getWhatsapp());
            application.setCollege(applicationDetails.getCollege());
            application.setDepartment(applicationDetails.getDepartment());
            application.setYearOfStudy(applicationDetails.getYearOfStudy());
            application.setAddress(applicationDetails.getAddress());
            application.setSelectedCourse(applicationDetails.getSelectedCourse());
            application.setSelectedDomain(applicationDetails.getSelectedDomain());
            application.setTeamSize(applicationDetails.getTeamSize());
            application.setStatus(applicationDetails.getStatus());
            return ResponseEntity.ok(studentApplicationRepository.save(application));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (studentApplicationRepository.existsById(id)) {
            studentApplicationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
