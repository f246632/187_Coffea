/* ===================================
   COFFEA BERLIN - MAIN JAVASCRIPT
   Interactive Features & Navigation
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // NAVIGATION
    // ===================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navigation on Scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        }

        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');

            // Reset hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link on Scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - navbar.offsetHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .menu-category, .review-card, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================================
    // DYNAMIC OPENING HOURS
    // ===================================
    function updateOpeningStatus() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        const hoursRows = document.querySelectorAll('.hours-row');

        // Opening hours: Mon, Wed-Fri: 9-18, Sat-Sun: 10-18, Tue: Closed
        const schedule = {
            0: { open: 10, close: 18 }, // Sunday
            1: { open: 9, close: 18 },  // Monday
            2: { open: 0, close: 0 },   // Tuesday (Closed)
            3: { open: 9, close: 18 },  // Wednesday
            4: { open: 9, close: 18 },  // Thursday
            5: { open: 9, close: 18 },  // Friday
            6: { open: 10, close: 18 }  // Saturday
        };

        const todaySchedule = schedule[day];
        let isOpen = false;

        if (todaySchedule.open !== 0 && hour >= todaySchedule.open && hour < todaySchedule.close) {
            isOpen = true;
        }

        // Add status indicator to navigation or hero
        const navBrand = document.querySelector('.nav-brand h2');
        if (navBrand && window.innerWidth > 768) {
            const statusDot = document.createElement('span');
            statusDot.style.cssText = `
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-left: 10px;
                background: ${isOpen ? '#4CAF50' : '#999'};
                animation: ${isOpen ? 'pulse 2s infinite' : 'none'};
            `;
            statusDot.title = isOpen ? 'Open now' : 'Closed';

            if (!navBrand.querySelector('span')) {
                navBrand.appendChild(statusDot);
            }
        }
    }

    updateOpeningStatus();

    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: var(--shadow-md);
    `;
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.16)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    });

    // ===================================
    // PERFORMANCE OPTIMIZATIONS
    // ===================================

    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // ACCESSIBILITY ENHANCEMENTS
    // ===================================

    // Keyboard navigation for menu items
    const focusableElements = document.querySelectorAll('a, button, input, textarea');
    focusableElements.forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.tagName === 'A' || this.tagName === 'BUTTON') {
                    this.click();
                }
            }
        });
    });

    // ===================================
    // CONSOLE WELCOME MESSAGE
    // ===================================
    console.log('%c🌟 Coffea Berlin', 'font-size: 24px; font-weight: bold; color: #6B4423;');
    console.log('%cWebsite crafted with ☕ and 💛', 'font-size: 14px; color: #666;');
    console.log('%cVisit us at Lückstraße 56, Berlin', 'font-size: 12px; color: #999;');

    // ===================================
    // ANIMATION FOR PULSE EFFECT
    // ===================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
