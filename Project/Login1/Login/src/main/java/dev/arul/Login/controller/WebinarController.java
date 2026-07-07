package dev.arul.Login.controller;

import dev.arul.Login.model.Webinar;
import dev.arul.Login.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "*")
public class WebinarController {

    @Autowired
    private WebinarRepository webinarRepository;

    @GetMapping
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    @PostMapping
    public Webinar createWebinar(@RequestBody Webinar webinar) {
        return webinarRepository.save(webinar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Webinar> updateWebinar(@PathVariable Long id, @RequestBody Webinar webinarDetails) {
        Optional<Webinar> optionalWebinar = webinarRepository.findById(id);
        if (optionalWebinar.isPresent()) {
            Webinar webinar = optionalWebinar.get();
            webinar.setName(webinarDetails.getName());
            webinar.setSpeaker(webinarDetails.getSpeaker());
            webinar.setDate(webinarDetails.getDate());
            webinar.setTime(webinarDetails.getTime());
            return ResponseEntity.ok(webinarRepository.save(webinar));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWebinar(@PathVariable Long id) {
        if (webinarRepository.existsById(id)) {
            webinarRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
