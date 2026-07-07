package dev.arul.Login.controller;

import dev.arul.Login.model.Course;
import dev.arul.Login.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setName(courseDetails.getName());
            course.setDescription(courseDetails.getDescription());
            course.setDuration(courseDetails.getDuration());
            course.setTrainer(courseDetails.getTrainer());
            return ResponseEntity.ok(courseRepository.save(course));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
