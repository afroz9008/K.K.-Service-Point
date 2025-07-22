// DOM Elements
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const serviceCards = document.querySelectorAll('.service-card');
const statNumbers = document.querySelectorAll('.stat__number');
const testimonialBtns = document.querySelectorAll('.testimonial__nav-btn');
const testimonials = document.querySelectorAll('.testimonial');
const bookingForm = document.getElementById('booking-form');

// Header scroll effect
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// Smooth scrolling for navigation links
function handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
        
        // Update active link
        navLinks.forEach(link => link.classList.remove('active-link'));
        this.classList.add('active-link');
    }
}

// Service cards animation on scroll
function animateServiceCards() {
    serviceCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = cardTop < window.innerHeight - 100;
        
        if (cardVisible && !card.classList.contains('animate')) {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        }
    });
}

// Animated counter for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Statistics counter animation
function handleStatsAnimation() {
    statNumbers.forEach(stat => {
        const statTop = stat.getBoundingClientRect().top;
        const statVisible = statTop < window.innerHeight - 100;
        
        if (statVisible && !stat.classList.contains('animated')) {
            stat.classList.add('animated');
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
        }
    });
}

// Testimonials slider
let currentSlide = 0;
const totalSlides = testimonials.length;

function showTestimonial(slideIndex) {
    testimonials.forEach((testimonial, index) => {
        testimonial.classList.toggle('active', index === slideIndex);
    });
    
    testimonialBtns.forEach((btn, index) => {
        btn.classList.toggle('active', index === slideIndex);
    });
}

function nextTestimonial() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showTestimonial(currentSlide);
}

function handleTestimonialNavigation(e) {
    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
    currentSlide = slideIndex;
    showTestimonial(currentSlide);
}

// Auto-advance testimonials
let testimonialInterval;

function startTestimonialTimer() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopTestimonialTimer() {
    clearInterval(testimonialInterval);
}

// Form validation and submission
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('name').trim()) {
        errors.push('Name is required');
    }
    
    if (!formData.get('phone').trim()) {
        errors.push('Phone number is required');
    } else if (!/^[\+]?[0-9\-\(\)\s]+$/.test(formData.get('phone'))) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!formData.get('service')) {
        errors.push('Please select a service type');
    }
    
    const email = formData.get('email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    return errors;
}

function showFormMessage(message, type = 'success') {
    // Remove existing message
    const existingMessage = bookingForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type === 'success' ? 'status--success' : 'status--error'}`;
    messageDiv.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-weight: 500;
        animation: fadeIn 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    bookingForm.insertBefore(messageDiv, bookingForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Submit
async function handleFormSubmission(e) {
  e.preventDefault();

  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbxw0M-q0QJ6FHHbWsng1k-Bem0_M5oQPsCeky4lV38NDcxpl_dKBMCGukpDu35ReJJH/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const text = await res.text();
    if (text.includes("Success")) {
      alert("✅ Submitted successfully!");
      bookingForm.reset();
    } else {
      alert("❌ " + text);
    }
  } catch (err) {
    alert(JSON.stringify(err)+" ❌ Network error!");
  }
}

// Parallax effect for hero section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__img');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0) perspective(1000px) rotateY(-5deg) rotateX(2deg)`;
    });
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation class based on element type
                if (element.classList.contains('service-card')) {
                    element.style.animation = 'fadeIn 0.6s ease forwards';
                } else if (element.classList.contains('about__img')) {
                    element.style.animation = 'slideInRight 0.8s ease forwards';
                } else if (element.classList.contains('contact__img')) {
                    element.style.animation = 'slideInLeft 0.8s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.service-card, .about__img, .contact__img').forEach(el => {
        observer.observe(el);
    });
}

// Smooth reveal animations
function addRevealAnimations() {
    const revealElements = document.querySelectorAll('.section__title, .section__subtitle, .hero__content, .about__content');
    
    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
}

// Initialize date input with minimum date as today
function initializeDateInput() {
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// Add floating animation to hero elements
function enhanceFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'none';
            element.style.transform = 'scale(1.2) rotate(10deg)';
            element.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.transition = '';
            element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
        });
    });
}

// Handle scroll-triggered animations
function handleScrollAnimations() {
    const scrollY = window.scrollY;
    
    // Service cards animation
    animateServiceCards();
    
    // Statistics animation
    handleStatsAnimation();
    
    // Parallax effect (reduced for performance)
    if (scrollY < window.innerHeight) {
        handleParallax();
    }
}

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeDateInput();
    createIntersectionObserver();
    addRevealAnimations();
    enhanceFloatingElements();
    startTestimonialTimer();
    
    // Navigation events
    navToggle.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Testimonial navigation
    testimonialBtns.forEach(btn => {
        btn.addEventListener('click', handleTestimonialNavigation);
    });
    
    // Form submission
    bookingForm.addEventListener('submit', handleFormSubmission);
    
    // Scroll events (debounced for performance)
    const debouncedScrollHandler = debounce(() => {
        handleHeaderScroll();
        handleScrollAnimations();
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Testimonial timer controls
    const testimonialSection = document.querySelector('.testimonials');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', stopTestimonialTimer);
        testimonialSection.addEventListener('mouseleave', startTestimonialTimer);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Phone number click tracking (for analytics)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Phone number clicked:', link.href);
        });
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn--primary').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type !== 'submit') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate positions if needed
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
}, 250));

// Add page visibility change handler
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopTestimonialTimer();
    } else {
        startTestimonialTimer();
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// Add error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Image failed to load:', this.src);
        this.style.display = 'none';
    });
});

// Export functions for potential testing (if needed)
window.kkServicePoint = {
    handleHeaderScroll,
    toggleMobileMenu,
    animateServiceCards,
    handleStatsAnimation,
    showTestimonial,
    validateForm
};
