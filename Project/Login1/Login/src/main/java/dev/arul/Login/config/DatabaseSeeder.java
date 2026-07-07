package dev.arul.Login.config;

import dev.arul.Login.model.*;
import dev.arul.Login.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ProjectDomainRepository projectDomainRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private WorkshopRepository workshopRepository;

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private StudentApplicationRepository studentApplicationRepository;

    @Autowired
    private CompanyDetailsRepository companyDetailsRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedCourses();
        seedDomains();
        seedInternships();
        seedWorkshops();
        seedWebinars();
        seedTrainings();
        seedFeedbacks();
        seedCompanyDetails();
        seedStudentApplications();
    }

    private void seedCourses() {
        if (courseRepository.count() == 0) {
            Course c1 = new Course();
            c1.setName("Java Full Stack");
            c1.setDescription("Master Java core, spring boot APIs, REST routing, and database integrations.");
            c1.setDuration("3 Months");
            c1.setTrainer("Karan Kumar");

            Course c2 = new Course();
            c2.setName("Python Full Stack");
            c2.setDescription("Learn Django architectures, databases queries, ORMs, and servers hosting.");
            c2.setDuration("3 Months");
            c2.setTrainer("Anjali Sharma");

            Course c3 = new Course();
            c3.setName("HTML");
            c3.setDescription("Understand semantic markup layout, SEO, forms validations, and structures.");
            c3.setDuration("2 Weeks");
            c3.setTrainer("Rohit Sen");

            Course c4 = new Course();
            c4.setName("CSS");
            c4.setDescription("Design Flexbox grids, keyframe web animations, media queries, and variables.");
            c4.setDuration("2 Weeks");
            c4.setTrainer("Rohit Sen");

            Course c5 = new Course();
            c5.setName("JavaScript");
            c5.setDescription("Learn ES6 classes, DOM operations, Promises async fetch, and localStorage.");
            c5.setDuration("1 Month");
            c5.setTrainer("Meera Nair");

            Course c6 = new Course();
            c6.setName("Bootstrap");
            c6.setDescription("Create responsive grids, navbar menus, tables, and modal elements rapidly.");
            c6.setDuration("2 Weeks");
            c6.setTrainer("Rohit Sen");

            Course c7 = new Course();
            c7.setName("React.js");
            c7.setDescription("Build Single Page Apps using hooks states, contexts, and routes systems.");
            c7.setDuration("2 Months");
            c7.setTrainer("Karan Kumar");

            Course c8 = new Course();
            c8.setName("C Programming");
            c8.setDescription("Master pointer algorithms, struct nodes, dynamic memory allocations, and files.");
            c8.setDuration("1 Month");
            c8.setTrainer("Vijay Singh");

            Course c9 = new Course();
            c9.setName("C++");
            c9.setDescription("Deep dive in Object Oriented inheritances, templates, and STL container lists.");
            c9.setDuration("1 Month");
            c9.setTrainer("Vijay Singh");

            Course c10 = new Course();
            c10.setName("Embedded C");
            c10.setDescription("Configure hardware timers, SPI networks, registers, and ADC values.");
            c10.setDuration("2 Months");
            c10.setTrainer("Vijay Singh");

            Course c11 = new Course();
            c11.setName("SQL");
            c11.setDescription("Build optimized schemas, primary-foreign constraints, joins, and triggers.");
            c11.setDuration("1 Month");
            c11.setTrainer("Meera Nair");

            courseRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11));
            System.out.println("Seeded 11 courses successfully.");
        }
    }

    private void seedDomains() {
        if (projectDomainRepository.count() == 0) {
            String[] list = {
                "Machine Learning", "Deep Learning", "Artificial Intelligence", "Robotics", 
                "Cloud Computing", "Internet of Things", "Embedded Systems", "Image Processing", 
                "PHP", "React.js", "Java", "Python", "Web Technology", "Power Electronics"
            };
            for (String name : list) {
                ProjectDomain d = new ProjectDomain();
                d.setName(name);
                projectDomainRepository.save(d);
            }
            System.out.println("Seeded 14 project domains successfully.");
        }
    }

    private void seedInternships() {
        if (internshipRepository.count() == 0) {
            Internship i1 = new Internship(); i1.setName("Java Internship"); i1.setDuration("3 Months"); i1.setSeats(20);
            Internship i2 = new Internship(); i2.setName("Python Internship"); i2.setDuration("3 Months"); i2.setSeats(15);
            Internship i3 = new Internship(); i3.setName("Web Development Internship"); i3.setDuration("1 Month"); i3.setSeats(30);
            Internship i4 = new Internship(); i4.setName("AI Internship"); i4.setDuration("6 Months"); i4.setSeats(10);
            Internship i5 = new Internship(); i5.setName("IoT Internship"); i5.setDuration("3 Months"); i5.setSeats(12);
            Internship i6 = new Internship(); i6.setName("Cloud Internship"); i6.setDuration("3 Months"); i6.setSeats(18);

            internshipRepository.saveAll(Arrays.asList(i1, i2, i3, i4, i5, i6));
            System.out.println("Seeded 6 internships successfully.");
        }
    }

    private void seedWorkshops() {
        if (workshopRepository.count() == 0) {
            Workshop w1 = new Workshop(); w1.setName("AI & ML Workshop"); w1.setTrainer("Karan Kumar"); w1.setDate("2026-07-25"); w1.setSeats(150);
            Workshop w2 = new Workshop(); w2.setName("IoT Systems Lab"); w2.setTrainer("Vijay Singh"); w2.setDate("2026-08-05"); w2.setSeats(80);
            workshopRepository.saveAll(Arrays.asList(w1, w2));
            System.out.println("Seeded workshops.");
        }
    }

    private void seedWebinars() {
        if (webinarRepository.count() == 0) {
            Webinar w1 = new Webinar(); w1.setName("Cloud Deployments Scale"); w1.setSpeaker("Sanjay Raj"); w1.setDate("2026-07-30"); w1.setTime("11:00 AM");
            Webinar w2 = new Webinar(); w2.setName("Git Workflow Practices"); w2.setSpeaker("Malini Sen"); w2.setDate("2026-08-10"); w2.setTime("03:00 PM");
            webinarRepository.saveAll(Arrays.asList(w1, w2));
            System.out.println("Seeded webinars.");
        }
    }

    private void seedTrainings() {
        if (trainingRepository.count() == 0) {
            Training t1 = new Training(); t1.setName("Java Full Stack"); t1.setDuration("3 Months"); t1.setTrainer("Karan Kumar");
            Training t2 = new Training(); t2.setName("Python Full Stack"); t2.setDuration("3 Months"); t2.setTrainer("Anjali Sharma");
            Training t3 = new Training(); t3.setName("Web Development"); t3.setDuration("1 Month"); t3.setTrainer("Rohit Sen");
            Training t4 = new Training(); t4.setName("React.js"); t4.setDuration("2 Months"); t4.setTrainer("Karan Kumar");
            trainingRepository.saveAll(Arrays.asList(t1, t2, t3, t4));
            System.out.println("Seeded trainings.");
        }
    }

    private void seedFeedbacks() {
        if (feedbackRepository.count() == 0) {
            Feedback f1 = new Feedback(); f1.setName("Karthik Raja"); f1.setEmail("karthik@gmail.com"); f1.setRating(5); f1.setMessage("I completed my Python Full Stack training at SmileTech. The hands-on projects were incredible."); f1.setDate("2026-06-15");
            Feedback f2 = new Feedback(); f2.setName("Priya Dharshini"); f2.setEmail("priya@gmail.com"); f2.setRating(5); f2.setMessage("Excellent Embedded Systems workshop! The hardware kits provided were state-of-the-art."); f2.setDate("2026-06-20");
            feedbackRepository.saveAll(Arrays.asList(f1, f2));
            System.out.println("Seeded feedbacks.");
        }
    }

    private void seedCompanyDetails() {
        if (companyDetailsRepository.count() == 0) {
            CompanyDetails c = new CompanyDetails();
            c.setName("SmileTech Training & Project Management System");
            c.setAddress("SmileTech Tower, 4th Floor, AV Road, Coimbatore - 641012.");
            c.setEmail("info@smiletech.com");
            c.setPhone("+91 94422 12345");
            c.setBranches("Coimbatore (HQ), Chennai, Trichy");
            c.setAbout("SmileTech is a leading educational technology provider empowering students through industrial internships, final-year project guidance, and professional certification courses.");
            companyDetailsRepository.save(c);
            System.out.println("Seeded company details.");
        }
    }

    private void seedStudentApplications() {
        if (studentApplicationRepository.count() == 0) {
            StudentApplication s1 = new StudentApplication();
            s1.setName("Ramesh Kumar"); s1.setEmail("ramesh@gmail.com"); s1.setPhone("9876543210"); s1.setWhatsapp("9876543210");
            s1.setCollege("PSG College of Technology"); s1.setDepartment("CSE"); s1.setYearOfStudy("4th Year");
            s1.setAddress("AV Road, Coimbatore"); s1.setSelectedCourse("Java Full Stack (Course)");
            s1.setSelectedDomain("Java"); s1.setTeamSize(2); s1.setStatus("approved");

            StudentApplication s2 = new StudentApplication();
            s2.setName("Divya Dharshini"); s2.setEmail("divya@gmail.com"); s2.setPhone("9876543211"); s2.setWhatsapp("9876543211");
            s2.setCollege("CIT Coimbatore"); s2.setDepartment("IT"); s2.setYearOfStudy("3rd Year");
            s2.setAddress("OMR Road, Chennai"); s2.setSelectedCourse("Python Internship");
            s2.setSelectedDomain("Python"); s2.setTeamSize(4); s2.setStatus("pending");

            StudentApplication s3 = new StudentApplication();
            s3.setName("Suresh Raina"); s3.setEmail("suresh@gmail.com"); s3.setPhone("9876543212"); s3.setWhatsapp("9876543212");
            s3.setCollege("KCT Coimbatore"); s3.setDepartment("ECE"); s3.setYearOfStudy("4th Year");
            s3.setAddress("AV Road, Coimbatore"); s3.setSelectedCourse("Web Development Internship");
            s3.setSelectedDomain("Web Technology"); s3.setTeamSize(6); s3.setStatus("completed");

            StudentApplication s4 = new StudentApplication();
            s4.setName("Malini Sen"); s4.setEmail("malini@gmail.com"); s4.setPhone("9876543213"); s4.setWhatsapp("9876543213");
            s4.setCollege("Amrita Vishwa Vidyapeetham"); s4.setDepartment("CSE"); s4.setYearOfStudy("2nd Year");
            s4.setAddress("AV Road, Coimbatore"); s4.setSelectedCourse("AI Internship");
            s4.setSelectedDomain("Artificial Intelligence"); s4.setTeamSize(2); s4.setStatus("rejected");

            studentApplicationRepository.saveAll(Arrays.asList(s1, s2, s3, s4));
            System.out.println("Seeded student applications.");
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin Director");
            admin.setEmail("admin@smiletech.com");
            admin.setPassword("admin123");
            admin.setRole("admin");

            User u1 = new User();
            u1.setName("Ramesh Kumar");
            u1.setEmail("ramesh@gmail.com");
            u1.setPassword("user123");
            u1.setRole("user");

            User u2 = new User();
            u2.setName("ARUL PRAKASH S");
            u2.setEmail("arulprakashs@gmail.com");
            u2.setPassword("Arul@123");
            u2.setRole("user");

            User u3 = new User();
            u3.setName("Sample");
            u3.setEmail("demo@gmail.com");
            u3.setPassword("Demo@123");
            u3.setRole("user");

            userRepository.saveAll(Arrays.asList(admin, u1, u2, u3));
            System.out.println("Seeded default users (including admin@smiletech.com).");
        }
    }
}
