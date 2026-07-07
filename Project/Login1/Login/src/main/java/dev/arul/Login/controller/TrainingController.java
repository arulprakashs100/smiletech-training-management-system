package dev.arul.Login.controller;

import dev.arul.Login.model.Training;
import dev.arul.Login.repository.TrainingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "*")
public class TrainingController {

    @Autowired
    private TrainingRepository trainingRepository;

    @GetMapping
    public List<Training> getAllTrainings() {
        return trainingRepository.findAll();
    }

    @PostMapping
    public Training createTraining(@RequestBody Training training) {
        return trainingRepository.save(training);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Training> updateTraining(@PathVariable Long id, @RequestBody Training trainingDetails) {
        Optional<Training> optionalTraining = trainingRepository.findById(id);
        if (optionalTraining.isPresent()) {
            Training training = optionalTraining.get();
            training.setName(trainingDetails.getName());
            training.setDuration(trainingDetails.getDuration());
            training.setTrainer(trainingDetails.getTrainer());
            return ResponseEntity.ok(trainingRepository.save(training));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        if (trainingRepository.existsById(id)) {
            trainingRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
