// NCPOR Outreach Portal - Main JavaScript
// Handles dark mode, mobile menu, scroll animations, and counters

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initFeaturedHero();
});

// ========== DARK MODE ==========
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    // Check for saved preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        
        // Save preference
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// ========== SCROLL REVEAL ANIMATION ==========
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// ========== ANIMATED COUNTERS ==========
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-2xl');
    } else {
        navbar.classList.remove('shadow-2xl');
    }
    
    lastScroll = currentScroll;
});

// ========== FEATURED HERO (Video, Slider, Parallax) ==========
function initFeaturedHero() {
    initHeroVideo();
    initHeroSlider();
    initHeroParallax();
}

// Hero Video Controls
function initHeroVideo() {
    const video = document.getElementById('heroVideoPlayer');
    const playPauseBtn = document.getElementById('videoPlayPause');
    const muteToggleBtn = document.getElementById('videoMuteToggle');
    
    if (!video || !playPauseBtn || !muteToggleBtn) return;
    
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const muteIcon = document.getElementById('muteIcon');
    const unmuteIcon = document.getElementById('unmuteIcon');
    
    // Play/Pause Toggle
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            video.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });
    
    // Mute/Unmute Toggle
    muteToggleBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            muteIcon.classList.remove('hidden');
            unmuteIcon.classList.add('hidden');
        } else {
            muteIcon.classList.add('hidden');
            unmuteIcon.classList.remove('hidden');
        }
    });
    
    // Accessibility: Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            playPauseBtn.click();
        }
    });
}

// Hero Image Slider
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (slides.length <= 1) return; // No need for slider with single image
    
    let currentSlide = 0;
    let autoplayInterval;
    
    // Function to show specific slide
    function showSlide(index) {
        // Wrap around
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Hide all slides
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.classList.remove('active');
        });
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('bg-white', 'scale-125');
            dot.classList.add('bg-white/50');
        });
        
        // Show current slide
        slides[index].style.opacity = '1';
        slides[index].classList.add('active');
        
        if (dots[index]) {
            dots[index].classList.remove('bg-white/50');
            dots[index].classList.add('bg-white', 'scale-125');
        }
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto-play (every 5 seconds)
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay(); // Restart autoplay after manual interaction
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });
    
    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopAutoplay();
            startAutoplay();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        }
    });
    
    // Pause autoplay on hover (better UX)
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Start autoplay
    startAutoplay();
}

// Hero Parallax/Zoom Effect
function initHeroParallax() {
    const heroSection = document.getElementById('featured-hero');
    if (!heroSection) return;
    
    const mediaElements = heroSection.querySelectorAll('.hero-media-zoom');
    
    if (mediaElements.length === 0) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroHeight = heroSection.offsetHeight;
                
                // Only apply effect while hero is visible
                if (scrolled < heroHeight) {
                    const scale = 1 + (scrolled / heroHeight) * 0.1; // Scale from 1 to 1.1
                    
                    mediaElements.forEach(media => {
                        media.style.transform = `scale(${scale})`;
                    });
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}
