package dev.arul.Login.controller;

import dev.arul.Login.model.Feedback;
import dev.arul.Login.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        if (feedback.getDate() == null || feedback.getDate().isEmpty()) {
            feedback.setDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        return feedbackRepository.save(feedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
