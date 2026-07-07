// SmileTech Portal Shared Javascript Logic Controller

const SESSION_KEY = 'smiletech_session';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verify Active Session & Route Guards
    checkSessionState();

    // 2. Initialize Active Navigation Highlight
    highlightActiveNavbarLink();

    // 3. Initialize Scroll-to-Top Button
    setupScrollToTop();

    // 4. Initialize Lightbox popup for Gallery
    setupGalleryLightbox();

    // 5. Populate dropdowns in application.html dynamically from DB
    populateDropdowns();

    // 6. Initialize Feedback & Reviews display
    setupFeedbackSystem();

    // 7. Load Courses dynamically from DB
    loadCourses();

    // 8. Load Internships dynamically from DB
    loadInternships();
});

// Session Verification & Page Route Guards
function checkSessionState() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check if on gateway index.html page
    if (currentPath === 'index.html') {
        const authContent = document.getElementById('auth-content');
        const publicContent = document.getElementById('public-content');
        const urlParams = new URLSearchParams(window.location.search);
        
        if (session) {
            // Logged in: show home portal
            if (authContent) authContent.classList.add('d-none');
            if (publicContent) publicContent.classList.remove('d-none');
            
            const userLabel = document.getElementById('nav-session-user');
            if (userLabel) {
                userLabel.textContent = `Welcome, ${session.fullName || 'User'}`;
            }
        } else {
            // Guest: show only login/register gateway
            if (authContent) authContent.classList.remove('d-none');
            if (publicContent) publicContent.classList.add('d-none');

            // If redirected here due to route guard
            if (urlParams.get('redirect')) {
                const loginAlert = document.getElementById('login-validation-alert');
                if (loginAlert) {
                    showAlert(loginAlert, "warning", "Access Restricted: Please login to view page content.");
                }
            }
        }
    } else {
        // We are on an inner page (about.html, courses.html, etc.)
        // If not logged in, redirect immediately to index.html with a warning parameter
        if (!session) {
            window.location.href = 'index.html?redirect=true';
        }
    }
}

// Highlight the current page link in Navbar
function highlightActiveNavbarLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll to Top Button controller
function setupScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('title', 'Scroll to Top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Prepopulate course or internship selection from URL query parameters
function prepopulateApplicationForm() {
    const courseSelect = document.getElementById('app-selected-course');
    const domainSelect = document.getElementById('app-selected-domain');
    if (!courseSelect) return; // not on application.html

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourse = urlParams.get('course');
    const selectedDomain = urlParams.get('domain');

    if (selectedCourse) {
        // Find matching option in course dropdown
        for (let i = 0; i < courseSelect.options.length; i++) {
            if (courseSelect.options[i].value.toLowerCase().includes(selectedCourse.toLowerCase()) || 
                selectedCourse.toLowerCase().includes(courseSelect.options[i].value.toLowerCase())) {
                courseSelect.selectedIndex = i;
                break;
            }
        }
    }

    if (selectedDomain) {
        // Find matching option in domain dropdown
        for (let i = 0; i < domainSelect.options.length; i++) {
            if (domainSelect.options[i].value.toLowerCase().includes(selectedDomain.toLowerCase()) || 
                selectedDomain.toLowerCase().includes(domainSelect.options[i].value.toLowerCase())) {
                domainSelect.selectedIndex = i;
                break;
            }
        }
    }
}

// Gallery Filtering and Lightbox Modal Controller
function setupGalleryLightbox() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return; // not on gallery.html

    // Lightbox modal HTML setup dynamically if not present
    let lightboxModal = document.getElementById('lightboxModal');
    if (!lightboxModal) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal fade lightbox-modal';
        modalDiv.id = 'lightboxModal';
        modalDiv.tabIndex = -1;
        modalDiv.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close-btn" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                        <img src="" id="lightbox-img" class="img-fluid" alt="Gallery Zoom">
                        <div class="text-center text-white py-2 small fw-bold" id="lightbox-caption" style="position:absolute; bottom: -30px; left:0; width:100%"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
        lightboxModal = modalDiv;
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    // Click handler for images
    const items = document.querySelectorAll('.gallery-grid-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            const imgCaption = item.querySelector('.overlay h4').textContent;
            
            lightboxImg.setAttribute('src', imgSrc);
            lightboxCaption.textContent = imgCaption;

            // Trigger Bootstrap modal
            const bsModal = new bootstrap.Modal(lightboxModal);
            bsModal.show();
        });
    });
}

// Gallery Filtering trigger
function filterGallery(category) {
    const buttons = document.querySelectorAll('#gallery-filters .gallery-filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    const items = document.querySelectorAll('.gallery-grid-item');
    items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
            item.parentElement.classList.remove('d-none');
        } else {
            item.parentElement.classList.add('d-none');
        }
    });
}

// Populate dropdowns in application.html dynamically from DB
function populateDropdowns() {
    const courseSelect = document.getElementById('app-selected-course');
    const domainSelect = document.getElementById('app-selected-domain');
    if (!courseSelect && !domainSelect) return;

    if (courseSelect) {
        fetch('http://localhost:8080/api/courses')
            .then(res => res.json())
            .then(courses => {
                const defaultOpt = courseSelect.options[0];
                courseSelect.innerHTML = '';
                courseSelect.appendChild(defaultOpt);
                courses.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.name + " (Course)";
                    opt.textContent = c.name + " (" + c.duration + ")";
                    courseSelect.appendChild(opt);
                });
                return fetch('http://localhost:8080/api/internships');
            })
            .then(res => res.json())
            .then(internships => {
                internships.forEach(i => {
                    const opt = document.createElement('option');
                    opt.value = i.name;
                    opt.textContent = i.name + " (" + i.duration + ")";
                    courseSelect.appendChild(opt);
                });
                prepopulateApplicationForm();
            })
            .catch(err => console.error("Error populating course dropdown:", err));
    }

    if (domainSelect) {
        fetch('http://localhost:8080/api/domains')
            .then(res => res.json())
            .then(domains => {
                const defaultOpt = domainSelect.options[0];
                domainSelect.innerHTML = '';
                domainSelect.appendChild(defaultOpt);
                domains.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d.name;
                    opt.textContent = d.name;
                    domainSelect.appendChild(opt);
                });
                prepopulateApplicationForm();
            })
            .catch(err => console.error("Error populating domains dropdown:", err));
    }
}

// Database Feedback Integration
function setupFeedbackSystem() {
    const listContainer = document.getElementById('feedback-list-container');
    if (!listContainer) return;

    fetch('http://localhost:8080/api/feedbacks')
        .then(res => res.json())
        .then(feedbacks => {
            listContainer.innerHTML = '';
            feedbacks.sort((a, b) => b.id - a.id);

            const isIndex = window.location.pathname.split('/').pop() !== 'feedback.html';
            const renderList = isIndex ? feedbacks.slice(0, 3) : feedbacks;

            if (renderList.length === 0) {
                listContainer.innerHTML = '<div class="col-12 text-center text-muted py-4">No reviews available. Be the first to write one!</div>';
                return;
            }

            renderList.forEach(item => {
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    stars += i <= item.rating 
                        ? '<i class="fa-solid fa-star star-rating"></i>' 
                        : '<i class="fa-regular fa-star text-muted"></i>';
                }

                listContainer.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="feedback-card h-100">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 class="h6 text-dark mb-0 fw-bold">${item.name}</h4>
                                    <span class="small text-muted" style="font-size:0.75rem;">${item.email}</span>
                                </div>
                                <div class="text-warning">${stars}</div>
                            </div>
                            <p class="text-muted small mb-0">"${item.message}"</p>
                            <div class="text-end text-muted small mt-2" style="font-size: 0.7rem;">Review Date: ${item.date || 'Recent'}</div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error("Error loading feedbacks:", err);
            listContainer.innerHTML = '<div class="col-12 text-center text-danger py-4">Error loading reviews from database server.</div>';
        });
}

// Handle feedback submission
function handleFeedbackSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('feedback-name').value.trim();
    const email = document.getElementById('feedback-email').value.trim();
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const message = document.getElementById('feedback-message').value.trim();

    if (!ratingInput) {
        alert('Please select a star rating!');
        return;
    }
    const rating = parseInt(ratingInput.value);

    fetch('http://localhost:8080/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, message })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('feedback-form').reset();
        setupFeedbackSystem();
        alert('Thank you! Your feedback has been registered and is now loaded from our PostgreSQL database.');
    })
    .catch(err => {
        console.error("Error submitting feedback:", err);
        alert("Error submitting feedback to server. Is the backend running?");
    });
}

// Student Application Form Validation
function validateApplicationForm(event) {
    event.preventDefault();
    const name = document.getElementById('app-name').value.trim();
    const email = document.getElementById('app-email').value.trim();
    const phone = document.getElementById('app-phone').value.trim();
    const whatsapp = document.getElementById('app-whatsapp').value.trim();
    const college = document.getElementById('app-college').value.trim();
    const dept = document.getElementById('app-dept').value.trim();
    const year = document.getElementById('app-year').value;
    const address = document.getElementById('app-address').value.trim();
    const course = document.getElementById('app-selected-course').value;
    const domain = document.getElementById('app-selected-domain').value;
    const teamSize = parseInt(document.getElementById('app-teamsize').value);

    const alertDiv = document.getElementById('app-validation-alert');
    alertDiv.className = "alert d-none"; // reset

    if (!name || !email || !phone || !whatsapp || !college || !dept || !year || !address || !course || !domain || !teamSize) {
        showAlert(alertDiv, "danger", "Please fill in all the required form fields.");
        return false;
    }

    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showAlert(alertDiv, "danger", "Invalid Phone Number. It must be exactly 10 digits and start with 6-9.");
        document.getElementById('app-phone').focus();
        return false;
    }
    if (!phoneRegex.test(whatsapp)) {
        showAlert(alertDiv, "danger", "Invalid WhatsApp Number. It must be exactly 10 digits.");
        document.getElementById('app-whatsapp').focus();
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert(alertDiv, "danger", "Invalid Email Address. Please enter a valid email format.");
        document.getElementById('app-email').focus();
        return false;
    }

    const allowedSizes = [2, 4, 6];
    if (!allowedSizes.includes(teamSize)) {
        showAlert(alertDiv, "danger", "Validation Error: Team Size must be exactly 2, 4, or 6 members.");
        document.getElementById('app-teamsize').focus();
        return false;
    }

    fetch('http://localhost:8080/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            email,
            phone,
            whatsapp,
            college,
            department: dept,
            yearOfStudy: year,
            address,
            selectedCourse: course,
            selectedDomain: domain,
            teamSize
        })
    })
    .then(res => res.json())
    .then(data => {
        showAlert(alertDiv, "success", `Registration Successful! Application Submitted for ${course} under ${domain}. Team Size: ${teamSize} members.`);
        document.getElementById('application-form').reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => {
        console.error("Error submitting application:", err);
        showAlert(alertDiv, "danger", "Server connection error. Is the backend running on port 8080?");
    });

    return true;
}

// Load courses dynamically from database
function loadCourses() {
    const listContainer = document.getElementById('courses-list-container');
    if (!listContainer) return;

    fetch('http://localhost:8080/api/courses')
        .then(res => res.json())
        .then(courses => {
            listContainer.innerHTML = '';
            
            const getSvg = (name) => {
                const lower = name.toLowerCase();
                if (lower.includes('java full')) return 'images/gallery/training/training_1.svg';
                if (lower.includes('python full')) return 'images/gallery/training/training_5.svg';
                if (lower.includes('html')) return 'images/gallery/training/training_4.svg';
                if (lower.includes('css')) return 'images/gallery/training/training_4.svg';
                if (lower.includes('javascript')) return 'images/gallery/training/training_5.svg';
                if (lower.includes('bootstrap')) return 'images/gallery/training/training_4.svg';
                if (lower.includes('react')) return 'images/gallery/training/training_4.svg';
                if (lower.includes('c programming')) return 'images/gallery/training/training_5.svg';
                if (lower.includes('c++')) return 'images/gallery/training/training_5.svg';
                if (lower.includes('embedded')) return 'images/gallery/training/training_2.svg';
                return 'images/gallery/training/training_3.svg';
            };

            courses.forEach(c => {
                const svg = getSvg(c.name);
                listContainer.innerHTML += `
                    <div class="col-lg-4 col-md-6">
                        <div class="image-card">
                            <div class="image-card-img">
                                <img src="${svg}" alt="${c.name}" onerror="this.src='https://placehold.co/600x400/0f172a/0ea5e9?text=${encodeURIComponent(c.name)}'">
                            </div>
                            <div class="image-card-body">
                                <span class="badge bg-primary mb-2">${c.duration} | Trainer: ${c.trainer}</span>
                                <h3 class="h5 text-dark-blue fw-bold">${c.name}</h3>
                                <p class="small text-muted mb-4">${c.description}</p>
                                <a href="application.html?course=${encodeURIComponent(c.name)}&domain=${encodeURIComponent(c.name.split(' ')[0])}" class="btn btn-primary-custom w-100">Apply Course</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error("Error loading courses:", err);
            listContainer.innerHTML = '<div class="col-12 text-center text-danger py-4">Error loading courses from server.</div>';
        });
}

// Load internships dynamically from database
function loadInternships() {
    const listContainer = document.getElementById('internships-list-container');
    if (!listContainer) return;

    fetch('http://localhost:8080/api/internships')
        .then(res => res.json())
        .then(internships => {
            listContainer.innerHTML = '';

            const getSvg = (name) => {
                const lower = name.toLowerCase();
                if (lower.includes('java')) return 'images/gallery/internships/internship_1.svg';
                if (lower.includes('python')) return 'images/gallery/internships/internship_4.svg';
                if (lower.includes('web')) return 'images/gallery/internships/internship_3.svg';
                if (lower.includes('ai')) return 'images/gallery/internships/internship_5.svg';
                if (lower.includes('iot')) return 'images/gallery/internships/internship_2.svg';
                return 'images/gallery/internships/internship_3.svg';
            };

            internships.forEach(i => {
                const svg = getSvg(i.name);
                listContainer.innerHTML += `
                    <div class="col-lg-4 col-md-6">
                        <div class="image-card">
                            <div class="image-card-img">
                                <img src="${svg}" alt="${i.name}" onerror="this.src='https://placehold.co/600x400/0f172a/0ea5e9?text=${encodeURIComponent(i.name)}'">
                            </div>
                            <div class="image-card-body">
                                <span class="badge bg-primary mb-2">${i.duration} | Seats: ${i.seats}</span>
                                <h3 class="h5 text-dark-blue fw-bold">${i.name}</h3>
                                <p class="small text-muted mb-3">Gain real world training, projects experience, and MSME certificates working as an apprentice.</p>
                                <a href="application.html?course=${encodeURIComponent(i.name)}&domain=${encodeURIComponent(i.name.split(' ')[0])}" class="btn btn-primary-custom w-100">Apply Internship</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error("Error loading internships:", err);
            listContainer.innerHTML = '<div class="col-12 text-center text-danger py-4">Error loading internships from server.</div>';
        });
}

// User Registration Validation
function validateRegisterForm(event) {
    event.preventDefault();
    const role = document.getElementById('reg-role').value;
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    const alertDiv = document.getElementById('reg-validation-alert');
    alertDiv.className = "alert d-none"; // reset

    if (!role || !name || !email || !phone || !password || !confirm) {
        showAlert(alertDiv, "danger", "Please fill in all registration fields.");
        return false;
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert(alertDiv, "danger", "Invalid Email Address format.");
        document.getElementById('reg-email').focus();
        return false;
    }

    // Phone check
    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showAlert(alertDiv, "danger", "Invalid Phone Number. It must be exactly 10 digits.");
        document.getElementById('reg-phone').focus();
        return false;
    }

    // Passwords Match
    if (password !== confirm) {
        showAlert(alertDiv, "danger", "Passwords do not match. Please verify.");
        document.getElementById('reg-confirm').focus();
        return false;
    }

    // Password strength check (min 6 characters)
    if (password.length < 6) {
        showAlert(alertDiv, "danger", "Password must be at least 6 characters long.");
        document.getElementById('reg-password').focus();
        return false;
    }

    // Connect to backend register endpoint, sending the selected role to PostgreSQL
    fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, password: password, role: role })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful! Please log in.');
            document.getElementById('register-form').reset();
            
            // Switch tabs using Bootstrap Pills triggers
            const loginTab = document.getElementById('pills-login-tab');
            if (loginTab) loginTab.click();
            
            const emailInput = document.getElementById('login-email');
            if (emailInput) {
                emailInput.value = email;
                document.getElementById('login-password').focus();
            }
        } else {
            showAlert(alertDiv, "danger", data.message || "Registration failed");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert(alertDiv, "danger", "Server connection error. Is backend running on port 8080?");
    });

    return true;
}

// User Login Validation
function validateLoginForm(event) {
    event.preventDefault();
    const role = document.getElementById('login-role').value;
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const alertDiv = document.getElementById('login-validation-alert');
    alertDiv.className = "alert d-none"; // reset

    if (!role || !email || !password) {
        showAlert(alertDiv, "danger", "Please select a role and fill in both Email and Password fields.");
        return false;
    }

    // Connect to backend login endpoint for both admins and users
    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Verify if role matches the database registration role
            if (data.role !== role) {
                showAlert(alertDiv, "danger", `Access Denied: Selected role does not match this account's database role.`);
                return;
            }

            const userName = data.email === 'admin@smiletech.com' ? 'Admin Director' : data.email.split('@')[0];
            showAlert(alertDiv, "success", `Welcome Back! Redirecting...`);
            
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                fullName: userName,
                email: data.email,
                role: data.role
            }));

            setTimeout(() => {
                if (data.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                    if (currentPath === 'login.html') {
                        window.location.href = 'index.html';
                    } else {
                        window.location.reload();
                    }
                }
            }, 1000);
        } else {
            showAlert(alertDiv, "danger", data.message || "Invalid Email or Password");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert(alertDiv, "danger", "Server connection error. Is backend running on port 8080?");
    });
    return true;
}

// Logout controller
function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
}

// Contact Query Form Submission Handler
function handleContactSubmit(event) {
    event.preventDefault();
    alert('Thank you! Your message has been sent successfully. Our support desk will reach out shortly.');
    document.getElementById('contact-query-form').reset();
}

// Utility Show Alert
function showAlert(element, type, message) {
    element.className = `alert alert-${type} py-2 px-3 small mt-3 d-block`;
    element.textContent = message;
}

// Expose functions globally for inline HTML event triggers
window.filterGallery = filterGallery;
window.handleFeedbackSubmit = handleFeedbackSubmit;
window.validateApplicationForm = validateApplicationForm;
window.validateRegisterForm = validateRegisterForm;
window.validateLoginForm = validateLoginForm;
window.handleContactSubmit = handleContactSubmit;
window.handleLogout = handleLogout;
