/**
 * BPM Formation - Modern JavaScript
 * Ultra modern interactions and animations
 */

// ==========================================================================
// Global Variables
// ==========================================================================

let currentTestimonial = 1;
let testimonialInterval;
let isScrolling = false;

// ==========================================================================
// DOM Ready
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ==========================================================================
// App Initialization
// ==========================================================================

function initializeApp() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initStripePayments();
    initTestimonials();
    initContactForm();
    initEmailJS();
    initLazyLoading();
    initPerformanceOptimizations();
    
    console.log('BPM Formation - Site initialized successfully! 🎵');
}

// ==========================================================================
// Navigation
// ==========================================================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('🍔 Initializing navigation...', { navToggle, navMenu });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🍔 Hamburger clicked!');
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            console.log('🍔 Menu state:', {
                toggleActive: navToggle.classList.contains('active'),
                menuActive: navMenu.classList.contains('active')
            });
        });
    } else {
        console.error('🚨 Navigation elements not found!', { navToggle, navMenu });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    smoothScrollTo(target);
                }
            }
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        highlightActiveNavLink(sections, navLinks);
    }, { passive: true });
}

// ==========================================================================
// Hero Carousel
// ==========================================================================

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    console.log('Hero carousel slides found:', slides.length);
    
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    function nextSlide() {
        console.log('Switching from slide', currentSlide, 'to', (currentSlide + 1) % slides.length);
        
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Auto-rotate every 5 seconds (plus rapide pour tester)
    setInterval(nextSlide, 5000);
    console.log('Hero carousel initialized with', slides.length, 'slides');
}

// ==========================================================================
// Scroll Effects
// ==========================================================================

function initScrollEffects() {
    // Hero carousel auto-rotation
    initHeroCarousel();
    
    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1;
            const heroSlides = document.querySelectorAll('.hero-slide');
            heroSlides.forEach(slide => {
                slide.style.transform = `translateY(${rate}px)`;
            });
        }, { passive: true });
    }
    
    // Scroll progress indicator
    createScrollProgressIndicator();
    
    // Scroll to top button
    createScrollToTopButton();
}

// ==========================================================================
// Animations
// ==========================================================================

function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
    
    // Number counter animation
    initCounterAnimations();
    
    // Typing effect for hero title
    initTypingEffect();
    
    // Floating elements animation
    initFloatingElements();
    
    // Mouse cursor trail effect
    initCursorTrail();
}

// ==========================================================================
// Testimonials Slider
// ==========================================================================

function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonialCards.length === 0) return;
    
    // Auto-play testimonials
    startTestimonialAutoplay();
    
    // Pause autoplay on hover
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', stopTestimonialAutoplay);
        testimonialSlider.addEventListener('mouseleave', startTestimonialAutoplay);
    }
    
    // Touch/swipe support for mobile
    initTestimonialTouchSupport();
}

function changeTestimonial(direction) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const totalTestimonials = testimonialCards.length;
    
    // Hide current testimonial
    testimonialCards[currentTestimonial - 1].classList.remove('active');
    dots[currentTestimonial - 1].classList.remove('active');
    
    // Calculate next testimonial
    currentTestimonial += direction;
    
    if (currentTestimonial > totalTestimonials) {
        currentTestimonial = 1;
    } else if (currentTestimonial < 1) {
        currentTestimonial = totalTestimonials;
    }
    
    // Show new testimonial
    testimonialCards[currentTestimonial - 1].classList.add('active');
    dots[currentTestimonial - 1].classList.add('active');
    
    // Add slide animation
    const activeCard = testimonialCards[currentTestimonial - 1];
    activeCard.style.opacity = '0';
    activeCard.style.transform = `translateX(${direction > 0 ? '30px' : '-30px'})`;
    
    setTimeout(() => {
        activeCard.style.opacity = '1';
        activeCard.style.transform = 'translateX(0)';
    }, 50);
}

function goToTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Hide current testimonial
    testimonialCards[currentTestimonial - 1].classList.remove('active');
    dots[currentTestimonial - 1].classList.remove('active');
    
    // Set new testimonial
    currentTestimonial = index;
    
    // Show new testimonial
    testimonialCards[currentTestimonial - 1].classList.add('active');
    dots[currentTestimonial - 1].classList.add('active');
    
    // Restart autoplay
    stopTestimonialAutoplay();
    startTestimonialAutoplay();
}

function startTestimonialAutoplay() {
    testimonialInterval = setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function stopTestimonialAutoplay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

function initTestimonialTouchSupport() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    
    slider.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        distX = touch.clientX - startX;
        distY = touch.clientY - startY;
        
        if (Math.abs(distX) > Math.abs(distY)) {
            if (Math.abs(distX) > 50) {
                if (distX > 0) {
                    changeTestimonial(-1); // Swipe right
                } else {
                    changeTestimonial(1); // Swipe left
                }
            }
        }
    }, { passive: true });
}

// ==========================================================================
// Contact Form
// ==========================================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Form validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Floating labels
    initFloatingLabels();
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(e);
    
    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer un email valide';
        }
    }
    
    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)\.]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer un numéro de téléphone valide';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitButton.disabled = true;
    
    // Envoi via EmailJS - Variables simplifiées
    const templateParams = {
        name: formData.get('name'),
        email: formData.get('email'),
        title: `Demande de ${formData.get('formation') || 'formation'} - ${formData.get('name')}`,
        message: `Informations du contact :
👤 Nom : ${formData.get('name')}
📧 Email : ${formData.get('email')}
📱 Téléphone : ${formData.get('phone') || 'Non renseigné'}
🎵 Formation souhaitée : ${formData.get('formation') || 'Non spécifiée'}

💬 Message :
${formData.get('message') || 'Demande de contact sans message spécifique'}

---
Envoyé depuis le site BPM Formation (bpmformation.com)`
    };
    
    // Option 1: EmailJS (si reconnecté)
    // emailjs.send('service_4v8ttrj', 'template_sv04z4j', templateParams)
    
    // Option 2: Backend Nodemailer (plus fiable)
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            formation: formData.get('formation'),
            message: formData.get('message')
        })
    })
    .then(response => response.json())
        .then(() => {
            showNotification('Votre message a été envoyé avec succès! Nous vous recontacterons bientôt.', 'success');
            form.reset();
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer ma demande';
            submitButton.disabled = false;
            
            // Reset floating labels
            inputs.forEach(input => {
                const label = input.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    if (!input.value.trim()) {
                        label.style.top = '50%';
                        label.style.fontSize = 'var(--text-base)';
                        label.style.color = 'var(--gray-500)';
                    }
                }
            });
        })
        .catch((error) => {
            console.error('Erreur EmailJS détaillée:', error);
            console.log('Template params envoyés:', templateParams);
            
            let errorMessage = 'Erreur lors de l\'envoi. ';
            
            if (error.status === 412) {
                errorMessage += 'Problème de configuration du template. Veuillez nous contacter directement.';
            } else if (error.status === 400) {
                errorMessage += 'Données invalides. Vérifiez vos informations.';
            } else {
                errorMessage += 'Veuillez réessayer ou nous contacter directement.';
            }
            
            showNotification(errorMessage, 'error');
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer ma demande';
            submitButton.disabled = false;
        });
}

function initFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (!input || !label) return;
        
        // Set initial state
        input.addEventListener('focus', () => {
            label.style.top = '0';
            label.style.fontSize = 'var(--text-sm)';
            label.style.color = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                label.style.top = '50%';
                label.style.fontSize = 'var(--text-base)';
                label.style.color = 'var(--gray-500)';
            }
        });
        
        // Check initial value
        if (input.value.trim()) {
            label.style.top = '0';
            label.style.fontSize = 'var(--text-sm)';
            label.style.color = 'var(--primary-color)';
        }
    });
}

// ==========================================================================
// Lazy Loading
// ==========================================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==========================================================================
// Performance Optimizations
// ==========================================================================

function initPerformanceOptimizations() {
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Service worker registration
    registerServiceWorker();
}

function preloadCriticalResources() {
    const criticalResources = [
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap', as: 'style' },
        { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', as: 'style' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

function updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
    }
}

function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
}

function optimizeScrollPerformance() {
    let ticking = false;
    
    function updateScrollEffects() {
        // Batch scroll-related updates
        updateNavbarOnScroll();
        updateScrollProgress();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// ==========================================================================
// Helper Functions
// ==========================================================================

function smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80; // Account for fixed navbar
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }
    
    requestAnimationFrame(animation);
}

function highlightActiveNavLink(sections, navLinks) {
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function createScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }
        .scroll-progress-bar {
            height: 100%;
            background: var(--gradient-primary);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(button);
    
    // Add CSS for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: 18px;
            box-shadow: var(--shadow-lg);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-xl);
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide button and click handler
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }, { passive: true });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const start = performance.now();
    const suffix = element.textContent.replace(/[\d\s]/g, '');
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(target * easeOutQuart(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    requestAnimationFrame(updateCounter);
}

function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title .gradient-text');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.feature-icon, .formation-overlay i');
    
    floatingElements.forEach((element, index) => {
        element.style.animation = `float ${3 + (index % 3)}s ease-in-out infinite`;
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    `;
    document.head.appendChild(style);
}

function initCursorTrail() {
    const trail = [];
    const maxTrail = 10;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > maxTrail) {
            trail.shift();
        }
        
        updateCursorTrail();
    });
    
    function updateCursorTrail() {
        const existingTrails = document.querySelectorAll('.cursor-trail');
        existingTrails.forEach(el => el.remove());
        
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            trailElement.style.cssText = `
                position: fixed;
                top: ${point.y}px;
                left: ${point.x}px;
                width: ${8 - index * 0.5}px;
                height: ${8 - index * 0.5}px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - index * 0.1};
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            `;
            document.body.appendChild(trailElement);
            
            setTimeout(() => {
                if (trailElement.parentNode) {
                    trailElement.remove();
                }
            }, 500);
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add CSS for notifications
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                max-width: 400px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            .notification-success { border-left: 4px solid var(--accent-color); }
            .notification-error { border-left: 4px solid var(--danger-color); }
            .notification-info { border-left: 4px solid var(--primary-color); }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--gray-400);
                cursor: pointer;
                padding: 4px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==========================================================================
// Global Functions (for HTML onclick handlers)
// ==========================================================================

// Make functions available globally for HTML onclick handlers
window.changeTestimonial = changeTestimonial;
window.currentTestimonial = (index) => goToTestimonial(index);

// ==========================================================================
// Additional Features
// ==========================================================================

// Add loading screen
function initLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <img src="assets/Logo BPM Formations.png?v=2024" alt="BPM Formation">
                <h2>BPM Formation</h2>
            </div>
            <div class="loading-spinner"></div>
            <p>Chargement en cours...</p>
        </div>
    `;
    
    // Add CSS for loading screen
    const style = document.createElement('style');
    style.textContent = `
        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        .loading-content {
            text-align: center;
        }
        .loading-logo {
            margin-bottom: 2rem;
        }
        .loading-logo img {
            height: 60px;
            margin-bottom: 1rem;
        }
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen when page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
}

// Clear service worker cache if needed
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('Service worker unregistered for cache refresh');
        }
    });
}

// Clear browser cache programmatically
if ('caches' in window) {
    caches.keys().then(function(names) {
        names.forEach(function(name) {
            caches.delete(name);
            console.log('Cache cleared:', name);
        });
    });
}

// Initialize loading screen immediately
initLoadingScreen();

// Stripe Integration
function initStripePayments() {
    // Initialize Stripe (remplacez par votre clé publique Stripe)
        const stripe = Stripe('pk_live_51Rr3AwJNNw6IWp9FXu3tMTyKqO5FKJR96fgLijsjM2PgUdkIQxAhnK8WBb0MWXWColc1r83cBCScOyRftEI7uGXO00VilueW0E'); // REMPLACEZ PAR VOTRE CLÉ PUBLIQUE
    
    // Ajouter les event listeners aux boutons de paiement
    document.querySelectorAll('.stripe-payment').forEach(button => {
        button.addEventListener('click', async function() {
            const price = this.getAttribute('data-price');
            const formation = this.getAttribute('data-formation');
            
            // Afficher un loading sur le bouton
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            this.disabled = true;
            
            try {
                // Créer une session de paiement Stripe
                const response = await fetch('/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formation: formation,
                        price: parseInt(price),
                        currency: 'eur'
                    })
                });
                
                const session = await response.json();
                
                if (session.error) {
                    throw new Error(session.error);
                }
                
                // Rediriger vers Stripe Checkout
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id
                });
                
                if (result.error) {
                    throw new Error(result.error.message);
                }
                
            } catch (error) {
                console.error('Erreur Stripe:', error);
                showNotification('Erreur lors du paiement. Veuillez réessayer.', 'error');
                
                // Restaurer le bouton
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    });
}

// EmailJS Initialization
function initEmailJS() {
    // Initialize EmailJS with your public key
    emailjs.init('UGRIX5XXp726VhWaT'); // Clé publique EmailJS BPM Formation
    console.log('📧 EmailJS initialized for BPM Formation');
}

// Add error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    showNotification('Une erreur est survenue. Veuillez rafraîchir la page.', 'error');
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Site Performance:', {
                loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
            });
        }, 0);
    });
}

// Fonction pour rediriger directement vers Stripe Checkout
window.redirectToStripe = async function(formation, price) {
    const button = window.event ? window.event.target.closest('button') : null;
    
    try {
        console.log('🚀 Redirection vers Stripe pour:', formation);
        
        // Si c'est la Formation Ingé/Beatmaking, demander l'âge pour appliquer la réduction
        let customerAge = null;
        if (formation === 'Formation Ingé/Beatmaking') {
            const age = await askForAge();
            if (age === null) {
                // L'utilisateur a annulé
                return;
            }
            customerAge = age;
        }
        
        // Afficher un loader
        if (button) {
            const originalText = button.innerHTML;
            button.setAttribute('data-original-text', originalText);
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
            button.disabled = true;
        }
        
        // Créer la session Stripe
        const response = await fetch('http://localhost:3000/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                formation: formation,
                price: price,
                paymentMode: 'full', // Mode par défaut
                customer: customerAge ? { age: customerAge } : null
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Session Stripe créée:', data);
        console.log('📍 URL de redirection:', data.url);
        
        // Rediriger vers Stripe Checkout
        if (data.url) {
            console.log('🔄 Redirection vers Stripe...');
            window.location.href = data.url;
        } else {
            throw new Error('URL de redirection non reçue du serveur');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la redirection vers Stripe:', error);
        
        // Restaurer le bouton
        if (button) {
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.innerHTML = originalText;
            }
            button.disabled = false;
        }
        
        // Afficher l'erreur
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

// Fonction pour demander l'âge avec un modal
function askForAge() {
    return new Promise((resolve) => {
        // Créer le modal
        const modalHTML = `
            <div id="age-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                ">
                    <h2 style="margin: 0 0 20px 0; color: #000; font-size: 24px; text-align: center;">
                        🎓 Quel est votre âge ?
                    </h2>
                    <p style="margin: 0 0 25px 0; color: #666; text-align: center; font-size: 14px;">
                        Pour appliquer les réductions selon votre âge
                    </p>
                    <input 
                        type="number" 
                        id="age-input" 
                        min="1" 
                        max="120" 
                        placeholder="Entrez votre âge"
                        style="
                            width: 100%;
                            padding: 15px;
                            font-size: 18px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            text-align: center;
                            margin-bottom: 20px;
                            box-sizing: border-box;
                        "
                    />
                    <div style="display: flex; gap: 10px;">
                        <button id="age-cancel" style="
                            flex: 1;
                            padding: 15px;
                            background: #e0e0e0;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            cursor: pointer;
                            color: #333;
                            font-weight: 600;
                        ">Annuler</button>
                        <button id="age-confirm" style="
                            flex: 1;
                            padding: 15px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            cursor: pointer;
                            color: white;
                            font-weight: 600;
                        ">Continuer</button>
                    </div>
                    <div id="age-price-info" style="
                        margin-top: 20px;
                        padding: 15px;
                        background: #f0f0f0;
                        border-radius: 8px;
                        text-align: center;
                        font-size: 14px;
                        color: #666;
                        display: none;
                    "></div>
                </div>
            </div>
        `;
        
        // Ajouter le modal au DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('age-modal');
        const input = document.getElementById('age-input');
        const cancelBtn = document.getElementById('age-cancel');
        const confirmBtn = document.getElementById('age-confirm');
        const priceInfo = document.getElementById('age-price-info');
        
        // Focus sur l'input
        input.focus();
        
        // Afficher le prix en fonction de l'âge
        input.addEventListener('input', () => {
            const age = parseInt(input.value);
            if (age > 0) {
                let price = '800€';
                let message = '';
                
                if (age < 21) {
                    price = '600€';
                    message = `💙 Tarif -21 ans : ${price}`;
                } else if (age < 25) {
                    price = '700€';
                    message = `💚 Tarif -25 ans : ${price}`;
                } else {
                    price = '800€';
                    message = `💰 Tarif normal : ${price}`;
                }
                
                priceInfo.textContent = message;
                priceInfo.style.display = 'block';
            } else {
                priceInfo.style.display = 'none';
            }
        });
        
        // Annuler
        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(null);
        });
        
        // Confirmer
        const confirm = () => {
            const age = parseInt(input.value);
            if (age > 0 && age < 120) {
                modal.remove();
                resolve(age);
            } else {
                input.style.borderColor = 'red';
                setTimeout(() => {
                    input.style.borderColor = '#ddd';
                }, 1000);
            }
        };
        
        confirmBtn.addEventListener('click', confirm);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirm();
            }
        });
    });
}