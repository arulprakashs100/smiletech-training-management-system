package dev.arul.Login.controller;

import dev.arul.Login.model.Workshop;
import dev.arul.Login.repository.WorkshopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workshops")
@CrossOrigin(origins = "*")
public class WorkshopController {

    @Autowired
    private WorkshopRepository workshopRepository;

    @GetMapping
    public List<Workshop> getAllWorkshops() {
        return workshopRepository.findAll();
    }

    @PostMapping
    public Workshop createWorkshop(@RequestBody Workshop workshop) {
        return workshopRepository.save(workshop);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workshop> updateWorkshop(@PathVariable Long id, @RequestBody Workshop workshopDetails) {
        Optional<Workshop> optionalWorkshop = workshopRepository.findById(id);
        if (optionalWorkshop.isPresent()) {
            Workshop workshop = optionalWorkshop.get();
            workshop.setName(workshopDetails.getName());
            workshop.setTrainer(workshopDetails.getTrainer());
            workshop.setDate(workshopDetails.getDate());
            workshop.setSeats(workshopDetails.getSeats());
            return ResponseEntity.ok(workshopRepository.save(workshop));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable Long id) {
        if (workshopRepository.existsById(id)) {
            workshopRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
