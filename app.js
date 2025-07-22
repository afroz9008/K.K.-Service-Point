// Enhanced JavaScript for K.K. Service Point Landing Page - Fixed Version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initStatsCounter();
    initTestimonialCarousel();
    initBookingForm();
    initScrollEffects();
    initSmoothScrolling();
    
    // Performance optimization
    optimizeAnimations();
});

// Navigation functionality - FIXED
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Active navigation highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    const offset = 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// FIXED: Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#' or telephone links
            if (href === '#' || href.startsWith('#call') || this.href.startsWith('tel:')) {
                return;
            }
            
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right, .animate-scale-up');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add staggered animation delays for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe all animation elements
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Animated statistics counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, {
        threshold: 0.5
    });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const steps = 60;
            const stepValue = target / steps;
            const stepDuration = duration / steps;
            
            let current = 0;
            
            const counter = setInterval(() => {
                current += stepValue;
                
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                
                // Format numbers with + suffix for large numbers
                const displayValue = Math.floor(current);
                stat.textContent = target >= 1000 ? 
                    `${displayValue.toLocaleString()}+` : 
                    `${displayValue}+`;
            }, stepDuration);
        });
    }
}

// FIXED: Enhanced testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!carousel || cards.length === 0) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    let isTransitioning = false;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function showCard(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;

        // Remove active class from current card and dot
        cards[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Update current index
        currentIndex = index;

        // Add active class to new card and dot with delay for smooth transition
        setTimeout(() => {
            cards[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
            isTransitioning = false;
        }, 250);
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % cards.length;
        showCard(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(prevIndex);
    }

    function goToSlide(index) {
        if (index >= 0 && index < cards.length && index !== currentIndex) {
            showCard(index);
        }
    }

    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        autoPlayInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 5000); // Restart auto-play after 5 seconds
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 5000); // Restart auto-play after 5 seconds
        });
    }

    // Touch/swipe support for mobile
    let startX = null;
    let startY = null;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        stopAutoPlay();
    });

    carousel.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startX = null;
        startY = null;
        setTimeout(startAutoPlay, 2000); // Restart auto-play after touch
    });

    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', () => {
        setTimeout(startAutoPlay, 1000);
    });

    // Start auto-play initially
    setTimeout(startAutoPlay, 2000);

    // Intersection observer to pause auto-play when not visible
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(startAutoPlay, 1000);
            } else {
                stopAutoPlay();
            }
        });
    });

    carouselObserver.observe(carousel);
}

// FIXED: Enhanced booking form
function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });

    // Real-time form validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Fix dropdown functionality
    const serviceSelect = form.querySelector('select[name="service"]');
    if (serviceSelect) {
        // Ensure the select is properly styled and functional
        serviceSelect.addEventListener('focus', function() {
            this.style.backgroundColor = 'var(--color-surface)';
        });
        
        serviceSelect.addEventListener('change', function() {
            clearFieldError({ target: this });
        });
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        clearFieldError(e);

        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }

        // Specific validations
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        if (field.type === 'tel' && value && !isValidPhone(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }

        return true;
    }

    function clearFieldError(e) {
        const field = e.target;
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
        field.classList.remove('error');
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorEl = field.parentNode.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.classList.add('field-error');
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    async function handleFormSubmission() {
        // Validate all required fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        }

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Thank you! Your service request has been submitted. We\'ll contact you shortly.', 'success');
            
            // Reset form
            form.reset();
            
            // Redirect to phone call after delay
            setTimeout(() => {
                window.location.href = 'tel:+919998936790';
            }, 3000);
            
        } catch (error) {
            showNotification('Sorry, there was an error submitting your request. Please call us directly.', 'error');
        } finally {
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        }
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.classList.add('notification', `notification--${type}`);
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }
}

// Navbar scroll effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional)
        if (window.innerWidth > 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', debounce(handleScroll, 10));
}

// Performance optimization
function optimizeAnimations() {
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--duration-fast', '0ms');
        document.documentElement.style.setProperty('--duration-normal', '0ms');
        
        // Disable auto-play for carousel
        const carousel = document.getElementById('testimonials-carousel');
        if (carousel) {
            carousel.style.animationPlayState = 'paused';
        }
    }

    // Optimize scroll performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }

    function updateAnimations() {
        // Update scroll-based animations here if needed
        ticking = false;
    }

    // Use passive listeners where appropriate
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', debounce(handleResize, 250), { passive: true });
}

// Handle window resize
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Recalculate carousel positioning if needed
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
        carousel.style.height = 'auto';
        const activeCard = carousel.querySelector('.testimonial-card.active');
        if (activeCard) {
            carousel.style.minHeight = activeCard.offsetHeight + 'px';
        }
    }
}

// Utility function for debouncing
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

// Add CSS for form validation and notifications
const additionalStyles = `
    .form-control.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(192, 21, 47, 0.1);
    }

    .field-error {
        color: var(--color-error);
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: block;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 400px;
        border-left: 4px solid var(--color-info);
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification--success {
        border-left-color: var(--color-success);
    }

    .notification--error {
        border-left-color: var(--color-error);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
    }

    .notification-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }

    .notification-close:hover {
        background-color: var(--color-secondary);
    }

    /* Fix for select dropdown */
    select.form-control {
        cursor: pointer;
        position: relative;
    }

    select.form-control:focus {
        outline: none;
    }

    @media (max-width: 480px) {
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
            transform: translateY(-100px);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize lazy loading for images (optional enhancement)
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Call lazy loading if needed
initLazyLoading();

// Add loading animation for images
const imageStyles = `
    img {
        transition: opacity 0.3s ease;
    }

    img:not(.loaded) {
        opacity: 0.5;
    }

    img.loaded {
        opacity: 1;
    }
`;

const imageStyleSheet = document.createElement('style');
imageStyleSheet.textContent = imageStyles;
document.head.appendChild(imageStyleSheet);