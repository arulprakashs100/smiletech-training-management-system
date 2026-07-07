// SmileTech Admin Dashboard - Business Logic Controller connected to Spring Boot API

document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is authenticated (session check)
    const session = JSON.parse(localStorage.getItem('smiletech_session'));
    if (!session || session.role !== 'admin') {
        alert('Unauthorized access. Redirecting to gateway login...');
        window.location.href = 'index.html';
        return;
    }

    // Load data and set listeners
    renderAllDashboardSections();
    setupSidebarNavigation();
    setupMobileSidebarToggle();
});

// Load and Render statistics and lists from REST API
function renderAllDashboardSections() {
    const fetchUrls = [
        fetch('http://localhost:8080/api/applications').then(res => res.json()),
        fetch('http://localhost:8080/api/courses').then(res => res.json()),
        fetch('http://localhost:8080/api/domains').then(res => res.json()),
        fetch('http://localhost:8080/api/internships').then(res => res.json()),
        fetch('http://localhost:8080/api/workshops').then(res => res.json()),
        fetch('http://localhost:8080/api/webinars').then(res => res.json()),
        fetch('http://localhost:8080/api/trainings').then(res => res.json()),
        fetch('http://localhost:8080/api/feedbacks').then(res => res.json()),
        fetch('http://localhost:8080/api/company').then(res => res.json())
    ];

    Promise.all(fetchUrls)
        .then(([students, courses, domains, internships, workshops, webinars, trainings, feedbacks, company]) => {
            // 1. Calculate & Render Stats
            document.getElementById('stat-students').textContent = students.length;
            document.getElementById('stat-courses').textContent = courses.length;
            document.getElementById('stat-domains').textContent = domains.length;
            document.getElementById('stat-internships').textContent = internships.length;
            document.getElementById('stat-workshops').textContent = workshops.length;
            document.getElementById('stat-webinars').textContent = webinars.length;
            document.getElementById('stat-training').textContent = trainings.length;
            document.getElementById('stat-projects').textContent = students.filter(s => s.selectedCourse.toLowerCase().includes('internship') || s.selectedCourse.toLowerCase().includes('project')).length;
            document.getElementById('stat-feedback').textContent = feedbacks.length;

            // 2. Render Tables and Grids
            renderStudentsTable(students);
            renderCoursesGrid(courses);
            renderDomainsGrid(domains);
            renderInternshipsGrid(internships);
            renderWorkshopsTable(workshops);
            renderWebinarsList(webinars);
            renderTrainingPrograms(trainings);
            renderFeedbackTable(feedbacks);
            renderCompanyDetails(company);
            
            // Render Admin Profile from session
            const session = JSON.parse(localStorage.getItem('smiletech_session')) || { fullName: 'Admin Director', email: 'admin@smiletech.com' };
            renderAdminProfile({
                name: session.fullName || 'Admin Director',
                email: session.email || 'admin@smiletech.com',
                phone: '+91 94422 11223'
            });

            // Render gallery from localStorage local state
            let galleryList = JSON.parse(localStorage.getItem('smiletech_admin_gallery'));
            if (!galleryList) {
                galleryList = ["office/office_1.svg", "office/office_2.svg", "team/team_1.svg", "workshops/workshop_1.svg"];
                localStorage.setItem('smiletech_admin_gallery', JSON.stringify(galleryList));
            }
            renderGallery(galleryList);
        })
        .catch(err => {
            console.error("Error fetching admin dashboard data from server:", err);
        });
}

// -------------------------------------------------------------
// SIDEBAR & SECTION TOGGLES
// -------------------------------------------------------------
function setupSidebarNavigation() {
    const links = document.querySelectorAll('.admin-sidebar-link[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('navbar-page-title');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = link.getAttribute('data-section');

            // Active links highlights
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Toggle sections
            sections.forEach(sec => {
                if (sec.id === targetSectionId) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });

            // Set Title text
            pageTitle.textContent = link.textContent.trim();

            // Auto-collapse sidebar on mobile
            const sidebar = document.getElementById('admin-sidebar');
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function setupMobileSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// -------------------------------------------------------------
// STUDENTS PLACEMENT MANAGEMENT
// -------------------------------------------------------------
function renderStudentsTable(students) {
    const tableBody = document.getElementById('students-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    students.forEach(student => {
        tableBody.innerHTML += `
            <tr>
                <td><b class="text-dark-blue">${student.name}</b></td>
                <td class="small text-muted">${student.college}</td>
                <td class="small text-muted">${student.selectedCourse}</td>
                <td class="small text-muted">${student.selectedDomain}</td>
                <td class="text-center font-monospace">${student.teamSize}</td>
                <td>
                    <span class="badge-admin-status ${student.status}">${student.status}</span>
                </td>
                <td>
                    <div class="d-flex gap-1 justify-content-center">
                        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="editStudentStatus(${student.id})"><i class="fa-solid fa-rotate"></i></button>
                        <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteStudent(${student.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function editStudentStatus(id) {
    fetch(`http://localhost:8080/api/applications`)
        .then(res => res.json())
        .then(students => {
            const student = students.find(s => s.id === id);
            if (!student) return;

            const newStatus = prompt(`Change status for ${student.name}. Enter one of: pending, approved, rejected, completed`, student.status);
            if (newStatus === null) return;

            const statusClean = newStatus.trim().toLowerCase();
            const validStatuses = ["pending", "approved", "rejected", "completed"];
            
            if (!validStatuses.includes(statusClean)) {
                alert('Invalid Status. Enter only: pending, approved, rejected, completed.');
                return;
            }

            student.status = statusClean;
            return fetch(`http://localhost:8080/api/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error editing student status:", err));
}

function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student application?')) return;
    fetch(`http://localhost:8080/api/applications/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting student:", err));
}

// -------------------------------------------------------------
// COURSES MANAGEMENT
// -------------------------------------------------------------
function renderCoursesGrid(courses) {
    const grid = document.getElementById('courses-grid-container');
    if (!grid) return;

    grid.innerHTML = '';
    courses.forEach(course => {
        grid.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="admin-card">
                    <span class="badge bg-primary text-white position-absolute" style="top: 15px; right: 15px;">${course.duration}</span>
                    <h4 class="h5 mt-2 fw-bold">${course.name}</h4>
                    <p class="small text-muted mb-3" style="min-height: 48px;">${course.description}</p>
                    <div class="border-top pt-2 d-flex justify-content-between align-items-center">
                        <span class="small text-muted">Trainer: <b>${course.trainer}</b></span>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="editCourse(${course.id})"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteCourse(${course.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function addCourse() {
    const name = prompt('Course Name:');
    const desc = prompt('Description:');
    const duration = prompt('Duration (e.g. 3 Months):');
    const trainer = prompt('Trainer Name:');
    if (!name || !desc || !duration || !trainer) return;

    fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: desc.trim(), duration: duration.trim(), trainer: trainer.trim() })
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error adding course:", err));
}

function editCourse(id) {
    fetch('http://localhost:8080/api/courses')
        .then(res => res.json())
        .then(courses => {
            const course = courses.find(c => c.id === id);
            if (!course) return;

            const newTrainer = prompt(`Enter new trainer name for ${course.name}:`, course.trainer);
            const newDuration = prompt(`Enter new duration (e.g. 3 Months):`, course.duration);
            const newDesc = prompt(`Enter new description:`, course.description);
            if (newTrainer === null || newDuration === null || newDesc === null) return;

            course.trainer = newTrainer.trim();
            course.duration = newDuration.trim();
            course.description = newDesc.trim();

            return fetch(`http://localhost:8080/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error updating course details:", err));
}

function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    fetch(`http://localhost:8080/api/courses/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting course:", err));
}

// -------------------------------------------------------------
// PROJECT DOMAINS MANAGEMENT
// -------------------------------------------------------------
function renderDomainsGrid(domains) {
    const container = document.getElementById('domains-grid-container');
    if (!container) return;

    container.innerHTML = '';
    domains.forEach(domain => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div class="admin-card text-center p-3">
                    <h5 class="h6 mb-3 fw-bold text-dark-blue">${domain.name}</h5>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-primary px-2" onclick="editDomain(${domain.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger px-2" onclick="deleteDomain(${domain.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addDomain() {
    const newDomain = prompt('Enter the name of the new Project Domain:');
    if (!newDomain || !newDomain.trim()) return;

    fetch('http://localhost:8080/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDomain.trim() })
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error adding domain:", err));
}

function editDomain(id) {
    fetch('http://localhost:8080/api/domains')
        .then(res => res.json())
        .then(domains => {
            const domain = domains.find(d => d.id === id);
            if (!domain) return;

            const newName = prompt('Modify Project Domain Name:', domain.name);
            if (!newName || !newName.trim()) return;

            domain.name = newName.trim();
            return fetch(`http://localhost:8080/api/domains/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(domain)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error editing domain name:", err));
}

function deleteDomain(id) {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    fetch(`http://localhost:8080/api/domains/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting domain:", err));
}

// -------------------------------------------------------------
// INTERNSHIPS MANAGEMENT
// -------------------------------------------------------------
function renderInternshipsGrid(internships) {
    const container = document.getElementById('internship-grid-container');
    if (!container) return;

    container.innerHTML = '';
    internships.forEach(intern => {
        container.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="admin-card">
                    <span class="badge bg-primary text-white position-absolute" style="top: 15px; right: 15px;">${intern.duration}</span>
                    <h4 class="h5 mt-2 fw-bold text-dark-blue">${intern.name}</h4>
                    <p class="small text-muted mb-3">Available Intake Seats: <b class="text-dark-blue">${intern.seats} Seats</b></p>
                    <div class="d-flex justify-content-end gap-2 border-top pt-2">
                        <button class="btn btn-sm btn-outline-primary py-1 px-3" onclick="editInternship(${intern.id})">Edit Seats</button>
                        <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteInternship(${intern.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addInternship() {
    const name = prompt('Internship Name:');
    const duration = prompt('Duration (e.g. 3 Months):');
    const seats = prompt('Seats Available:');
    if (!name || !duration || !seats) return;

    fetch('http://localhost:8080/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, duration: duration.trim(), seats: parseInt(seats) || 20 })
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error adding internship:", err));
}

function editInternship(id) {
    fetch('http://localhost:8080/api/internships')
        .then(res => res.json())
        .then(internships => {
            const intern = internships.find(i => i.id === id);
            if (!intern) return;

            const newSeats = prompt(`Enter seats limit for ${intern.name}:`, intern.seats);
            const newDuration = prompt(`Enter internship duration:`, intern.duration);
            if (newSeats === null || newDuration === null) return;

            intern.seats = parseInt(newSeats) || 0;
            intern.duration = newDuration.trim();

            return fetch(`http://localhost:8080/api/internships/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(intern)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error updating internship limits:", err));
}

function deleteInternship(id) {
    if (!confirm('Are you sure you want to delete this internship entry?')) return;
    fetch(`http://localhost:8080/api/internships/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting internship:", err));
}

// -------------------------------------------------------------
// WORKSHOPS MANAGEMENT
// -------------------------------------------------------------
function renderWorkshopsTable(workshops) {
    const tbody = document.getElementById('workshops-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    workshops.forEach(work => {
        tbody.innerHTML += `
            <tr>
                <td><b>${work.name}</b></td>
                <td>${work.trainer}</td>
                <td>${work.date}</td>
                <td>${work.seats} Seats Available</td>
                <td>
                    <div class="d-flex gap-1 justify-content-center">
                        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="editWorkshop(${work.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteWorkshop(${work.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function addWorkshop() {
    const name = prompt('Workshop Name:');
    const trainer = prompt('Trainer Name:');
    const date = prompt('Date (YYYY-MM-DD):');
    const seats = prompt('Seats Available:');
    if (!name || !trainer || !date || !seats) return;

    fetch('http://localhost:8080/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, trainer, date, seats: parseInt(seats) || 50 })
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error adding workshop:", err));
}

function editWorkshop(id) {
    fetch('http://localhost:8080/api/workshops')
        .then(res => res.json())
        .then(workshops => {
            const work = workshops.find(w => w.id === id);
            if (!work) return;

            const newSeats = prompt('Change Workshop Seats Limit:', work.seats);
            const newTrainer = prompt('Change Trainer Name:', work.trainer);
            const newDate = prompt('Change Date:', work.date);
            if (newSeats === null || newTrainer === null || newDate === null) return;

            work.seats = parseInt(newSeats) || 50;
            work.trainer = newTrainer.trim();
            work.date = newDate.trim();

            return fetch(`http://localhost:8080/api/workshops/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(work)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error updating workshop:", err));
}

function deleteWorkshop(id) {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    fetch(`http://localhost:8080/api/workshops/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting workshop:", err));
}

// -------------------------------------------------------------
// WEBINARS MANAGEMENT
// -------------------------------------------------------------
function renderWebinarsList(webinars) {
    const container = document.getElementById('webinars-table-body');
    if (!container) return;

    container.innerHTML = '';
    webinars.forEach(web => {
        container.innerHTML += `
            <tr>
                <td><b>${web.name}</b></td>
                <td>${web.speaker}</td>
                <td>${web.date}</td>
                <td>${web.time}</td>
                <td>
                    <div class="d-flex gap-1 justify-content-center">
                        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="editWebinar(${web.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteWebinar(${web.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function addWebinar() {
    const name = prompt('Webinar Topic:');
    const speaker = prompt('Speaker Name:');
    const date = prompt('Date (YYYY-MM-DD):');
    const time = prompt('Time (e.g. 11:00 AM):');
    if (!name || !speaker || !date || !time) return;

    fetch('http://localhost:8080/api/webinars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, speaker, date, time })
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error adding webinar:", err));
}

function editWebinar(id) {
    fetch('http://localhost:8080/api/webinars')
        .then(res => res.json())
        .then(webinars => {
            const web = webinars.find(w => w.id === id);
            if (!web) return;

            const newSpeaker = prompt('Modify Webinar Speaker:', web.speaker);
            const newTime = prompt('Modify Webinar Time:', web.time);
            const newDate = prompt('Modify Date:', web.date);
            if (newSpeaker === null || newTime === null || newDate === null) return;

            web.speaker = newSpeaker.trim();
            web.time = newTime.trim();
            web.date = newDate.trim();

            return fetch(`http://localhost:8080/api/webinars/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(web)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error updating webinar:", err));
}

function deleteWebinar(id) {
    if (!confirm('Are you sure you want to delete this webinar schedule?')) return;
    fetch(`http://localhost:8080/api/webinars/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting webinar:", err));
}

// -------------------------------------------------------------
// TRAINING MANAGEMENT
// -------------------------------------------------------------
function renderTrainingPrograms(training) {
    const tbody = document.getElementById('training-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    training.forEach(train => {
        tbody.innerHTML += `
            <tr>
                <td><b>${train.name}</b></td>
                <td>${train.duration}</td>
                <td>${train.trainer}</td>
                <td>
                    <div class="d-flex gap-1 justify-content-center">
                        <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="editTraining(${train.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteTraining(${train.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function addTraining() {
    const name = prompt('Program Name:');
    const duration = prompt('Duration (e.g. 3 Months):');
    const trainer = prompt('Trainer Name:');
    if (!name || !duration || !trainer) return;

    fetch('http://localhost:8080/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, duration: duration.trim(), trainer: trainer.trim() })
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error adding training program:", err));
}

function editTraining(id) {
    fetch('http://localhost:8080/api/trainings')
        .then(res => res.json())
        .then(trainings => {
            const train = trainings.find(t => t.id === id);
            if (!train) return;

            const newTrainer = prompt('Change Trainer Name:', train.trainer);
            const newDuration = prompt('Change Duration:', train.duration);
            if (newTrainer === null || newDuration === null) return;

            train.trainer = newTrainer.trim();
            train.duration = newDuration.trim();

            return fetch(`http://localhost:8080/api/trainings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(train)
            });
        })
        .then(() => renderAllDashboardSections())
        .catch(err => console.error("Error updating training details:", err));
}

function deleteTraining(id) {
    if (!confirm('Are you sure you want to delete this training program?')) return;
    fetch(`http://localhost:8080/api/trainings/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting training:", err));
}

// -------------------------------------------------------------
// GALLERY MANAGEMENT (localStorage simulation)
// -------------------------------------------------------------
function renderGallery(gallery) {
    const container = document.getElementById('gallery-grid-container');
    if (!container) return;

    container.innerHTML = '';
    gallery.forEach((img, idx) => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="gallery-grid-item" style="aspect-ratio: 4/3; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; position: relative;">
                    <img src="images/gallery/${img}" alt="Gallery Upload" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/400x300/0f172a/0ea5e9?text=Gallery+Image'">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(15,23,42,0.85); padding: 8px; display: flex; justify-content: space-between;">
                        <span class="small text-white-50">${img.split('/').pop()}</span>
                        <button class="btn btn-sm btn-danger py-0 px-2" style="font-size: 0.7rem;" onclick="deleteGalleryImage(${idx})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function handleGalleryUpload(event) {
    event.preventDefault();
    alert('Simulating File Upload. Image file path added.');
    const galleryList = JSON.parse(localStorage.getItem('smiletech_admin_gallery')) || [];
    
    const mockFiles = ["office/office_3.svg", "team/team_2.svg", "workshops/workshop_2.svg", "internships/internship_3.svg", "awards/award_3.svg"];
    const randomImg = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    
    galleryList.push(randomImg);
    localStorage.setItem('smiletech_admin_gallery', JSON.stringify(galleryList));
    renderAllDashboardSections();
}

function deleteGalleryImage(idx) {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    const galleryList = JSON.parse(localStorage.getItem('smiletech_admin_gallery')) || [];
    galleryList.splice(idx, 1);
    localStorage.setItem('smiletech_admin_gallery', JSON.stringify(galleryList));
    renderAllDashboardSections();
}

// -------------------------------------------------------------
// FEEDBACK MANAGEMENT
// -------------------------------------------------------------
function renderFeedbackTable(feedbacks) {
    const tbody = document.getElementById('feedback-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    feedbacks.forEach(feed => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= feed.rating ? '★' : '☆';
        }

        tbody.innerHTML += `
            <tr>
                <td><b>${feed.name}</b></td>
                <td class="text-warning fw-bold">${stars} (${feed.rating}/5)</td>
                <td class="small text-muted">${feed.message}</td>
                <td class="small">${feed.date || 'Recent'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger py-1" onclick="deleteFeedback(${feed.id})"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteFeedback(id) {
    if (!confirm('Are you sure you want to delete this feedback review?')) return;
    fetch(`http://localhost:8080/api/feedbacks/${id}`, {
        method: 'DELETE'
    })
    .then(() => renderAllDashboardSections())
    .catch(err => console.error("Error deleting feedback:", err));
}

// -------------------------------------------------------------
// COMPANY DETAILS
// -------------------------------------------------------------
function renderCompanyDetails(comp) {
    const cName = document.getElementById('company-name');
    const cAddress = document.getElementById('company-address');
    const cEmail = document.getElementById('company-email');
    const cPhone = document.getElementById('company-phone');
    const cBranches = document.getElementById('company-branches');
    const cAbout = document.getElementById('company-about');

    if (!cName) return;

    cName.value = comp.name || '';
    cAddress.value = comp.address || '';
    cEmail.value = comp.email || '';
    cPhone.value = comp.phone || '';
    cBranches.value = comp.branches || '';
    cAbout.value = comp.about || '';
}

function saveCompanyDetails(event) {
    event.preventDefault();
    fetch('http://localhost:8080/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('company-name').value.trim(),
            address: document.getElementById('company-address').value.trim(),
            email: document.getElementById('company-email').value.trim(),
            phone: document.getElementById('company-phone').value.trim(),
            branches: document.getElementById('company-branches').value.trim(),
            about: document.getElementById('company-about').value.trim()
        })
    })
    .then(() => {
        alert('Company information saved successfully to PostgreSQL database!');
        renderAllDashboardSections();
    })
    .catch(err => console.error("Error saving company details:", err));
}

// -------------------------------------------------------------
// ADMIN PROFILE & PASSWORD MANAGEMENT
// -------------------------------------------------------------
function renderAdminProfile(prof) {
    const profName = document.getElementById('profile-name');
    const profEmail = document.getElementById('profile-email');
    const profPhone = document.getElementById('profile-phone');

    if (!profName) return;

    profName.value = prof.name;
    profEmail.value = prof.email;
    profPhone.value = prof.phone;

    // Set Top Navbar credentials
    const navName = document.getElementById('nav-admin-name');
    if (navName) navName.textContent = prof.name;
}

function saveAdminProfile(event) {
    event.preventDefault();
    const newName = document.getElementById('profile-name').value.trim();
    const newEmail = document.getElementById('profile-email').value.trim();

    // In a real application, you'd post this profile back to user auth endpoint.
    // For local convenience, we persist it in the active session.
    const session = JSON.parse(localStorage.getItem('smiletech_session'));
    if (session) {
        session.fullName = newName;
        session.email = newEmail;
        localStorage.setItem('smiletech_session', JSON.stringify(session));
    }

    alert('Admin Profile details updated successfully!');
    renderAllDashboardSections();
}

function changeAdminPassword(event) {
    event.preventDefault();
    const current = document.getElementById('pass-current').value;
    const newPass = document.getElementById('pass-new').value;
    const confirm = document.getElementById('pass-confirm').value;

    if (!current || !newPass || !confirm) {
        alert('Please fill in all password fields.');
        return;
    }

    if (newPass !== confirm) {
        alert('New password and confirmation do not match.');
        return;
    }

    if (newPass.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    alert('Password updated successfully! Note: Demo password updated.');
    document.getElementById('pass-change-form').reset();
}

// Global logout method
function handleAdminLogout() {
    localStorage.removeItem('smiletech_session');
    window.location.href = 'index.html';
}

// Expose functions globally for inline HTML triggers
window.editStudentStatus = editStudentStatus;
window.deleteStudent = deleteStudent;
window.addCourse = addCourse;
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;
window.addDomain = addDomain;
window.editDomain = editDomain;
window.deleteDomain = deleteDomain;
window.addInternship = addInternship;
window.editInternship = editInternship;
window.deleteInternship = deleteInternship;
window.addWorkshop = addWorkshop;
window.editWorkshop = editWorkshop;
window.deleteWorkshop = deleteWorkshop;
window.addWebinar = addWebinar;
window.editWebinar = editWebinar;
window.deleteWebinar = deleteWebinar;
window.addTraining = addTraining;
window.editTraining = editTraining;
window.deleteTraining = deleteTraining;
window.handleGalleryUpload = handleGalleryUpload;
window.deleteGalleryImage = deleteGalleryImage;
window.deleteFeedback = deleteFeedback;
window.saveCompanyDetails = saveCompanyDetails;
window.saveAdminProfile = saveAdminProfile;
window.changeAdminPassword = changeAdminPassword;
window.handleAdminLogout = handleAdminLogout;
